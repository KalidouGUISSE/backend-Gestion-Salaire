import type { Attendance } from "@prisma/client";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";
export declare class AttendanceRepository {
    create(data: Omit<Attendance, "id" | "createdAt" | "updatedAt">): Promise<Attendance>;
    findById(id: number): Promise<Attendance | null>;
    findByEmployeeAndDate(employeeId: number, date: Date): Promise<Attendance[]>;
    findByEmployeeInPeriod(employeeId: number, startDate: Date, endDate: Date): Promise<Attendance[]>;
    findByCompanyInPeriod(companyId: number, startDate: Date, endDate: Date, query: PaginationQuery): Promise<PaginationResult<Attendance>>;
    getWorkingHours(employeeId: number, startDate: Date, endDate: Date): Promise<{
        date: string;
        hours: number;
    }[]>;
}
//# sourceMappingURL=AttendanceRepository.d.ts.map