export declare class DashboardService {
    getKPIs(companyId: number): Promise<{
        totalPayroll: number;
        totalPaid: number;
        totalOutstanding: number;
        activeEmployees: number;
        evolution: {
            month: string;
            gross: number;
            paid: number;
            outstanding: number;
        }[];
    }>;
}
//# sourceMappingURL=DashboardService.d.ts.map