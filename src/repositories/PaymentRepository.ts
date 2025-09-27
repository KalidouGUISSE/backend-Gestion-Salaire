import { prisma } from "../prisma/client.js";
import type { Payment } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";

export class PaymentRepository extends CRUDRepesitorie<Payment> {
    constructor() {
        super(prisma, prisma.payment);
    }

    async findByCompanyAndFilters(
        companyId: number,
        filters: {
            payRunId?: number | undefined;
            status?: string | undefined;
            startDate?: Date;
            endDate?: Date;
            method?: string;
        },
        query: PaginationQuery
    ): Promise<PaginationResult<Payment>> {
        const where: any = { companyId };

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
            if (filters.startDate) where.paidAt.gte = filters.startDate;
            if (filters.endDate) where.paidAt.lte = filters.endDate;
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

    async findByPayslipId(payslipId: number): Promise<Payment[]> {
        return prisma.payment.findMany({
            where: { payslipId },
            include: {
                paidBy: true
            },
            orderBy: { paidAt: 'desc' }
        });
    }

    async getTotalPaidForPayslip(payslipId: number): Promise<number> {
        const result = await prisma.payment.aggregate({
            where: { payslipId },
            _sum: { amount: true }
        });
        return Number(result._sum.amount) || 0;
    }
}