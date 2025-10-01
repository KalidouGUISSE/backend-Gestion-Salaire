import { z } from "zod";
export declare const CreateUserSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        ADMIN: "ADMIN";
        USER: "USER";
        CASHIER: "CASHIER";
        SUPER_ADMIN: "SUPER_ADMIN";
    }>>;
    companyId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
//# sourceMappingURL=UserValidator.d.ts.map