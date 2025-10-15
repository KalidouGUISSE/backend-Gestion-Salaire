import { z } from "zod";
export const ScanAttendanceSchema = z.object({
    qrData: z.string().min(1, "Données QR requises"),
    deviceId: z.string().optional(),
});
export const AttendanceReportSchema = z.object({
    employeeId: z.number().int().positive().optional(),
    companyId: z.number().int().positive().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.preprocess((val) => Number(val), z.number().int().positive().default(1)),
    limit: z.preprocess((val) => Number(val), z.number().int().positive().max(100).default(10)),
});
//# sourceMappingURL=AttendanceValidator.js.map