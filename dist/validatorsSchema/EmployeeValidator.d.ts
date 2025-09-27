import { z } from "zod";
export declare const CreateEmployeeSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    fullName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodString>;
    contractType: z.ZodEnum<{
        JOURNALIER: "JOURNALIER";
        FIXE: "FIXE";
        HONORAIRE: "HONORAIRE";
    }>;
    salary: z.ZodNumber;
    bankAccount: z.ZodOptional<z.ZodString>;
    bankName: z.ZodOptional<z.ZodString>;
    taxIdentifier: z.ZodOptional<z.ZodString>;
    hireDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type CreateEmployeeInput = Omit<z.infer<typeof CreateEmployeeSchema>, "companyId">;
export declare const UpdateEmployeeSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    fullName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    position: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    contractType: z.ZodOptional<z.ZodEnum<{
        JOURNALIER: "JOURNALIER";
        FIXE: "FIXE";
        HONORAIRE: "HONORAIRE";
    }>>;
    salary: z.ZodOptional<z.ZodNumber>;
    bankAccount: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    bankName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    taxIdentifier: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    hireDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const EmployeeFilterSchema: z.ZodObject<{
    isActive: z.ZodOptional<z.ZodBoolean>;
    contractType: z.ZodOptional<z.ZodEnum<{
        JOURNALIER: "JOURNALIER";
        FIXE: "FIXE";
        HONORAIRE: "HONORAIRE";
    }>>;
    position: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const ActivateEmployeeSchema: z.ZodObject<{
    isActive: z.ZodBoolean;
}, z.core.$strip>;
//# sourceMappingURL=EmployeeValidator.d.ts.map