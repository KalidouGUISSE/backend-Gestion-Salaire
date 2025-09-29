import { prisma } from "../prisma/client.js";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
export class CompanyRepository extends CRUDRepesitorie {
    constructor() {
        super(prisma, prisma.company);
    }
    async findByFilters(filters, query) {
        const where = {};
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters.name) {
            where.name = { contains: filters.name, mode: 'insensitive' };
        }
        return this.findAll(query, { where, orderBy: { createdAt: 'desc' } });
    }
    async findActiveCompanies() {
        return prisma.company.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });
    }
}
//# sourceMappingURL=CompanyRepository.js.map