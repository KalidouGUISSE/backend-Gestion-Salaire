import { z } from "zod";
export const CreateCompanySchema = z.object({
    name: z.string().min(1, "Nom de l'entreprise requis").max(100, "Nom trop long"),
    logo: z.string().optional(),
    address: z.string().optional(),
    currency: z.string().default("XOF"),
    payPeriodType: z.enum(["MONTHLY", "WEEKLY", "DAILY"]).default("MONTHLY"),
    isActive: z.boolean().default(true),
});
export const UpdateCompanySchema = z.object({
    name: z.string().min(1, "Nom de l'entreprise requis").max(100, "Nom trop long").optional(),
    logo: z.string().optional(),
    address: z.string().optional(),
    currency: z.string().optional(),
    payPeriodType: z.enum(["MONTHLY", "WEEKLY", "DAILY"]).optional(),
    isActive: z.boolean().optional(),
});
export const CompanyFilterSchema = z.object({
    isActive: z.preprocess((val) => val === "true" ? true : val === "false" ? false : val, z.boolean().optional()),
    name: z.string().optional(),
    page: z.preprocess((val) => Number(val), z.number().int().positive().default(1)),
    limit: z.preprocess((val) => Number(val), z.number().int().positive().max(100).default(10)),
});
export const ActivateCompanySchema = z.object({
    isActive: z.boolean(),
});
//# sourceMappingURL=CompanyValidator.js.map