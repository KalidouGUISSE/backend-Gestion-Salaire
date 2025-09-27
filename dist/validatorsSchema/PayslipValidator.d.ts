import { z } from "zod";
export declare const UpdatePayslipSchema: z.ZodObject<{
    gross: z.ZodOptional<z.ZodNumber>;
    deductions: z.ZodOptional<z.ZodNumber>;
    netPayable: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=PayslipValidator.d.ts.map