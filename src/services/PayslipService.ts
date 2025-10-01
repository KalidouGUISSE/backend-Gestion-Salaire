import type { Payslip } from "@prisma/client";
import { PayslipRepository } from "../repositories/PayslipRepository.js";
import { prisma } from "../prisma/client.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";

export class PayslipService {
    private repo: PayslipRepository;

    constructor() {
        this.repo = new PayslipRepository();
    }

    findPayslipById(id: number): Promise<Payslip | null> {
        return this.repo.findById(id, { include: { employee: true, payRun: true, payments: true } });
    }

    getAllByPayRun(
        payRunId: number,
        filters: { status?: string; employeeId?: number },
        query: PaginationQuery
    ): Promise<PaginationResult<Payslip>> {
        return this.repo.findByPayRun(payRunId, filters, query);
    }

    async createPayslip(data: Omit<Payslip, "id" | "createdAt" | "updatedAt">): Promise<Payslip> {
        return this.repo.create(data as any);
    }

    async deletePayslip(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    updatePayslip(id: number, data: Partial<Payslip>): Promise<Payslip> {
        return this.repo.update(id, data as any);
    }

    async getPayRunStatus(payRunId: number): Promise<{ status: string; companyId: number }> {
        const payRun = await this.repo.getPayRunStatus(payRunId);
        return payRun;
    }

    async getPayslipsByEmployeeId(employeeId: number): Promise<Payslip[]> {
        return this.repo.findByEmployeeId(employeeId);
    }

    async getAllPayslipsForPayment(query: PaginationQuery, companyId?: number): Promise<PaginationResult<Payslip>> {
        return this.repo.findAllForPayment(query, companyId);
    }

    async generatePDF(payslipId: number): Promise<string> {
        const payslip = await this.repo.findById(payslipId, { include: { employee: true, payRun: true } }) as any;
        if (!payslip) {
            throw new Error("Payslip not found");
        }

        const company = await prisma.company.findUnique({ where: { id: payslip.payRun.companyId } });
        if (!company) {
            throw new Error("Company not found");
        }

        // Create uploads directory if not exists
        const uploadsDir = path.join(process.cwd(), 'uploads', 'payslips');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const pdfPath = path.join(uploadsDir, `payslip_${payslipId}.pdf`);
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(pdfPath));

        // Header
        doc.fontSize(20).text("Bulletin de Paie", { align: 'center' });
        doc.moveDown();

        // Company Info
        doc.fontSize(12).text(`Entreprise: ${company.name}`);
        doc.text(`Période: ${payslip.payRun.periodStart.toLocaleDateString()} - ${payslip.payRun.periodEnd.toLocaleDateString()}`);
        doc.moveDown();

        // Employee Info
        doc.text(`Employé: ${payslip.employee.fullName}`);
        doc.text(`Poste: ${payslip.employee.position || 'N/A'}`);
        doc.moveDown();

        // Amounts
        doc.fontSize(14).text("Détails du Salaire:");
        doc.moveDown(0.5);
        doc.text(`Salaire Brut: ${payslip.gross.toString()} ${company.currency}`);
        doc.text(`Déductions: ${payslip.deductions.toString()} ${company.currency}`);
        doc.text(`Net à Payer: ${payslip.netPayable.toString()} ${company.currency}`);
        doc.text(`Payé: ${payslip.paidAmount.toString()} ${company.currency}`);
        doc.moveDown();

        // Status
        doc.text(`Statut: ${payslip.status}`);

        doc.end();

        // Update payslip with pdfPath
        await this.updatePayslip(payslipId, { pdfPath });

        return pdfPath;
    }
}