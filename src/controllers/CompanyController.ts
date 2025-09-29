import type { Request, Response } from "express";
import type { User } from "@prisma/client";
import { CompanyService } from "../services/CompanyService.js";
import { CreateCompanySchema, UpdateCompanySchema, CompanyFilterSchema, ActivateCompanySchema } from "../validatorsSchema/CompanyValidator.js";
import { formatSuccess, formatError } from "../utils/responseFormatter.js";
import { HttpStatus } from "../enums/httpStatus.js";

const service = new CompanyService();

export class CompanyController {
    static async getAll(req: Request, res: Response) {
        try {
            // Temporarily allow access without authentication for testing
            const user = req.user as User;

            // Only check auth if user is present (when auth middleware is applied)
            if (user && user.role !== 'SUPER_ADMIN') {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé - Super admin requis"));
            }

            const filters = CompanyFilterSchema.parse(req.query);

            const companies = await service.getCompanies(filters, { page: filters.page, limit: filters.limit });
            res.json(formatSuccess(companies));
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const user = req.user as User;
            if (!user || user.role !== 'SUPER_ADMIN') {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé - Super admin requis"));
            }

            const id = Number(req.params.id);
            const company = await service.findCompanyById(id);

            if (!company) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Entreprise non trouvée"));
            }

            res.json(formatSuccess(company));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const user = req.user as User;
            if (!user || user.role !== 'SUPER_ADMIN') {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé - Super admin requis"));
            }

            const data = CreateCompanySchema.parse(req.body);

            const company = await service.createCompany(data);
            res.status(HttpStatus.CREATED).json(formatSuccess(company, HttpStatus.CREATED, "Entreprise créée avec succès"));
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const user = req.user as User;
            if (!user || user.role !== 'SUPER_ADMIN') {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé - Super admin requis"));
            }

            const id = Number(req.params.id);
            const existing = await service.findCompanyById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Entreprise non trouvée"));
            }

            const data = UpdateCompanySchema.parse(req.body);
            const company = await service.updateCompany(id, data);
            res.json(formatSuccess(company, HttpStatus.OK, "Entreprise mise à jour"));
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const user = req.user as User;
            if (!user || user.role !== 'SUPER_ADMIN') {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé - Super admin requis"));
            }

            const id = Number(req.params.id);
            const existing = await service.findCompanyById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Entreprise non trouvée"));
            }

            await service.deleteCompany(id);
            res.status(HttpStatus.NO_CONTENT).send();
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }

    static async activate(req: Request, res: Response) {
        try {
            const user = req.user as User;
            if (!user || user.role !== 'SUPER_ADMIN') {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé - Super admin requis"));
            }

            const id = Number(req.params.id);
            const { isActive } = ActivateCompanySchema.parse(req.body);

            const existing = await service.findCompanyById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Entreprise non trouvée"));
            }

            const company = await service.activateCompany(id, isActive);
            res.json(formatSuccess(company, HttpStatus.OK, `Entreprise ${isActive ? 'activée' : 'désactivée'}`));
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }
}