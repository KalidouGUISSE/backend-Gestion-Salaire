import { prisma } from "../prisma/client.js";
import type { PayRun } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";

export class PayRunRepository extends CRUDRepesitorie<PayRun> {
    constructor() {
        super(prisma, prisma.payRun);
    }

    async findByCompanyAndFilters(
        companyId: number,
        filters: {
            status?: string | undefined;
            type?: string | undefined;
        },
        query: PaginationQuery
    ): Promise<PaginationResult<PayRun>> {
        const where: any = { companyId };

        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.type) {
            where.type = filters.type;
        }

        return this.findAll(query, { where, orderBy: { createdAt: 'desc' } });
    }

    async findByIdWithPayslips(id: number): Promise<PayRun | null> {
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

    async updateTotals(id: number, totals: { totalGross: number; totalDeductions: number; totalNet: number; totalPaid: number }): Promise<PayRun> {
        return this.update(id, totals as any);
    }
}