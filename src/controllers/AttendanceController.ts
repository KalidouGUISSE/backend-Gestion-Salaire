import type { Request, Response } from "express";
import { AttendanceService } from "../services/AttendanceService.js";
import { ScanAttendanceSchema, AttendanceReportSchema } from "../validatorsSchema/AttendanceValidator.js";
import { formatSuccess, formatError } from "../utils/responseFormatter.js";
import { HttpStatus } from "../enums/httpStatus.js";

export class AttendanceController {
  private service: AttendanceService;

  constructor() {
    this.service = new AttendanceService();
  }

  async scanQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { qrData, deviceId } = ScanAttendanceSchema.parse(req.body);
      const result = await this.service.scanQRCode(qrData, deviceId);

      res.status(HttpStatus.CREATED).json(formatSuccess({
        attendance: result.attendance,
        employeeInfo: result.employeeInfo
      }, HttpStatus.CREATED, `Pointage ${result.attendance.type.toLowerCase()} enregistré avec succès pour ${result.employeeInfo.fullName}`));
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message || "Erreur lors du scan QR"));
    }
  }

  async getTodayAttendance(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = parseInt(req.params.employeeId!);
      const attendances = await this.service.getTodayAttendance(employeeId);

      res.json(formatSuccess(attendances));
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(formatError(HttpStatus.INTERNAL_SERVER_ERROR, error.message || "Erreur lors de la récupération des pointages"));
    }
  }

  async getAttendanceReport(req: Request, res: Response): Promise<void> {
    try {
      const parsed = AttendanceReportSchema.parse(req.query);
      const filters: { employeeId?: number; companyId?: number; startDate?: Date; endDate?: Date } = {};
      if (parsed.employeeId) filters.employeeId = parsed.employeeId;
      if (parsed.companyId) filters.companyId = parsed.companyId;
      if (parsed.startDate) filters.startDate = new Date(parsed.startDate);
      if (parsed.endDate) filters.endDate = new Date(parsed.endDate);
      const report = await this.service.getAttendanceReport(filters, {
        page: parsed.page,
        limit: parsed.limit,
      });

      res.json(formatSuccess(report));
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json(formatError(HttpStatus.BAD_REQUEST, error.message || "Erreur lors de la génération du rapport"));
    }
  }

  async exportAttendanceReport(req: Request, res: Response): Promise<void> {
    try {
      const { companyId, startDate, endDate } = req.query as {
        companyId: string;
        startDate: string;
        endDate: string;
      };

      const csvContent = await this.service.exportAttendanceReport(
        parseInt(companyId),
        new Date(startDate),
        new Date(endDate)
      );

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="attendance-report.csv"');
      res.send(csvContent);
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(formatError(HttpStatus.INTERNAL_SERVER_ERROR, error.message || "Erreur lors de l'export du rapport"));
    }
  }

  async getWorkingHours(req: Request, res: Response): Promise<void> {
    try {
      const { employeeId, startDate, endDate } = req.query as {
        employeeId: string;
        startDate: string;
        endDate: string;
      };

      const hours = await this.service.getWorkingHours(
        parseInt(employeeId),
        new Date(startDate),
        new Date(endDate)
      );

      res.json(formatSuccess(hours));
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(formatError(HttpStatus.INTERNAL_SERVER_ERROR, error.message || "Erreur lors du calcul des heures travaillées"));
    }
  }
}