import type { PayRun, Payslip } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { PayRunRepository } from "../repositories/PayRunRepository.js";
import { EmployeeService } from "./EmployeeService.js";
import { prisma } from "../prisma/client.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";

export class PayRunService {
    private repo: PayRunRepository;
    private employeeService: EmployeeService;

    constructor() {
        this.repo = new PayRunRepository();
        this.employeeService = new EmployeeService();
    }

    getPayRuns(
        companyId: number,
        filters: {
            status?: string | undefined;
            type?: string | undefined;
        },
        query: PaginationQuery
    ): Promise<PaginationResult<PayRun>> {
        return this.repo.findByCompanyAndFilters(companyId, filters, query);
    }

    findPayRunById(id: number): Promise<PayRun | null> {
        return this.repo.findById(id, { include: { payslips: { include: { employee: true } } } });
    }

    async createPayRun(data: Omit<PayRun, "id" | "status" | "createdById" | "approvedById" | "totalGross" | "totalDeductions" | "totalNet" | "totalPaid">, createdById: number): Promise<PayRun> {
        return this.repo.create({ ...data, status: 'DRAFT', createdById, approvedById: null, totalGross: 0, totalDeductions: 0, totalNet: 0, totalPaid: 0 } as any);
    }

    updatePayRun(id: number, data: Partial<PayRun>): Promise<PayRun> {
        return this.repo.update(id, data as any);
    }

    async deletePayRun(id: number): Promise<void> {
        await this.repo.delete(id);
    }

    async approvePayRun(id: number, approvedById: number): Promise<PayRun> {
        return this.repo.update(id, { status: 'APPROVED', approvedById } as any);
    }

    async generatePayslips(payRunId: number): Promise<void> {
        const payRun = await this.repo.findById(payRunId);
        if (!payRun || payRun.status !== 'DRAFT') {
            throw new Error("PayRun must be in DRAFT status to generate payslips");
        }

        const employees = await this.employeeService.getActiveEmployeesByCompany(payRun.companyId);

        const payslips: Omit<Payslip, "id" | "createdAt" | "updatedAt">[] = [];

        for (const employee of employees) {
            let gross = employee.salary.toNumber(); // assuming salary is monthly
            // Deductions: 10% by default
            const deductions = gross * 0.1;
            const net = gross - deductions;

            payslips.push({
                payRunId,
                employeeId: employee.id,
                gross: new Prisma.Decimal(gross),
                deductions: new Prisma.Decimal(deductions),
                netPayable: new Prisma.Decimal(net),
                paidAmount: new Prisma.Decimal(0),
                status: 'PENDING',
                locked: false,
                notes: null,
                pdfPath: null,
            });
        }

        await prisma.payslip.createMany({ data: payslips });

        await this.calculateTotals(payRunId);
    }

    async calculateTotals(payRunId: number): Promise<void> {
        const payslips = await prisma.payslip.findMany({
            where: { payRunId },
            select: { gross: true, deductions: true, netPayable: true, paidAmount: true }
        });

        const totalGross = payslips.reduce((sum, p) => sum + p.gross.toNumber(), 0);
        const totalDeductions = payslips.reduce((sum, p) => sum + p.deductions.toNumber(), 0);
        const totalNet = payslips.reduce((sum, p) => sum + p.netPayable.toNumber(), 0);
        const totalPaid = payslips.reduce((sum, p) => sum + p.paidAmount.toNumber(), 0);

        await this.repo.updateTotals(payRunId, { totalGross, totalDeductions, totalNet, totalPaid });
    }
}