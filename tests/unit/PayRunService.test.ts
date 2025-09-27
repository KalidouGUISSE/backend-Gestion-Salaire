import { PayRunService } from "../../src/services/PayRunService.js";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

describe("PayRunService", () => {
    let service: PayRunService;

    beforeEach(() => {
        service = new PayRunService();
    });

    describe("createPayRun", () => {
        it("should create a payrun with DRAFT status", async () => {
            // @ts-ignore
            service['repo'].create = jest.fn().mockResolvedValue({ id: 1, status: 'DRAFT' });

            const data = { companyId: 1, type: 'MONTHLY', periodStart: new Date(), periodEnd: new Date() };
            const result = await service.createPayRun(data as any, 1);

            expect(service['repo'].create).toHaveBeenCalledWith({
                ...data,
                status: 'DRAFT',
                createdById: 1,
                approvedById: null,
                totalGross: 0,
                totalDeductions: 0,
                totalNet: 0,
                totalPaid: 0
            });
        });
    });

    describe("approvePayRun", () => {
        it("should approve a payrun", async () => {
            // @ts-ignore
            service['repo'].update = jest.fn().mockResolvedValue({ id: 1, status: 'APPROVED' });

            const result = await service.approvePayRun(1, 2);

            expect(service['repo'].update).toHaveBeenCalledWith(1, { status: 'APPROVED', approvedById: 2 });
        });
    });

    describe("generatePayslips", () => {
        it("should generate payslips for active employees", async () => {
            const payRun = { id: 1, companyId: 1, status: 'DRAFT' };
            const employees = [{ id: 1, salary: 50000 }];

            // @ts-ignore
            service['repo'].findById = jest.fn().mockResolvedValue(payRun);
            // @ts-ignore
            service['employeeService'].getActiveEmployeesByCompany = jest.fn().mockResolvedValue(employees);
            // Mock prisma.payslip.createMany
            const prisma = require('../../src/prisma/client.js').prisma;
            // @ts-ignore
            prisma.payslip.createMany = jest.fn().mockResolvedValue({});
            // @ts-ignore
            service.calculateTotals = jest.fn();

            await service.generatePayslips(1);

            expect(prisma.payslip.createMany).toHaveBeenCalledWith({
                data: expect.arrayContaining([
                    expect.objectContaining({
                        payRunId: 1,
                        employeeId: 1,
                        gross: 50000,
                        deductions: 5000, // 10%
                        netPayable: 45000
                    })
                ])
            });
        });
    });
});