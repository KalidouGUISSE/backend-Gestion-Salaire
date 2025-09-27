import type { PayRun } from "@prisma/client";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
export declare class PayRunService {
    private repo;
    private employeeService;
    constructor();
    getPayRuns(companyId: number, filters: {
        status?: string | undefined;
        type?: string | undefined;
    }, query: PaginationQuery): Promise<PaginationResult<PayRun>>;
    findPayRunById(id: number): Promise<PayRun | null>;
    createPayRun(data: Omit<PayRun, "id" | "status" | "createdById" | "approvedById" | "totalGross" | "totalDeductions" | "totalNet" | "totalPaid">, createdById: number): Promise<PayRun>;
    updatePayRun(id: number, data: Partial<PayRun>): Promise<PayRun>;
    deletePayRun(id: number): Promise<void>;
    approvePayRun(id: number, approvedById: number): Promise<PayRun>;
    generatePayslips(payRunId: number): Promise<void>;
    calculateTotals(payRunId: number): Promise<void>;
}
//# sourceMappingURL=PayRunService.d.ts.map