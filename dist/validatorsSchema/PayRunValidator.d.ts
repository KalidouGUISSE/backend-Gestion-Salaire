import { z } from "zod";
export declare const CreatePayRunSchema: z.ZodObject<{
    companyId: z.ZodOptional<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        MONTHLY: "MONTHLY";
        WEEKLY: "WEEKLY";
        DAILY: "DAILY";
    }>;
    periodStart: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    periodEnd: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const UpdatePayRunSchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ApprovePayRunSchema: z.ZodObject<{
    status: z.ZodLiteral<"APPROVED">;
}, z.core.$strip>;
export declare const PayRunFilterSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        APPROVED: "APPROVED";
        DRAFT: "DRAFT";
        CLOSED: "CLOSED";
    }>>;
    type: z.ZodOptional<z.ZodEnum<{
        MONTHLY: "MONTHLY";
        WEEKLY: "WEEKLY";
        DAILY: "DAILY";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=PayRunValidator.d.ts.map