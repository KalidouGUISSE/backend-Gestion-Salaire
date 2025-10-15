import type { Request, Response } from "express";
export declare class AttendanceController {
    private service;
    constructor();
    scanQRCode(req: Request, res: Response): Promise<void>;
    getTodayAttendance(req: Request, res: Response): Promise<void>;
    getAttendanceReport(req: Request, res: Response): Promise<void>;
    exportAttendanceReport(req: Request, res: Response): Promise<void>;
    getWorkingHours(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AttendanceController.d.ts.map