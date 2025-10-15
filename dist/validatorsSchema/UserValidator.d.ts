import { z } from "zod";
export declare const CreateUserSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        SUPER_ADMIN: "SUPER_ADMIN";
        ADMIN: "ADMIN";
        CASHIER: "CASHIER";
        EMPLOYEE: "EMPLOYEE";
    }>>;
    companyId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=UserValidator.d.ts.map