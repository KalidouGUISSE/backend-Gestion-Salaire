import type { Request, Response } from "express";
import { PayslipService } from "../services/PayslipService.js";
import { UpdatePayslipSchema, CreatePayslipSchema } from "../validatorsSchema/PayslipValidator.js";
import { formatSuccess, formatError } from "../utils/responseFormatter.js";
import { HttpStatus } from "../enums/httpStatus.js";
import type { PaginationQuery } from "../utils/pagination.js";

const service = new PayslipService();

export class PayslipController {
    static async getAll(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const query: PaginationQuery = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 10,
            };
            const filters: { status?: string; employeeId?: number } = {};
            if (req.query.status) filters.status = req.query.status as string;
            if (req.query.employeeId) filters.employeeId = Number(req.query.employeeId);

            const payslips = await service.getAllByPayRun(Number(req.params.payRunId), filters, query);
            res.json(formatSuccess(payslips));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const user = req.user as any;
            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const data = CreatePayslipSchema.parse(req.body) as any;
            const payslip = await service.createPayslip(data);
            res.status(HttpStatus.CREATED).json(formatSuccess(payslip, HttpStatus.CREATED, "Bulletin créé"));
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const user = req.user as any;
            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const id = Number(req.params.id);
            const existing = await service.findPayslipById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Bulletin non trouvé"));
            }

            // Check if payrun is DRAFT and payslip not locked
            const payRun = await service.getPayRunStatus(existing.payRunId);
            if (payRun.status !== 'DRAFT' || (existing as any).locked) {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "Impossible de modifier un bulletin verrouillé ou d'une payrun non DRAFT"));
            }

            if (user.role === 'ADMIN' && payRun.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const data = UpdatePayslipSchema.parse(req.body) as any;
            const payslip = await service.updatePayslip(id, data);
            res.json(formatSuccess(payslip, HttpStatus.OK, "Bulletin mis à jour"));
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const user = req.user as any;
            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const id = Number(req.params.id);
            const existing = await service.findPayslipById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Bulletin non trouvé"));
            }

            const payRun = await service.getPayRunStatus(existing.payRunId);
            if (payRun.status !== 'DRAFT' || (existing as any).locked) {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "Impossible de supprimer un bulletin verrouillé ou d'une payrun non DRAFT"));
            }

            if (user.role === 'ADMIN' && payRun.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            await service.deletePayslip(id);
            res.json(formatSuccess(null, HttpStatus.OK, "Bulletin supprimé"));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const id = Number(req.params.id);
            const payslip = await service.findPayslipById(id);

            if (!payslip) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Bulletin non trouvé"));
            }

            const payRun = await service.getPayRunStatus(payslip.payRunId);
            if (user.role === 'ADMIN' && payRun.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            res.json(formatSuccess(payslip));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }

    static async generatePDF(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const id = Number(req.params.id);
            const payslip = await service.findPayslipById(id);

            if (!payslip) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Bulletin non trouvé"));
            }

            const payRun = await service.getPayRunStatus(payslip.payRunId);
            if (user.role === 'ADMIN' && payRun.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const pdfPath = await service.generatePDF(id);
            res.download(pdfPath);
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }

    static async getByEmployeeId(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const employeeId = Number(req.params.employeeId);

            const payslips = await service.getPayslipsByEmployeeId(employeeId);

            // Filter by company if user is ADMIN
            if (user.role === 'ADMIN') {
                const filteredPayslips = payslips.filter(async (payslip) => {
                    const payRun = await service.getPayRunStatus(payslip.payRunId);
                    return payRun.companyId === user.companyId;
                });
                res.json(formatSuccess(filteredPayslips));
            } else {
                res.json(formatSuccess(payslips));
            }
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }
}
