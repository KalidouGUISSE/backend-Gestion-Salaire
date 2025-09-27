import type { Request, Response } from "express";
import type { User } from "@prisma/client";
import { DashboardService } from "../services/DashboardService.js";
import { formatSuccess, formatError } from "../utils/responseFormatter.js";
import { HttpStatus } from "../enums/httpStatus.js";

const service = new DashboardService();

export class DashboardController {
    static async getKPIs(req: Request, res: Response) {
        try {
            const user = req.user as User;

            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const companyId = user.role === 'ADMIN' ? user.companyId : parseInt(req.query.companyId as string) || user.companyId;
            if (!companyId) {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "Entreprise requise"));
            }

            const kpis = await service.getKPIs(companyId);
            res.json(formatSuccess(kpis));
        } catch (error: any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(formatError(HttpStatus.INTERNAL_SERVER_ERROR, error.message));
        }
    }
}