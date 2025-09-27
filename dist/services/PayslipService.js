import { PayslipRepository } from "../repositories/PayslipRepository.js";
export class PayslipService {
    repo;
    constructor() {
        this.repo = new PayslipRepository();
    }
    findPayslipById(id) {
        return this.repo.findById(id, { include: { employee: true, payRun: true, payments: true } });
    }
    updatePayslip(id, data) {
        return this.repo.update(id, data);
    }
    async getPayRunStatus(payRunId) {
        const payRun = await this.repo.getPayRunStatus(payRunId);
        return payRun;
    }
}
//# sourceMappingURL=PayslipService.js.map