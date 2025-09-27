import { PaymentService } from "../../src/services/PaymentService.js";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

describe("PaymentService", () => {
    let service: PaymentService;

    beforeEach(() => {
        service = new PaymentService();
    });

    describe("createPayment", () => {
        it("should create a payment and update payslip", async () => {
            const mockPayment = { id: 1, amount: 100, payslipId: 1 };
            const mockPayslip = { id: 1, netPayable: 200, paidAmount: 0 };

            // @ts-ignore
            service['repo'].getTotalPaidForPayslip = jest.fn().mockResolvedValue(0);
            // Mock prisma
            const prisma = require('../../src/prisma/client.js').prisma;
            // @ts-ignore
            prisma.$transaction = jest.fn().mockImplementation(async (callback: any) => {
                // @ts-ignore
                prisma.payment.create = jest.fn().mockResolvedValue(mockPayment);
                // @ts-ignore
                prisma.payslip.findUnique = jest.fn().mockResolvedValue(mockPayslip);
                // @ts-ignore
                prisma.payslip.update = jest.fn().mockResolvedValue({ ...mockPayslip, paidAmount: 100, status: 'PARTIAL' });
                // @ts-ignore
                prisma.document.create = jest.fn().mockResolvedValue({});
                return callback(prisma);
            });

            const data = { companyId: 1, payslipId: 1, amount: 100, method: 'CASH' };
            const user = { id: 1, role: 'ADMIN' };
            const result = await service.createPayment(data as any, user as any);

            expect(result).toEqual(mockPayment);
        });
    });
});