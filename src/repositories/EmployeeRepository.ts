import { prisma } from "../prisma/client.js";
import type { Employee } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";

export class EmployeeRepository extends CRUDRepesitorie<Employee> {
    constructor() {
        super(prisma, prisma.employee);
    }

    async findByCompanyAndFilters(
        companyId: number,
        filters: {
            isActive?: boolean | undefined;
            contractType?: string | undefined;
            position?: string | undefined;
        },
        query: PaginationQuery
    ): Promise<PaginationResult<Employee>> {
        const where: any = { companyId };

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

    async findActiveByCompany(companyId: number): Promise<Employee[]> {
        return prisma.employee.findMany({
            where: { companyId, isActive: true },
            orderBy: { lastName: 'asc' }
        });
    }
}