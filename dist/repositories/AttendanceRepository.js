import { prisma } from "../prisma/client.js";
export class AttendanceRepository {
    async create(data) {
        return prisma.attendance.create({ data });
    }
    async findById(id) {
        return prisma.attendance.findUnique({ where: { id } });
    }
    async findByEmployeeAndDate(employeeId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return prisma.attendance.findMany({
            where: {
                employeeId,
                timestamp: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: { timestamp: 'asc' },
        });
    }
    async findByEmployeeInPeriod(employeeId, startDate, endDate) {
        return prisma.attendance.findMany({
            where: {
                employeeId,
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { timestamp: 'asc' },
        });
    }
    async findByCompanyInPeriod(companyId, startDate, endDate, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const [attendances, total] = await Promise.all([
            prisma.attendance.findMany({
                where: {
                    companyId,
                    timestamp: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                include: { employee: true },
                orderBy: { timestamp: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.attendance.count({
                where: {
                    companyId,
                    timestamp: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            }),
        ]);
        return {
            data: attendances,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },
        };
    }
    async getWorkingHours(employeeId, startDate, endDate) {
        const attendances = await this.findByEmployeeInPeriod(employeeId, startDate, endDate);
        const dailyHours = {};
        for (const attendance of attendances) {
            const dateKey = attendance.timestamp.toISOString().split('T')[0];
            if (!(dateKey in dailyHours)) {
                dailyHours[dateKey] = {};
            }
            if (attendance.type === 'ENTRY') {
                dailyHours[dateKey].entry = attendance.timestamp;
            }
            else if (attendance.type === 'EXIT') {
                dailyHours[dateKey].exit = attendance.timestamp;
            }
        }
        return Object.entries(dailyHours).map(([date, times]) => {
            let hours = 0;
            if (times.entry && times.exit) {
                hours = (times.exit.getTime() - times.entry.getTime()) / (1000 * 60 * 60);
            }
            return { date, hours };
        });
    }
}
//# sourceMappingURL=AttendanceRepository.js.map