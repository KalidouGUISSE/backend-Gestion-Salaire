import { prisma } from "../prisma/client.js";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";
export class PayslipRepository extends CRUDRepesitorie {
    constructor() {
        super(prisma, prisma.payslip);
    }
    async getPayRunStatus(payRunId) {
        const payRun = await prisma.payRun.findUnique({
            where: { id: payRunId },
            select: { status: true, companyId: true }
        });
        if (!payRun)
            throw new Error("PayRun not found");
        return payRun;
    }
}
//# sourceMappingURL=PayslipRepository.js.map