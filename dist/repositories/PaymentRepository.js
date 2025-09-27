import { prisma } from "../prisma/client.js";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
export class PaymentRepository extends CRUDRepesitorie {
    constructor() {
        super(prisma, prisma.payment);
    }
    async findByCompanyAndFilters(companyId, filters, query) {
        const where = { companyId };
        if (filters.payRunId) {
            where.payslip = {
                payRunId: filters.payRunId
            };
        }
        if (filters.status) {
            where.payslip = {
                ...where.payslip,
                status: filters.status
            };
        }
        if (filters.startDate || filters.endDate) {
            where.paidAt = {};
            if (filters.startDate)
                where.paidAt.gte = filters.startDate;
            if (filters.endDate)
                where.paidAt.lte = filters.endDate;
        }
        if (filters.method) {
            where.method = filters.method;
        }
        return this.findAll(query, {
            where,
            include: {
                payslip: {
                    include: {
                        employee: true,
                        payRun: true
                    }
                },
                paidBy: true
            },
            orderBy: { paidAt: 'desc' }
        });
    }
    async findByPayslipId(payslipId) {
        return prisma.payment.findMany({
            where: { payslipId },
            include: {
                paidBy: true
            },
            orderBy: { paidAt: 'desc' }
        });
    }
    async getTotalPaidForPayslip(payslipId) {
        const result = await prisma.payment.aggregate({
            where: { payslipId },
            _sum: { amount: true }
        });
        return Number(result._sum.amount) || 0;
    }
}
//# sourceMappingURL=PaymentRepository.js.map