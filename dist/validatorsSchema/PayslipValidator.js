import { z } from "zod";
export const UpdatePayslipSchema = z.object({
    gross: z.number().positive("Gross doit être positif").optional(),
    deductions: z.number().min(0, "Déductions ne peuvent pas être négatives").optional(),
    netPayable: z.number().positive("Net payable doit être positif").optional(),
    notes: z.string().optional(),
});
//# sourceMappingURL=PayslipValidator.js.map