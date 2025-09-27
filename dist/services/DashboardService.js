import { prisma } from "../prisma/client.js";
export class DashboardService {
    async getKPIs(companyId) {
        const now = new Date();
        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const last6Months = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        // Total payroll cost this month
        const totalPayrollThisMonth = await prisma.payslip.aggregate({
            where: {
                payRun: {
                    companyId,
                    periodStart: {
                        gte: currentMonth,
                        lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
                    }
                }
            },
            _sum: { netPayable: true }
        });
        // Total paid vs unpaid
        const paymentStats = await prisma.payslip.aggregate({
            where: {
                payRun: { companyId }
            },
            _sum: {
                netPayable: true,
                paidAmount: true
            }
        });
        const totalPayable = Number(paymentStats._sum.netPayable) || 0;
        const totalPaid = Number(paymentStats._sum.paidAmount) || 0;
        const totalUnpaid = totalPayable - totalPaid;
        // Active employees
        const activeEmployees = await prisma.employee.count({
            where: { companyId, isActive: true }
        });
        // Evolution over last 6 months
        const evolution = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const monthlyStats = await prisma.payslip.aggregate({
                where: {
                    payRun: {
                        companyId,
                        periodStart: {
                            gte: monthStart,
                            lt: monthEnd
                        }
                    }
                },
                _sum: {
                    gross: true,
                    netPayable: true,
                    paidAmount: true
                }
            });
            const gross = Number(monthlyStats._sum.gross) || 0;
            const paid = Number(monthlyStats._sum.paidAmount) || 0;
            const outstanding = (Number(monthlyStats._sum.netPayable) || 0) - paid;
            evolution.push({
                month: monthStart.toISOString().slice(0, 7), // YYYY-MM
                gross,
                paid,
                outstanding
            });
        }
        return {
            totalPayroll: Number(totalPayrollThisMonth._sum.netPayable) || 0,
            totalPaid,
            totalOutstanding: totalUnpaid,
            activeEmployees,
            evolution
        };
    }
}
//# sourceMappingURL=DashboardService.js.map