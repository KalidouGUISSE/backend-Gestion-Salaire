import { prisma } from "../prisma/client.js";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
export class PayRunRepository extends CRUDRepesitorie {
    constructor() {
        super(prisma, prisma.payRun);
    }
    async findByCompanyAndFilters(companyId, filters, query) {
        const where = { companyId };
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.type) {
            where.type = filters.type;
        }
        return this.findAll(query, { where, orderBy: { createdAt: 'desc' } });
    }
    async findByIdWithPayslips(id) {
        return prisma.payRun.findUnique({
            where: { id },
            include: {
                payslips: {
                    include: { employee: true, payments: true }
                },
                createdBy: true,
                approvedBy: true
            }
        });
    }
    async updateTotals(id, totals) {
        return this.update(id, totals);
    }
}
//# sourceMappingURL=PayRunRepository.js.map