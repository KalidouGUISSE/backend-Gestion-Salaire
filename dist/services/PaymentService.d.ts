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
    generateSingleReceipt(payment: Payment & {
        payslip: {
            employee: any;
            payRun: {
                company: any;
            };
        } | null;
        paidBy: any | null;
    }): Promise<string>;
    generateReceipt(paymentIds: number[], companyId: number): Promise<string>;
    validateQR(paymentId: number, qrToken: string): Promise<Payment>;
    exportPayRunReceipts(payRunId: number, companyId: number): Promise<string>;
}
//# sourceMappingURL=PaymentService.d.ts.map