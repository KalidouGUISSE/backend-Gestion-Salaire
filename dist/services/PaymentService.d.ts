import type { Payment, User, PaymentMethod } from "@prisma/client";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
export declare class PaymentService {
    private repo;
    constructor();
    createPayment(data: {
        companyId: number;
        payslipId?: number | undefined;
        amount: number;
        method: PaymentMethod;
        reference?: string | undefined;
        notes?: string | undefined;
    }, user: User): Promise<Payment>;
    getPayments(companyId: number, filters: {
        payRunId?: number | undefined;
        status?: string | undefined;
        startDate?: Date;
        endDate?: Date;
        method?: string;
    }, query: PaginationQuery): Promise<PaginationResult<Payment>>;
    getPaymentsByEmployeeId(employeeId: number, companyId: number): Promise<Payment[]>;
    generateSingleReceipt(paymentId: number): Promise<string>;
    generateReceipt(paymentIds: number[], companyId: number): Promise<string>;
    exportPayRunReceipts(payRunId: number, companyId: number): Promise<string>;
}
//# sourceMappingURL=PaymentService.d.ts.map