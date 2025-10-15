import type { Attendance } from "@prisma/client";
import { AttendanceRepository } from "../repositories/AttendanceRepository.js";
import { prisma } from "../prisma/client.js";
import type { PaginationQuery, PaginationResult } from "../utils/pagination.js";

export class AttendanceService {
  private repo: AttendanceRepository;

  constructor() {
    this.repo = new AttendanceRepository();
  }

  async scanQRCode(qrData: string, deviceId?: string): Promise<{ attendance: Attendance; employeeInfo: any }> {
    // Parse QR data
    let employeeData;
    try {
      employeeData = JSON.parse(qrData);
    } catch (error) {
      throw new Error("Format QR invalide");
    }

    // Validate required fields
    if (!employeeData.employeeId || !employeeData.firstName || !employeeData.lastName) {
      throw new Error("Données QR incomplètes");
    }

    // Find employee by ID to verify they still exist and are active
    const employee = await prisma.employee.findUnique({
      where: { id: employeeData.employeeId },
      include: { company: true, profile: true },
    });

    if (!employee) {
      throw new Error("Employé non trouvé");
    }

    if (!employee.isActive) {
      throw new Error("Employé inactif");
    }
    const now = new Date();

    // Get today's attendances for this employee
    const todayAttendances = await this.repo.findByEmployeeAndDate(employee.id, now);

    // Determine the type of scan
    let type: 'ENTRY' | 'EXIT' = 'ENTRY';

    if (todayAttendances.length > 0) {
      const lastAttendance = todayAttendances[todayAttendances.length - 1]!;
      if (lastAttendance.type === 'ENTRY') {
        type = 'EXIT';
      } else {
        // Already has exit, reject
        throw new Error("Vous avez déjà enregistré votre sortie aujourd'hui");
      }
    }

    // Create attendance record
    const attendance = await this.repo.create({
      employeeId: employee.id,
      companyId: employee.companyId,
      timestamp: now,
      type,
      deviceId: deviceId || null,
    });

    // Increment attendance count for the employee
    await prisma.employee.update({
      where: { id: employee.id },
      data: {
        attendanceCount: {
          increment: 1
        }
      }
    });

    return {
      attendance,
      employeeInfo: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        contractType: employee.contractType,
        company: {
          id: employee.company.id,
          name: employee.company.name
        }
      }
    };
  }

  async getTodayAttendance(employeeId: number): Promise<Attendance[]> {
    const today = new Date();
    return this.repo.findByEmployeeAndDate(employeeId, today);
  }

  async getAttendanceReport(
    filters: {
      employeeId?: number;
      companyId?: number;
      startDate?: Date;
      endDate?: Date;
    },
    query: PaginationQuery
  ): Promise<PaginationResult<Attendance>> {
    const startDate = filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const endDate = filters.endDate || new Date();

    let where: any = {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (filters.employeeId) {
      where.employeeId = filters.employeeId;
    }

    if (filters.companyId) {
      where.companyId = filters.companyId;
    }

    return this.repo.findByCompanyInPeriod(filters.companyId || 0, startDate, endDate, query);
  }

  async getWorkingHours(employeeId: number, startDate: Date, endDate: Date): Promise<{ date: string; hours: number }[]> {
    return this.repo.getWorkingHours(employeeId, startDate, endDate);
  }

  async exportAttendanceReport(companyId: number, startDate: Date, endDate: Date): Promise<string> {
    const attendances = await prisma.attendance.findMany({
      where: {
        companyId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { employee: true },
      orderBy: { timestamp: 'desc' },
    });

    // Create CSV content
    const headers = ['Date', 'Employee ID', 'Employee Name', 'Type', 'Time', 'Device ID'];
    const rows = attendances.map(att => [
      att.timestamp.toISOString().split('T')[0],
      att.employeeId.toString(),
      att.employee.fullName,
      att.type,
      att.timestamp.toISOString().split('T')[1]?.split('.')[0] || '',
      att.deviceId || '',
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    return csvContent;
  }
}