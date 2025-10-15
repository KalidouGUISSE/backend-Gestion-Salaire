import type { Payment, User, PaymentMethod } from "@prisma/client";
import { PaymentRepository } from "../repositories/PaymentRepository.js";
import { prisma } from "../prisma/client.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export class PaymentService {
    private repo: PaymentRepository;

    constructor() {
        this.repo = new PaymentRepository();
    }

    async createPayment(
        data: {
            companyId: number;
            payslipId?: number | undefined;
            amount: number;
            method: PaymentMethod;
            reference?: string | undefined;
            notes?: string | undefined;
        },
        user: User
    ): Promise<Payment> {

        console.log('{}{}{}{}{}{}{]{}');
        
        return await prisma.$transaction(async (tx) => {
            // Create payment
            const payment = await tx.payment.create({
                data: {
                    ...data,
                    payslipId: data.payslipId ?? null,
                    reference: data.reference ?? null,
                    notes: data.notes ?? null,
                    paidById: user.id,
                },
                include: {
                    payslip: {
                        include: {
                            employee: true,
                            payRun: {
                                include: {
                                    company: true
                                }
                            }
                        }
                    },
                    paidBy: true,
                }
            });

            // If linked to payslip, update payslip
            if (payment.payslipId) {
                const payslip = await tx.payslip.findUnique({
                    where: { id: payment.payslipId }
                });
                if (!payslip) throw new Error("Bulletin non trouvé");

                const totalPaid = await this.repo.getTotalPaidForPayslip(payment.payslipId);
                const newTotalPaid = totalPaid + Number(payment.amount);

                let status: string = 'PENDING';
                if (newTotalPaid >= Number(payslip.netPayable)) {
                    status = 'PAID';
                } else if (newTotalPaid > 0) {
                    status = 'PARTIAL';
                }

                await tx.payslip.update({
                    where: { id: payment.payslipId },
                    data: {
                        paidAmount: newTotalPaid,
                        status: status as any,
                    }
                });
            }

            // Generate PDF receipt and create Document record
            const filePath = await this.generateSingleReceipt(payment);
            const fileName = path.basename(filePath);

            await tx.document.create({
                data: {
                    companyId: payment.companyId,
                    type: 'reçu',
                    path: filePath,
                    meta: {
                        paymentId: payment.id,
                        payslipId: payment.payslipId,
                        amount: payment.amount.toString(),
                        method: payment.method
                    }
                }
            });

            return payment;
        });
    }

    getPayments(
        companyId: number,
        filters: {
            payRunId?: number | undefined;
            status?: string | undefined;
            startDate?: Date;
            endDate?: Date;
            method?: string;
        },
        query: PaginationQuery
    ): Promise<PaginationResult<Payment>> {
        return this.repo.findByCompanyAndFilters(companyId, filters, query);
    }

    async getPaymentsByEmployeeId(employeeId: number, companyId: number): Promise<Payment[]> {
        return this.repo.findByEmployeeId(employeeId, companyId);
    }

    // async generateReceipt(paymentIds: number[], companyId: number): Promise<string> {
    //     // Get payments with details
    //     const payments = await prisma.payment.findMany({
    //         where: {
    //             id: { in: paymentIds },
    //             companyId,
    //         },
    //         include: {
    //             payslip: {
    //                 include: {
    //                     employee: true,
    //                     payRun: {
    //                         include: {
    //                             company: true,
    //                         }
    //                     }
    //                 }
    //             },
    //             paidBy: true,
    //         }
    //     });

    //     if (payments.length === 0) {
    //         throw new Error("Aucun paiement trouvé");
    //     }

    //     const company = payments[0].payslip?.payRun?.company!;
    //     if (!company) {
    //         throw new Error("Entreprise non trouvée");
    //     }

    //     // Create PDF
    //     const doc = new PDFDocument();
    //     const fileName = `receipt_${Date.now()}.pdf`;
    //     const filePath = path.join(process.cwd(), 'uploads', 'receipts', fileName);

    //     // Ensure directory exists
    //     const dir = path.dirname(filePath);
    //     if (!fs.existsSync(dir)) {
    //         fs.mkdirSync(dir, { recursive: true });
    //     }

    //     const stream = fs.createWriteStream(filePath);
    //     doc.pipe(stream);

    //     // Header
    //     doc.fontSize(20).text('Reçu de Paiement', { align: 'center' });
    //     doc.moveDown();
    //     doc.fontSize(12).text(`Entreprise: ${company.name}`);
    //     doc.text(`Adresse: ${company.address || 'N/A'}`);
    //     doc.moveDown();

    //     // Payments table
    //     doc.fontSize(14).text('Détails des Paiements:');
    //     doc.moveDown();

    //     payments.forEach((payment, index) => {
    //         doc.fontSize(10);
    //         doc.text(`Paiement ${index + 1}:`);
    //         doc.text(`Employé: ${payment.payslip?.employee?.fullName || 'N/A'}`);
    //         doc.text(`Montant: ${payment.amount} ${company.currency}`);
    //         doc.text(`Méthode: ${payment.method}`);
    //         doc.text(`Référence: ${payment.reference || 'N/A'}`);
    //         doc.text(`Date: ${payment.paidAt.toLocaleDateString()}`);
    //         doc.text(`Payé par: ${payment.paidBy?.fullName || 'N/A'}`);
    //         doc.moveDown();
    //     });

    //     // Total
    //     const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    //     doc.fontSize(12).text(`Total: ${total} ${company.currency}`, { align: 'right' });

    //     doc.end();

    //     return new Promise((resolve, reject) => {
    //         stream.on('finish', () => resolve(filePath));
    //         stream.on('error', reject);
    //     });
    // }
    async generateSingleReceipt(payment: Payment & {
        payslip: {
            employee: any;
            payRun: {
                company: any;
            };
        } | null;
        paidBy: any | null;
    }): Promise<string> {

        const company = payment.payslip!.payRun!.company!;
        if (!company) {
            throw new Error("Entreprise non trouvée");
        }

        // Create PDF
        const doc = new PDFDocument();
        const fileName = `receipt_${payment.id}_${Date.now()}.pdf`;
        const filePath = path.join(process.cwd(), "uploads", "receipts", fileName);

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text("Reçu de Paiement", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Entreprise: ${company.name}`);
        doc.text(`Adresse: ${company.address || "N/A"}`);
        doc.moveDown();

        // Payment details
        doc.fontSize(14).text("Détails du Paiement:");
        doc.moveDown();

        const employeeName = payment.payslip?.employee?.fullName || "N/A";
        const method = payment.method || "N/A";
        const reference = payment.reference || "N/A";
        const paidBy = payment.paidBy?.fullName || "N/A";
        const date = payment.paidAt ? payment.paidAt.toLocaleDateString() : "N/A";

        doc.fontSize(10);
        doc.text(`Employé: ${employeeName}`);
        doc.text(`Montant: ${payment.amount} ${company.currency}`);
        doc.text(`Méthode: ${method}`);
        doc.text(`Référence: ${reference}`);
        doc.text(`Date: ${date}`);
        doc.text(`Payé par: ${paidBy}`);
        doc.moveDown();

        // Total
        doc.fontSize(12).text(`Total: ${payment.amount} ${company.currency}`, { align: "right" });

        doc.end();

        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve(filePath));
            stream.on("error", reject);
        });
    }

    async generateReceipt(paymentIds: number[], companyId: number): Promise<string> {
        // Récupération des paiements avec leurs détails
        const payments = await prisma.payment.findMany({
            where: {
                id: { in: paymentIds },
                companyId,
            },
            include: {
                payslip: {
                    include: {
                        employee: true,
                        payRun: {
                            include: {
                                company: true,
                            }
                        }
                    }
                },
                paidBy: true,
            }
        });

        if (payments.length === 0) {
            throw new Error("Aucun paiement trouvé");
        }

        // Récupération sécurisée de l’entreprise
        const company = payments[0]!.payslip!.payRun!.company!;
        if (!company) {
            throw new Error("Entreprise non trouvée pour ces paiements");
        }

        // Création du PDF
        const doc = new PDFDocument();
        const fileName = `receipt_${Date.now()}.pdf`;
        const filePath = path.join(process.cwd(), "uploads", "receipts", fileName);

        // Vérifier et créer le dossier si nécessaire
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // ---- HEADER ----
        doc.fontSize(20).text("Reçu de Paiement", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Entreprise: ${company.name}`);
        doc.text(`Adresse: ${company.address || "N/A"}`);
        doc.moveDown();

        // ---- PAYMENTS ----
        doc.fontSize(14).text("Détails des Paiements:");
        doc.moveDown();

        payments.forEach((payment, index) => {
            const employeeName = payment.payslip?.employee?.fullName || "N/A";
            const method = payment.method || "N/A";
            const reference = payment.reference || "N/A";
            const paidBy = payment.paidBy?.fullName || "N/A";
            const date = payment.paidAt
                ? payment.paidAt.toLocaleDateString()
                : "N/A";

            doc.fontSize(10);
            doc.text(`Paiement ${index + 1}:`);
            doc.text(`Employé: ${employeeName}`);
            doc.text(`Montant: ${payment.amount} ${company.currency}`);
            doc.text(`Méthode: ${method}`);
            doc.text(`Référence: ${reference}`);
            doc.text(`Date: ${date}`);
            doc.text(`Payé par: ${paidBy}`);
            doc.moveDown();
        });

        // ---- TOTAL ----
        const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        doc.fontSize(12).text(`Total: ${total} ${company.currency}`, {
            align: "right",
        });

        doc.end();

        // Retourner le chemin une fois le fichier généré
        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve(filePath));
            stream.on("error", reject);
        });
    }

    async validateQR(paymentId: number, qrToken: string): Promise<Payment> {
        return await prisma.$transaction(async (tx) => {
            // Find the payment
            const payment = await tx.payment.findUnique({
                where: { id: paymentId },
                include: {
                    payslip: {
                        include: {
                            employee: {
                                include: {
                                    profile: true
                                }
                            }
                        }
                    }
                }
            });

            if (!payment) {
                throw new Error("Paiement non trouvé");
            }

            if (!payment.payslip) {
                throw new Error("Ce paiement n'est pas lié à un bulletin");
            }

            const employee = payment.payslip.employee;
            if (!employee || !employee.profile) {
                throw new Error("Profil employé non trouvé");
            }

            if (employee.profile.qrToken !== qrToken) {
                throw new Error("Jeton QR invalide pour cet employé");
            }

            // Update payment as QR validated
            const updatedPayment = await tx.payment.update({
                where: { id: paymentId },
                data: { qrValidated: true },
                include: {
                    payslip: {
                        include: {
                            employee: true
                        }
                    }
                }
            });

            // Log the validation (you can extend this with a proper logging system)
            console.log(`Paiement ${paymentId} validé par QR pour employé ${employee.fullName}`);

            return updatedPayment;
        });
    }

    async exportPayRunReceipts(payRunId: number, companyId: number): Promise<string> {
        // Get all payments for the payrun
        const payments = await prisma.payment.findMany({
            where: {
                payslip: {
                    payRunId
                },
                companyId
            },
            include: {
                payslip: {
                    include: {
                        employee: true,
                        payRun: {
                            include: {
                                company: true,
                            }
                        }
                    }
                },
                paidBy: true,
            }
        });

        if (payments.length === 0) {
            throw new Error("Aucun paiement trouvé pour cette période de payrun");
        }

        const company = payments[0]!.payslip!.payRun!.company!;
        if (!company) {
            throw new Error("Entreprise non trouvée");
        }

        // Create PDF
        const doc = new PDFDocument();
        const fileName = `payrun_receipts_${payRunId}_${Date.now()}.pdf`;
        const filePath = path.join(process.cwd(), "uploads", "receipts", fileName);

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text("Reçus de Paiement - Période de PayRun", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Entreprise: ${company.name}`);
        doc.text(`Adresse: ${company.address || "N/A"}`);
        doc.moveDown();

        // Payments table
        doc.fontSize(14).text("Détails des Paiements:");
        doc.moveDown();

        payments.forEach((payment, index) => {
            const employeeName = payment.payslip?.employee?.fullName || "N/A";
            const method = payment.method || "N/A";
            const reference = payment.reference || "N/A";
            const paidBy = payment.paidBy?.fullName || "N/A";
            const date = payment.paidAt ? payment.paidAt.toLocaleDateString() : "N/A";

            doc.fontSize(10);
            doc.text(`Paiement ${index + 1}:`);
            doc.text(`Employé: ${employeeName}`);
            doc.text(`Montant: ${payment.amount} ${company.currency}`);
            doc.text(`Méthode: ${method}`);
            doc.text(`Référence: ${reference}`);
            doc.text(`Date: ${date}`);
            doc.text(`Payé par: ${paidBy}`);
            doc.moveDown();
        });

        // Total
        const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        doc.fontSize(12).text(`Total: ${total} ${company.currency}`, { align: "right" });

        doc.end();

        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve(filePath));
            stream.on("error", reject);
        });
    }
}