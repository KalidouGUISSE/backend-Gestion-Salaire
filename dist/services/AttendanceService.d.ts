import type { Attendance } from "@prisma/client";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
export declare class AttendanceService {
    private repo;
    constructor();
    scanQRCode(qrData: string, deviceId?: string): Promise<{
        attendance: Attendance;
        employeeInfo: any;
    }>;
    getTodayAttendance(employeeId: number): Promise<Attendance[]>;
    getAttendanceReport(filters: {
        employeeId?: number;
        companyId?: number;
        startDate?: Date;
        endDate?: Date;
    }, query: PaginationQuery): Promise<PaginationResult<Attendance>>;
    getWorkingHours(employeeId: number, startDate: Date, endDate: Date): Promise<{
        date: string;
        hours: number;
    }[]>;
    exportAttendanceReport(companyId: number, startDate: Date, endDate: Date): Promise<string>;
}
//# sourceMappingURL=AttendanceService.d.ts.map