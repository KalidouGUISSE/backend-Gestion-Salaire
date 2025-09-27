import type { Payslip } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
export declare class PayslipRepository extends CRUDRepesitorie<Payslip> {
    constructor();
    getPayRunStatus(payRunId: number): Promise<{
        status: string;
        companyId: number;
    }>;
}
//# sourceMappingURL=PayslipRepository.d.ts.map