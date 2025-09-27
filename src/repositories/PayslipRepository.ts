import { prisma } from "../prisma/client.js";
import type { Payslip } from "@prisma/client";
import { CRUDRepesitorie } from "./CRUDRepesitorie.js";

export class PayslipRepository extends CRUDRepesitorie<Payslip> {
    constructor() {
        super(prisma, prisma.payslip);
    }

    async getPayRunStatus(payRunId: number): Promise<{ status: string; companyId: number }> {
        const payRun = await prisma.payRun.findUnique({
            where: { id: payRunId },
            select: { status: true, companyId: true }
        });
        if (!payRun) throw new Error("PayRun not found");
        return payRun;
    }
}