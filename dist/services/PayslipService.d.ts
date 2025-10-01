import type { Payslip } from "@prisma/client";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
export declare class PayslipService {
    private repo;
    constructor();
    findPayslipById(id: number): Promise<Payslip | null>;
    getAllByPayRun(payRunId: number, filters: {
        status?: string;
        employeeId?: number;
    }, query: PaginationQuery): Promise<PaginationResult<Payslip>>;
    createPayslip(data: Omit<Payslip, "id" | "createdAt" | "updatedAt">): Promise<Payslip>;
    deletePayslip(id: number): Promise<void>;
    updatePayslip(id: number, data: Partial<Payslip>): Promise<Payslip>;
    getPayRunStatus(payRunId: number): Promise<{
        status: string;
        companyId: number;
    }>;
    getPayslipsByEmployeeId(employeeId: number): Promise<Payslip[]>;
    generatePDF(payslipId: number): Promise<string>;
}
//# sourceMappingURL=PayslipService.d.ts.map