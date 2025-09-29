import { prisma } from "../prisma/client.js";
import type { Company } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";

export class CompanyRepository extends CRUDRepesitorie<Company> {
    constructor() {
        super(prisma, prisma.company);
    }

    async findByFilters(
        filters: {
            isActive?: boolean | undefined;
            name?: string | undefined;
        },
        query: PaginationQuery
    ): Promise<PaginationResult<Company>> {
        const where: any = {};

        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters.name) {
            where.name = { contains: filters.name, mode: 'insensitive' };
        }

        return this.findAll(query, { where, orderBy: { createdAt: 'desc' } });
    }

    async findActiveCompanies(): Promise<Company[]> {
        return prisma.company.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });
    }
}