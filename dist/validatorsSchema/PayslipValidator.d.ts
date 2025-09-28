import { z } from "zod";
export declare const CreatePayslipSchema: z.ZodObject<{
    payRunId: z.ZodNumber;
    employeeId: z.ZodNumber;
    gross: z.ZodNumber;
    deductions: z.ZodNumber;
    netPayable: z.ZodNumber;
    paidAmount: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<{
        PENDING: "PENDING";
        PARTIAL: "PARTIAL";
        PAID: "PAID";
    }>>;
    locked: z.ZodDefault<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
    pdfPath: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const UpdatePayslipSchema: z.ZodObject<{
    gross: z.ZodOptional<z.ZodNumber>;
    deductions: z.ZodOptional<z.ZodNumber>;
    netPayable: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=PayslipValidator.d.ts.map