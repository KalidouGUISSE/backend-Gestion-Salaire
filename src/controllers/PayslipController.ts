import type { Request, Response } from "express";
import { PayslipService } from "../services/PayslipService.js";
import { UpdatePayslipSchema } from "../validatorsSchema/PayslipValidator.js";
import { formatSuccess, formatError } from "../utils/responseFormatter.js";
import { HttpStatus } from "../enums/httpStatus.js";

const service = new PayslipService();

export class PayslipController {
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

            // Check if payrun is DRAFT
            const payRun = await service.getPayRunStatus(existing.payRunId);
            if (payRun.status !== 'DRAFT') {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "Impossible de modifier un bulletin d'une payrun non DRAFT"));
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
}