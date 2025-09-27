import { PaymentRepository } from "../../src/repositories/PaymentRepository.js";
import { prisma } from "../../src/prisma/client.js";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.mock("../../src/prisma/client.js", () => ({
    prisma: {
        payment: {
            findMany: jest.fn(),
            aggregate: jest.fn(),
        },
    },
}));

describe("PaymentRepository", () => {
    let repo: PaymentRepository;

    beforeEach(() => {
        repo = new PaymentRepository();
        jest.clearAllMocks();
    });

    describe("findByCompanyAndFilters", () => {
        it("should find payments with filters", async () => {
            const mockPayments = [{ id: 1, amount: 100 }];
            // @ts-ignore
            prisma.payment.findMany.mockResolvedValue(mockPayments);

            const result = await repo.findByCompanyAndFilters(1, {}, { page: 1, limit: 10 });

            expect(prisma.payment.findMany).toHaveBeenCalledWith({
                where: { companyId: 1 },
                include: expect.any(Object),
                orderBy: { paidAt: 'desc' },
                skip: 0,
                take: 10,
            });
            expect(result).toEqual({ data: mockPayments, total: 1, page: 1, limit: 10, totalPages: 1 });
        });
    });

    describe("getTotalPaidForPayslip", () => {
        it("should return total paid amount", async () => {
            // @ts-ignore
            prisma.payment.aggregate.mockResolvedValue({
                _sum: { amount: 500 }
            });

            const result = await repo.getTotalPaidForPayslip(1);

            expect(prisma.payment.aggregate).toHaveBeenCalledWith({
                where: { payslipId: 1 },
                _sum: { amount: true }
            });
            expect(result).toBe(500);
        });
    });
});