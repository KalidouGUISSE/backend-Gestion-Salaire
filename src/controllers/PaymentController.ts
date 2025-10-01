import type { Request, Response } from "express";
import type { User } from "@prisma/client";
import { PaymentService } from "../services/PaymentService.js";
import { CreatePaymentSchema, ListPaymentsSchema, GenerateReceiptSchema } from "../validatorsSchema/PaymentValidator.js";
import { formatSuccess, formatError } from "../utils/responseFormatter.js";
import { HttpStatus } from "../enums/httpStatus.js";
import { prisma } from "../prisma/client.js";

const service = new PaymentService();

export class PaymentController {
    static async create(req: Request, res: Response) {
        try {
            const user = req.user as User;
            console.log('User in create payment:', user);
            console.log('Request body:', req.body);

            const data = CreatePaymentSchema.parse(req.body);
            console.log('Parsed data:', data);

            let companyId: number;
            if (user?.role === 'ADMIN' || user?.role === 'CASHIER') {
                companyId = user.companyId!;
            } else if (user?.role === 'SUPER_ADMIN') {
                const queryCompanyId = req.query.companyId as string;
                companyId = queryCompanyId ? parseInt(queryCompanyId) : 1;
            } else {
                companyId = 1; // Default for testing
            }

            console.log('Company ID:', companyId);

            const paymentData = {
                ...data,
                companyId,
            };

            const payment = await service.createPayment(paymentData, user);
            res.status(HttpStatus.CREATED).json(formatSuccess(payment, HttpStatus.CREATED, "Paiement créé avec succès"));
        } catch (error: any) {
            console.error('Error in PaymentController.create:', error);
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const user = req.user as User;

            let companyId: number;
            if (user?.role === 'ADMIN' || user?.role === 'CASHIER') {
                companyId = user.companyId!;
            } else if (user?.role === 'SUPER_ADMIN') {
                const queryCompanyId = req.query.companyId as string;
                companyId = queryCompanyId ? parseInt(queryCompanyId) : 1; // Default to company 1 for testing
            } else {
                companyId = 1; // Default for testing
            }

            const parsedFilters = ListPaymentsSchema.parse(req.query);
            const filters = {
                payRunId: parsedFilters.payRunId,
                status: parsedFilters.status,
                page: parsedFilters.page,
                limit: parsedFilters.limit,
            };
            const payments = await service.getPayments(companyId, filters, { page: filters.page, limit: filters.limit });
            res.json(formatSuccess(payments));
        } catch (error: any) {
            console.error('Error in PaymentController.getAll:', error);
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }

    static async getForPayRun(req: Request, res: Response) {
        try {
            const user = req.user as User;
            if (!user || !['ADMIN', 'CASHIER', 'SUPER_ADMIN'].includes(user.role)) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const payRunId = Number(req.params.payRunId);
            const companyId = user.role === 'ADMIN' ? user.companyId! : parseInt(req.query.companyId as string) || user.companyId!;

            if (!companyId) {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "Entreprise requise"));
            }

            const filters = ListPaymentsSchema.parse({
                ...req.query,
                payRunId
            });

            const payments = await service.getPayments(companyId, { ...filters, payRunId }, { page: filters.page, limit: filters.limit });
            res.json(formatSuccess(payments));
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }

    static async generateReceipt(req: Request, res: Response) {
        try {
            const user = req.user as User;
            if (!user || !['ADMIN', 'CASHIER', 'SUPER_ADMIN'].includes(user.role)) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const { payslipId, payRunId } = GenerateReceiptSchema.parse(req.body);
            const companyId = user.role === 'ADMIN' ? user.companyId! : parseInt(req.query.companyId as string) || user.companyId!;

            if (!companyId) {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "Entreprise requise"));
            }

            let filePath: string;

            if (payslipId) {
                // Single payment receipt - get payment ID from payslip's payments
                const payments = await prisma.payment.findMany({
                    where: { payslipId },
                    select: { id: true }
                });

                if (payments.length === 0) {
                    return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Aucun paiement trouvé pour ce bulletin"));
                }

                // For single payslip, generate for all its payments
                filePath = await service.generateReceipt(payments.map(p => p.id), companyId);
            } else if (payRunId) {
                filePath = await service.exportPayRunReceipts(payRunId, companyId);
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "ID bulletin ou cycle de paie requis"));
            }

            res.json(formatSuccess({ filePath }, HttpStatus.OK, "Reçu généré avec succès"));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }

    static async exportPayRunReceipts(req: Request, res: Response) {
        try {
            const user = req.user as User;
            if (!user || !['ADMIN', 'CASHIER', 'SUPER_ADMIN'].includes(user.role)) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const payRunId = Number(req.params.payRunId);
            const companyId = user.role === 'ADMIN' ? user.companyId! : parseInt(req.query.companyId as string) || user.companyId!;

            if (!companyId) {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "Entreprise requise"));
            }

            const filePath = await service.exportPayRunReceipts(payRunId, companyId);
            res.json(formatSuccess({ filePath }, HttpStatus.OK, "Reçus générés avec succès"));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }

    static async getByEmployeeId(req: Request, res: Response) {
        try {
            const user = req.user as User;
            if (!user || !['ADMIN', 'CASHIER', 'SUPER_ADMIN'].includes(user.role)) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const employeeId = Number(req.params.employeeId);
            const companyId = user.role === 'ADMIN' ? user.companyId! : parseInt(req.query.companyId as string) || user.companyId!;

            if (!companyId) {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "Entreprise requise"));
            }

            const payments = await service.getPaymentsByEmployeeId(employeeId, companyId);
            res.json(formatSuccess(payments));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }
}
