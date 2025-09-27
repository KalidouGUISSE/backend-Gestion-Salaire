import type { Payslip } from "@prisma/client";
import { PayslipRepository } from "../repositories/PayslipRepository.js";

export class PayslipService {
    private repo: PayslipRepository;

    constructor() {
        this.repo = new PayslipRepository();
    }

    findPayslipById(id: number): Promise<Payslip | null> {
        return this.repo.findById(id, { include: { employee: true, payRun: true, payments: true } });
    }

    updatePayslip(id: number, data: Partial<Payslip>): Promise<Payslip> {
        return this.repo.update(id, data as any);
    }

    async getPayRunStatus(payRunId: number): Promise<{ status: string; companyId: number }> {
        const payRun = await this.repo.getPayRunStatus(payRunId);
        return payRun;
    }
}