import { PayRunService } from "../services/PayRunService.js";
import { CreatePayRunSchema, UpdatePayRunSchema, PayRunFilterSchema, ApprovePayRunSchema } from "../validatorsSchema/PayRunValidator.js";
import { formatSuccess, formatError } from "../utils/responseFormatter.js";
import { HttpStatus } from "../enums/httpStatus.js";
const service = new PayRunService();
export class PayRunController {
    static async getAll(req, res) {
        try {
            const user = req.user;
            if (!user || !['ADMIN', 'CASHIER', 'SUPER_ADMIN'].includes(user.role)) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }
            const companyId = user.role === 'ADMIN' ? user.companyId : parseInt(req.query.companyId) || user.companyId;
            if (!companyId) {
                return res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, "Entreprise requise"));
            }
            const filters = PayRunFilterSchema.parse(req.query);
            const payRuns = await service.getPayRuns(companyId, filters, { page: filters.page, limit: filters.limit });
            res.json(formatSuccess(payRuns));
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
            const payRun = await service.findPayRunById(id);
            if (!payRun) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "PayRun non trouvé"));
            }
            if (user.role === 'ADMIN' && payRun.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }
            res.json(formatSuccess(payRun));
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
            const data = CreatePayRunSchema.parse(req.body);
            if (user.role === 'ADMIN') {
                data.companyId = user.companyId;
            }
            const payRun = await service.createPayRun(data, user.id);
            res.status(HttpStatus.CREATED).json(formatSuccess(payRun, HttpStatus.CREATED, "PayRun créé avec succès"));
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
            const existing = await service.findPayRunById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "PayRun non trouvé"));
            }
            if (user.role === 'ADMIN' && existing.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }
            const data = UpdatePayRunSchema.parse(req.body);
            const payRun = await service.updatePayRun(id, data);
            res.json(formatSuccess(payRun, HttpStatus.OK, "PayRun mis à jour"));
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
            const existing = await service.findPayRunById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "PayRun non trouvé"));
            }
            if (user.role === 'ADMIN' && existing.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }
            await service.deletePayRun(id);
            res.status(HttpStatus.NO_CONTENT).send();
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }
    static async approve(req, res) {
        try {
            const user = req.user;
            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }
            const id = Number(req.params.id);
            const existing = await service.findPayRunById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "PayRun non trouvé"));
            }
            if (user.role === 'ADMIN' && existing.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }
            const payRun = await service.approvePayRun(id, user.id);
            res.json(formatSuccess(payRun, HttpStatus.OK, "PayRun approuvé"));
        }
        catch (error) {
            const errors = error.errors ?? [{ message: error.message }];
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, errors[0].message));
        }
    }
    static async generatePayslips(req, res) {
        try {
            const user = req.user;
            if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }
            const id = Number(req.params.id);
            const existing = await service.findPayRunById(id);
            if (!existing) {
                return res.status(HttpStatus.NOT_FOUND).json(formatError(HttpStatus.NOT_FOUND, "PayRun non trouvé"));
            }
            if (user.role === 'ADMIN' && existing.companyId !== user.companyId) {
                return res.status(HttpStatus.FORBIDDEN).json(formatError(HttpStatus.FORBIDDEN, "Accès refusé"));
            }
            await service.generatePayslips(id);
            const updated = await service.findPayRunById(id);
            res.json(formatSuccess(updated, HttpStatus.OK, "Bulletins générés"));
        }
        catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message));
        }
    }
}
//# sourceMappingURL=PayRunController.js.map