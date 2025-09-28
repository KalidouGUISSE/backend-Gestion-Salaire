import type { Payslip } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
export declare class PayslipRepository extends CRUDRepesitorie<Payslip> {
    constructor();
    getPayRunStatus(payRunId: number): Promise<{
        status: string;
        companyId: number;
    }>;
    findByPayRun(payRunId: number, filters: {
        status?: string;
        employeeId?: number;
    }, query: PaginationQuery): Promise<PaginationResult<Payslip>>;
}
//# sourceMappingURL=PayslipRepository.d.ts.map