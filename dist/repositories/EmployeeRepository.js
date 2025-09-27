import { prisma } from "../prisma/client.js";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
export class EmployeeRepository extends CRUDRepesitorie {
    constructor() {
        super(prisma, prisma.employee);
    }
    async findByCompanyAndFilters(companyId, filters, query) {
        const where = { companyId };
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters.contractType) {
            where.contractType = filters.contractType;
        }
        if (filters.position) {
            where.position = { contains: filters.position, mode: 'insensitive' };
        }
        return this.findAll(query, { where, orderBy: { createdAt: 'desc' } });
    }
    async findActiveByCompany(companyId) {
        return prisma.employee.findMany({
            where: { companyId, isActive: true },
            orderBy: { lastName: 'asc' }
        });
    }
}
//# sourceMappingURL=EmployeeRepository.js.map