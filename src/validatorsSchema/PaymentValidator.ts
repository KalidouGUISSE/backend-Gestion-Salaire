import { z } from "zod";
import { PaymentMethod, PayslipStatus } from "@prisma/client";

export const CreatePaymentSchema = z.object({
  payslipId: z.number().int().positive("ID bulletin requis").optional(),
  amount: z.number().positive("Montant doit être positif"),
  method: z.nativeEnum(PaymentMethod),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;

export const ListPaymentsSchema = z.object({
  payRunId: z.number().int().positive().optional(),
  status: z.nativeEnum(PayslipStatus).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export const GenerateReceiptSchema = z.object({
  payslipId: z.number().int().positive("ID bulletin requis").optional(),
  payRunId: z.number().int().positive("ID cycle de paie requis").optional(),
}).refine((data) => data.payslipId || data.payRunId, {
  message: "ID bulletin ou cycle de paie requis",
});
