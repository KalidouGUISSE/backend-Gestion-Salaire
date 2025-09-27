import { z } from "zod";
export declare const CreatePaymentSchema: z.ZodObject<{
    payslipId: z.ZodOptional<z.ZodNumber>;
    amount: z.ZodNumber;
    method: z.ZodEnum<{
        CASH: "CASH";
        BANK_TRANSFER: "BANK_TRANSFER";
        ORANGE_MONEY: "ORANGE_MONEY";
        WAVE: "WAVE";
        OTHER: "OTHER";
    }>;
    reference: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
export declare const ListPaymentsSchema: z.ZodObject<{
    payRunId: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        PARTIAL: "PARTIAL";
        PAID: "PAID";
        LOCKED: "LOCKED";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const GenerateReceiptSchema: z.ZodObject<{
    payslipId: z.ZodOptional<z.ZodNumber>;
    payRunId: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=PaymentValidator.d.ts.map