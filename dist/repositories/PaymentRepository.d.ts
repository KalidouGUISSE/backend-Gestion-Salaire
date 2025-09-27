import type { Payment } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
export declare class PaymentRepository extends CRUDRepesitorie<Payment> {
    constructor();
    findByCompanyAndFilters(companyId: number, filters: {
        payRunId?: number | undefined;
        status?: string | undefined;
        startDate?: Date;
        endDate?: Date;
        method?: string;
    }, query: PaginationQuery): Promise<PaginationResult<Payment>>;
    findByPayslipId(payslipId: number): Promise<Payment[]>;
    getTotalPaidForPayslip(payslipId: number): Promise<number>;
}
//# sourceMappingURL=PaymentRepository.d.ts.map