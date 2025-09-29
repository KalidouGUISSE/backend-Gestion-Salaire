import { z } from "zod";
export declare const CreateCompanySchema: z.ZodObject<{
    name: z.ZodString;
    logo: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodString>;
    payPeriodType: z.ZodDefault<z.ZodEnum<{
        MONTHLY: "MONTHLY";
        WEEKLY: "WEEKLY";
        DAILY: "DAILY";
    }>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export declare const UpdateCompanySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    logo: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    currency: z.ZodOptional<z.ZodString>;
    payPeriodType: z.ZodOptional<z.ZodEnum<{
        MONTHLY: "MONTHLY";
        WEEKLY: "WEEKLY";
        DAILY: "DAILY";
    }>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const CompanyFilterSchema: z.ZodObject<{
    isActive: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodOptional<z.ZodBoolean>>;
    name: z.ZodOptional<z.ZodString>;
    page: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodDefault<z.ZodNumber>>;
    limit: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
export declare const ActivateCompanySchema: z.ZodObject<{
    isActive: z.ZodBoolean;
}, z.core.$strip>;
//# sourceMappingURL=CompanyValidator.d.ts.map