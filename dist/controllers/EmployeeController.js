import { EmployeeService } from "../services/EmployeeService.js";
import { CreateEmployeeSchema, UpdateEmployeeSchema, EmployeeFilterSchema, ActivateEmployeeSchema } from "../validatorsSchema/EmployeeValidator.js";
import { formatSuccess, formatError } from "../utils/responseFormatter.js";
import { HttpStatus } from "../enums/httpStatus.js";
const service = new EmployeeService();
export class EmployeeController {
    static async getAll(req, res) {
        try {
            const user = req.user;
            console.log(user);
            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }
            const companyId = user.role === 'ADMIN' ? user.companyId : parseInt(req.query.companyId) || user.companyId;
            if (!companyId) {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "Entreprise requise"));
            }
            const filters = EmployeeFilterSchema.parse(req.query);
            const employees = await service.getEmployees(companyId, filters, { page: filters.page, limit: filters.limit });
            res.json(formatSuccess(employees));
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }
    static async findById(req, res) {
        try {
            const user = req.user;
            const id = Number(req.params.id);
            const employee = await service.findEmployeeById(id);
            if (!employee) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "Employé non trouvé"));
            }
            if (user.role === 'ADMIN' && employee.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }
            res.json(formatSuccess(employee));
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }
    static async create(req, res) {
        try {
            const user = req.user;
            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }
            const data = CreateEmployeeSchema.parse(req.body);
            if (user.role === 'ADMIN') {
                data.companyId = user.companyId;
            }
            const employee = await service.createEmployee(data);
            res.status(HttpStatus.CREATED).json(formatSuccess(employee, HttpStatus.CREATED, "Employé créé avec succès"));
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }
    static async update(req, res) {
        try {
            const user = req.user;
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
            const data = UpdateEmployeeSchema.parse(req.body);
            const employee = await service.updateEmployee(id, data);
            res.json(formatSuccess(employee, HttpStatus.OK, "Employé mis à jour"));
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }
    static async delete(req, res) {
        try {
            const user = req.user;
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
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }
    static async activate(req, res) {
        try {
            const user = req.user;
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
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }
}
//# sourceMappingURL=EmployeeController.js.map