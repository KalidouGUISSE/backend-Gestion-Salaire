import type { PayRun } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
export declare class PayRunRepository extends CRUDRepesitorie<PayRun> {
    constructor();
    findByCompanyAndFilters(companyId: number, filters: {
        status?: string | undefined;
        type?: string | undefined;
    }, query: PaginationQuery): Promise<PaginationResult<PayRun>>;
    findByIdWithPayslips(id: number): Promise<PayRun | null>;
    updateTotals(id: number, totals: {
        totalGross: number;
        totalDeductions: number;
        totalNet: number;
        totalPaid: number;
    }): Promise<PayRun>;
}
//# sourceMappingURL=PayRunRepository.d.ts.map