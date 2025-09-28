import { z } from "zod";

export const CreatePayRunSchema = z.object({
    companyId: z.number().int().positive("ID entreprise invalide").optional(),
    title: z.string().optional(),
    type: z.enum(["MONTHLY", "WEEKLY", "DAILY"]),
    periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD attendu)").transform((date) => new Date(date + 'T00:00:00.000Z').toISOString()),
    periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD attendu)").transform((date) => new Date(date + 'T23:59:59.999Z').toISOString()),
    notes: z.string().optional(),
});

export const UpdatePayRunSchema = z.object({
    notes: z.string().optional(),
});

export const ApprovePayRunSchema = z.object({
    status: z.literal("APPROVED"),
});

export const PayRunFilterSchema = z.object({
    status: z.enum(["DRAFT", "APPROVED", "CLOSED"]).optional(),
    type: z.enum(["MONTHLY", "WEEKLY", "DAILY"]).optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
});