import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
async function main() {
    console.log("🌱 Début du seed...");
    // Nettoyer la base de données
    console.log("🧹 Nettoyage de la base de données...");
    await prisma.payment.deleteMany();
    await prisma.payslip.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.payRun.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.document.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();
    const hashedPassword = await bcrypt.hash("password123", 10);
    // --------------------------
    // Entreprises
    // --------------------------
    const company1 = await prisma.company.create({
        data: {
            name: "Entreprise Démo 1",
            logo: "https://placehold.co/100x100",
            address: "Dakar, Sénégal",
            currency: "XOF",
            payPeriodType: "MONTHLY",
        },
    });
    const company2 = await prisma.company.create({
        data: {
            name: "Entreprise Démo 2",
            logo: "https://placehold.co/100x100",
            address: "Saint-Louis, Sénégal",
            currency: "XOF",
            payPeriodType: "WEEKLY",
        },
    });
    // --------------------------
    // Utilisateurs
    // --------------------------
    await prisma.user.createMany({
        data: [
            { fullName: "Super Admin", email: "superadmin@demo.com", password: hashedPassword, role: "SUPER_ADMIN", isActive: true },
            { fullName: "Admin 1", email: "admin1@demo.com", password: hashedPassword, role: "ADMIN", isActive: true, companyId: company1.id },
            { fullName: "Caissier 1", email: "caissier1@demo.com", password: hashedPassword, role: "CASHIER", isActive: true, companyId: company1.id },
            { fullName: "Admin 2", email: "admin2@demo.com", password: hashedPassword, role: "ADMIN", isActive: true, companyId: company2.id },
        ],
    });
    // --------------------------
    // Employés
    // --------------------------
    const employees = [
        { firstName: "Aliou", lastName: "Ndiaye", position: "Comptable", contractType: "FIXE", salary: 300000, companyId: company1.id },
        { firstName: "Fatou", lastName: "Diop", position: "Secrétaire", contractType: "JOURNALIER", salary: 15000, companyId: company1.id },
        { firstName: "Mamadou", lastName: "Sy", position: "Consultant IT", contractType: "HONORAIRE", salary: 200000, companyId: company1.id },
        { firstName: "Awa", lastName: "Fall", position: "Assistante", contractType: "FIXE", salary: 250000, companyId: company2.id },
        { firstName: "Ousmane", lastName: "Ba", position: "Technicien", contractType: "JOURNALIER", salary: 12000, companyId: company2.id },
    ];
    const createdEmployees = [];
    for (const emp of employees) {
        const e = await prisma.employee.create({
            data: {
                ...emp,
                fullName: `${emp.firstName} ${emp.lastName}`,
                isActive: true,
                contractType: emp.contractType, // Cast to avoid enum issue
            },
        });
        createdEmployees.push(e);
    }
    // --------------------------
    // Cycles de paie
    // --------------------------
    const payRun1 = await prisma.payRun.create({
        data: {
            companyId: company1.id,
            type: "MONTHLY",
            periodStart: new Date("2025-09-01"),
            periodEnd: new Date("2025-09-30"),
            status: "DRAFT",
            createdById: 2, // Admin 1
        },
    });
    const payRun2 = await prisma.payRun.create({
        data: {
            companyId: company2.id,
            type: "WEEKLY",
            periodStart: new Date("2025-09-22"),
            periodEnd: new Date("2025-09-28"),
            status: "DRAFT",
            createdById: 4, // Admin 2
        },
    });
    // --------------------------
    // Bulletins de salaire
    // --------------------------
    for (const emp of createdEmployees.filter(e => e.companyId === company1.id)) {
        await prisma.payslip.create({
            data: {
                payRunId: payRun1.id,
                employeeId: emp.id,
                gross: emp.salary,
                deductions: Number(emp.salary) * 0.1,
                netPayable: Number(emp.salary) * 0.9,
                status: "PENDING",
            },
        });
    }
    for (const emp of createdEmployees.filter(e => e.companyId === company2.id)) {
        await prisma.payslip.create({
            data: {
                payRunId: payRun2.id,
                employeeId: emp.id,
                gross: emp.salary,
                deductions: Number(emp.salary) * 0.1,
                netPayable: Number(emp.salary) * 0.9,
                status: "PENDING",
            },
        });
    }
    // Create some additional payslips that are not fully paid for testing
    const testEmployee = createdEmployees.find(e => e.companyId === company1.id);
    if (testEmployee) {
        await prisma.payslip.create({
            data: {
                payRunId: payRun1.id,
                employeeId: testEmployee.id,
                gross: 200000,
                deductions: 20000,
                netPayable: 180000,
                status: "PENDING", // This one won't be paid
            },
        });
    }
    // --------------------------
    // Paiements
    // --------------------------
    const payslips1 = await prisma.payslip.findMany({ where: { payRunId: payRun1.id } });
    for (const slip of payslips1) {
        const payment1 = await prisma.payment.create({
            data: { payslipId: slip.id, companyId: company1.id, amount: slip.netPayable.toNumber() / 2, method: "CASH", paidById: 2 },
        });
        const payment2 = await prisma.payment.create({
            data: { payslipId: slip.id, companyId: company1.id, amount: slip.netPayable.toNumber() / 2, method: "BANK_TRANSFER", paidById: 2 },
        });
        // Update payslip
        const totalPaid = payment1.amount.toNumber() + payment2.amount.toNumber();
        await prisma.payslip.update({
            where: { id: slip.id },
            data: {
                paidAmount: totalPaid,
                status: totalPaid >= slip.netPayable.toNumber() ? "PAID" : "PARTIAL",
            },
        });
    }
    // --------------------------
    // Présences / feuilles de présence
    // --------------------------
    const today = new Date("2025-09-25");
    for (const emp of createdEmployees) {
        if (emp.contractType === "JOURNALIER") {
            await prisma.attendance.create({
                data: {
                    employeeId: emp.id,
                    companyId: emp.companyId,
                    date: today,
                    present: true,
                    hoursWorked: 8,
                },
            });
        }
    }
    // --------------------------
    // Documents (PDFs fictifs)
    // --------------------------
    await prisma.document.createMany({
        data: [
            { companyId: company1.id, type: "bulletin", path: "/pdfs/bulletin1.pdf", meta: { period: "2025-09" } },
            { companyId: company1.id, type: "receipt", path: "/pdfs/receipt1.pdf" },
            { companyId: company2.id, type: "bulletin", path: "/pdfs/bulletin2.pdf", meta: { period: "2025-W39" } },
        ],
    });
    console.log("✅ Seed complet terminé !");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map