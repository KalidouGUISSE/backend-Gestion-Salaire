import { z } from "zod";

export const CreateEmployeeSchema = z.object({
    // companyId: z.number().int().positive("ID entreprise invalide"),
    firstName: z.string().min(1, "Prénom requis").max(50, "Prénom trop long"),
    lastName: z.string().min(1, "Nom requis").max(50, "Nom trop long"),
    fullName: z.string().optional(),
    email: z.string().email("Email invalide").optional(),
    phone: z.string().optional(),
    position: z.string().optional(),
    contractType: z.enum(["JOURNALIER", "FIXE", "HONORAIRE"]),
    salary: z.number().positive("Salaire doit être positif"),
    bankAccount: z.string().optional(),
    bankName: z.string().optional(),
    taxIdentifier: z.string().optional(),
    hireDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    isActive: z.boolean().default(true),
});

export type CreateEmployeeInput = Omit<
    z.infer<typeof CreateEmployeeSchema>,
"companyId">;

// export const UpdateEmployeeSchema = CreateEmployeeSchema.partial().omit({ companyId: true });
export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export const EmployeeFilterSchema = z.object({
    isActive: z.boolean().optional(),
    contractType: z.enum(["JOURNALIER", "FIXE", "HONORAIRE"]).optional(),
    position: z.string().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
});

export const ActivateEmployeeSchema = z.object({
    isActive: z.boolean(),
});


