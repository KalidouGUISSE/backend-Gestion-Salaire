import type { Request, Response } from "express";
import type { Employee, User } from "@prisma/client";
import { EmployeeService } from "../services/EmployeeService.js";
import { CreateEmployeeSchema, UpdateEmployeeSchema, EmployeeFilterSchema, ActivateEmployeeSchema } from "../validatorsSchema/EmployeeValidator.js";
import { formatSuccess, formatError } from "../utils/responseFormatter.js";
import { HttpStatus } from "../enums/httpStatus.js";

const service = new EmployeeService();

export class EmployeeController {
    static async getAll(req: Request, res: Response) {
        try {
            const user = req.user as User;
            console.log(user);
            
            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const companyId = user.role === 'ADMIN' ? user.companyId : parseInt(req.query.companyId as string) || user.companyId;
            if (!companyId) {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "Entreprise requise"));
            }

            const filters = EmployeeFilterSchema.parse(req.query);
            const employees = await service.getEmployees(companyId, filters, { page: filters.page, limit: filters.limit });
            res.json(formatSuccess(employees));
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }

    static async findById(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const id = Number(req.params.id);
            const employee = await service.findEmployeeById(id);

            if (!employee) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Employé non trouvé"));
            }

            if (user.role === 'ADMIN' && employee.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            res.json(formatSuccess(employee));
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const user = req.user as User;
            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const data = CreateEmployeeSchema.parse(req.body) as any;
            if (user.role === 'ADMIN') {
                data.companyId = user.companyId;
            }

            const employee = await service.createEmployee(data);
            res.status(HttpStatus.CREATED).json(formatSuccess(employee, HttpStatus.CREATED, "Employé créé avec succès"));
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
            const existing = await service.findEmployeeById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Employé non trouvé"));
            }

            if (user.role === 'ADMIN' && existing.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const data = UpdateEmployeeSchema.parse(req.body) as any;
            const employee = await service.updateEmployee(id, data);
            res.json(formatSuccess(employee, HttpStatus.OK, "Employé mis à jour"));
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
            const existing = await service.findEmployeeById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Employé non trouvé"));
            }

            if (user.role === 'ADMIN' && existing.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            await service.deleteEmployee(id);
            res.status(HttpStatus.NO_CONTENT).send();
        } catch (error: any) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }

    static async activate(req: Request, res: Response) {
        try {
            const user = req.user as any;
            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const id = Number(req.params.id);
            const { isActive } = ActivateEmployeeSchema.parse(req.body);

            const existing = await service.findEmployeeById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Employé non trouvé"));
            }

            if (user.role === 'ADMIN' && existing.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }

            const employee = await service.activateEmployee(id, isActive);
            res.json(formatSuccess(employee, HttpStatus.OK, `Employé ${isActive ? 'activé' : 'désactivé'}`));
        } catch (error: any) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }
}