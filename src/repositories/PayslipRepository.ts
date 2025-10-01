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

    async findByEmployeeId(employeeId: number): Promise<Payslip[]> {
        return prisma.payslip.findMany({
            where: { employeeId },
            include: { employee: true, payRun: true, payments: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findAllForPayment(query: PaginationQuery, companyId?: number): Promise<PaginationResult<Payslip>> {
        const { page = 1, limit = 100 } = query;
        const skip = (page - 1) * limit;

        // Get payslips that are not fully paid (have outstanding balance)
        const where: any = {
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