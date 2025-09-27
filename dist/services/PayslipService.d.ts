import type { Payslip } from "@prisma/client";
export declare class PayslipService {
    private repo;
    constructor();
    findPayslipById(id: number): Promise<Payslip | null>;
    updatePayslip(id: number, data: Partial<Payslip>): Promise<Payslip>;
    getPayRunStatus(payRunId: number): Promise<{
        status: string;
        companyId: number;
    }>;
}
//# sourceMappingURL=PayslipService.d.ts.map