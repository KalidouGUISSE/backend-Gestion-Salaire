import { z } from "zod";

export const CreatePayslipSchema = z.object({
    payRunId: z.number().positive("ID du cycle de paie requis"),
    employeeId: z.number().positive("ID de l'employé requis"),
    gross: z.number().positive("Salaire brut doit être positif"),
    deductions: z.number().min(0, "Déductions ne peuvent pas être négatives"),
    netPayable: z.number().positive("Net payable doit être positif"),
    paidAmount: z.number().min(0, "Montant payé ne peut pas être négatif").default(0),
    status: z.enum(["PENDING", "PAID", "PARTIAL"]).default("PENDING"),
    locked: z.boolean().default(false),
    notes: z.string().optional(),
    pdfPath: z.string().optional().nullable(),
});

export const UpdatePayslipSchema = z.object({
    gross: z.number().positive("Gross doit être positif").optional(),
    deductions: z.number().min(0, "Déductions ne peuvent pas être négatives").optional(),
    netPayable: z.number().positive("Net payable doit être positif").optional(),
    notes: z.string().optional(),
});
