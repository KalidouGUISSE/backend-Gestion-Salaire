import { prisma } from "../prisma/client.js";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
export class PayslipRepository extends CRUDRepesitorie {
    constructor() {
        super(prisma, prisma.payslip);
    }
    async getPayRunStatus(payRunId) {
        const payRun = await prisma.payRun.findUnique({
            where: { id: payRunId },
            select: { status: true, companyId: true }
        });
        if (!payRun)
            throw new Error("PayRun not found");
        return payRun;
    }
    async findByPayRun(payRunId, filters, query) {
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;
        const where = { payRunId };
        if (filters.status)
            where.status = filters.status;
        if (filters.employeeId)
            where.employeeId = filters.employeeId;
        const [data, total] = await Promise.all([
            prisma.payslip.findMany({
                where,
                include: { employee: true, payRun: true, payments: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.payslip.count({ where })
        ]);
        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            }
        };
    }
    async findByEmployeeId(employeeId) {
        return prisma.payslip.findMany({
            where: { employeeId },
            include: { employee: true, payRun: true, payments: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findAllForPayment(query, companyId) {
        const { page = 1, limit = 100 } = query;
        const skip = (page - 1) * limit;
        // Get payslips that are not fully paid (have outstanding balance)
        const where = {
            OR: [
                { status: 'PENDING' },
                { status: 'PARTIAL' }
            ]
        };
        // Filter by company if companyId is provided
        if (companyId) {
            where.payRun = {
                companyId: companyId
            };
        }
        const [data, total] = await Promise.all([
            prisma.payslip.findMany({
                where,
                include: {
                    employee: true,
                    payRun: {
                        include: {
                            company: true
                        }
                    },
                    payments: true
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.payslip.count({ where })
        ]);
        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            }
        };
    }
}
//# sourceMappingURL=PayslipRepository.js.map