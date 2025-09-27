import { z } from "zod";

export const CreatePayRunSchema = z.object({
    companyId: z.number().int().positive("ID entreprise invalide"),
    type: z.enum(["MONTHLY", "WEEKLY", "DAILY"]),
    periodStart: z.string().datetime(),
    periodEnd: z.string().datetime(),
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