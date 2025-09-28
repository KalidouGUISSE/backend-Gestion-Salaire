import { prisma } from "../prisma/client.js";
import type { Payslip } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";

export class PayslipRepository extends CRUDRepesitorie<Payslip> {
    constructor() {
        super(prisma, prisma.payslip);
    }

    async getPayRunStatus(payRunId: number): Promise<{ status: string; companyId: number }> {
        const payRun = await prisma.payRun.findUnique({
            where: { id: payRunId },
            select: { status: true, companyId: true }
        });
        if (!payRun) throw new Error("PayRun not found");
        return payRun;
    }

    async findByPayRun(
        payRunId: number,
        filters: { status?: string; employeeId?: number },
        query: PaginationQuery
    ): Promise<PaginationResult<Payslip>> {
        const { page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const where: any = { payRunId };
        if (filters.status) where.status = filters.status;
        if (filters.employeeId) where.employeeId = filters.employeeId;

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
}