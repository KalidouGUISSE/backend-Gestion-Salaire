import { z } from "zod";
export declare const ScanAttendanceSchema: z.ZodObject<{
    qrData: z.ZodString;
    deviceId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const AttendanceReportSchema: z.ZodObject<{
    employeeId: z.ZodOptional<z.ZodNumber>;
    companyId: z.ZodOptional<z.ZodNumber>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    page: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodDefault<z.ZodNumber>>;
    limit: z.ZodPipe<z.ZodTransform<number, unknown>, z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
export type ScanAttendanceInput = z.infer<typeof ScanAttendanceSchema>;
export type AttendanceReportInput = z.infer<typeof AttendanceReportSchema>;
//# sourceMappingURL=AttendanceValidator.d.ts.map