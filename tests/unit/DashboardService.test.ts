import { DashboardService } from "../../src/services/DashboardService.js";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

describe("DashboardService", () => {
    let service: DashboardService;

    beforeEach(() => {
        service = new DashboardService();
    });

    describe("getKPIs", () => {
        it("should return KPIs for company", async () => {
            const prisma = require('../../src/prisma/client.js').prisma;
            // @ts-ignore
            prisma.payslip.aggregate = jest.fn()
                // @ts-ignore
                .mockResolvedValueOnce({ _sum: { netPayable: 1000 } }) // totalPayrollThisMonth
                // @ts-ignore
                .mockResolvedValueOnce({ _sum: { netPayable: 5000, paidAmount: 3000 } }); // paymentStats
            // @ts-ignore
            prisma.employee.count = jest.fn().mockResolvedValue(10);

            const result = await service.getKPIs(1);

            expect(result).toEqual({
                totalPayroll: 1000,
                totalPaid: 3000,
                totalOutstanding: 2000,
                activeEmployees: 10,
                evolution: expect.any(Array)
            });
        });
    });
});