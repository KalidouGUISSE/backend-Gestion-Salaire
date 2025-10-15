import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed...");

  // Nettoyer la base de données (sauf utilisateurs pour éviter de perdre les comptes existants)
  console.log("🧹 Nettoyage de la base de données...");
  await prisma.payment.deleteMany();
  await prisma.payslip.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.payRun.deleteMany();
  await prisma.employeeProfile.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.document.deleteMany();
  // Ne pas supprimer les utilisateurs pour préserver les comptes existants
  await prisma.company.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);
  const superAdminPassword = await bcrypt.hash("SecureTemp!2025#Admin", 10);

  // --------------------------
  // Entreprises
  // --------------------------
  console.log("🏢 Création des entreprises...");
  const company1 = await prisma.company.create({
    data: {
      name: "TechSolutions Senegal",
      logo: "https://placehold.co/100x100/4F46E5/FFFFFF?text=TS",
      address: "123 Avenue Léopold Sédar Senghor, Dakar, Sénégal",
      currency: "XOF",
      payPeriodType: "MONTHLY",
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: "AgriBusiness SA",
      logo: "https://placehold.co/100x100/059669/FFFFFF?text=AB",
      address: "456 Boulevard de la République, Saint-Louis, Sénégal",
      currency: "XOF",
      payPeriodType: "WEEKLY",
    },
  });

  const company3 = await prisma.company.create({
    data: {
      name: "Digital Marketing Pro",
      logo: "https://placehold.co/100x100/DC2626/FFFFFF?text=DM",
      address: "789 Rue de la Paix, Thiès, Sénégal",
      currency: "XOF",
      payPeriodType: "MONTHLY",
    },
  });

  // --------------------------
  // Utilisateurs
  // --------------------------
  console.log("👥 Création des utilisateurs...");
  const userData = [
    {
      fullName: "superadmin",
      email: "superadmin@example.com",
      password: superAdminPassword,
      role: "SUPER_ADMIN" as const,
      isActive: true
    },
    {
      fullName: "Super Admin Demo",
      email: "superadmin@demo.com",
      password: hashedPassword,
      role: "SUPER_ADMIN" as const,
      isActive: true
    },
    {
      fullName: "Jean Dupont",
      email: "admin1@techsolutions.sn",
      password: hashedPassword,
      role: "ADMIN" as const,
      isActive: true,
      companyId: company1.id
    },
    {
      fullName: "Marie Diop",
      email: "caissier1@techsolutions.sn",
      password: hashedPassword,
      role: "CASHIER" as const,
      isActive: true,
      companyId: company1.id
    },
    {
      fullName: "Pierre Sow",
      email: "admin2@agribusiness.sn",
      password: hashedPassword,
      role: "ADMIN" as const,
      isActive: true,
      companyId: company2.id
    },
    {
      fullName: "Sophie Faye",
      email: "caissier2@agribusiness.sn",
      password: hashedPassword,
      role: "CASHIER" as const,
      isActive: true,
      companyId: company2.id
    },
    {
      fullName: "Ahmed Ndiaye",
      email: "admin3@digitalmarketing.sn",
      password: hashedPassword,
      role: "ADMIN" as const,
      isActive: true,
      companyId: company3.id
    },
  ];

  const users = [];
  for (const user of userData) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
    users.push(createdUser);
  }

  // --------------------------
  // Employés
  // --------------------------
  console.log("👷 Création des employés...");
  const employeesData = [
    // TechSolutions Senegal
    {
      firstName: "Mamadou",
      lastName: "Ba",
      email: "mamadou.ba@techsolutions.sn",
      phone: "+221771234567",
      position: "Développeur Senior",
      contractType: "FIXE" as const,
      salary: 450000,
      bankAccount: "SN1234567890123456789012",
      bankName: "CBAO",
      taxIdentifier: "SN123456789",
      hireDate: new Date("2024-01-15"),
      photos: "/uploads/photos/mamadou_ba.jpg",
      companyId: company1.id
    },
    {
      firstName: "Fatou",
      lastName: "Sarr",
      email: "fatou.sarr@techsolutions.sn",
      phone: "+221772345678",
      position: "Designer UX/UI",
      contractType: "FIXE" as const,
      salary: 350000,
      bankAccount: "SN2345678901234567890123",
      bankName: "Ecobank",
      taxIdentifier: "SN234567890",
      hireDate: new Date("2024-02-01"),
      photos: "/uploads/photos/fatou_sarr.jpg",
      companyId: company1.id
    },
    {
      firstName: "Ousmane",
      lastName: "Diallo",
      email: "ousmane.diallo@techsolutions.sn",
      phone: "+221773456789",
      position: "Technicien IT",
      contractType: "JOURNALIER" as const,
      salary: 25000,
      bankAccount: "SN3456789012345678901234",
      bankName: "BHS",
      taxIdentifier: "SN345678901",
      hireDate: new Date("2024-03-10"),
      photos: "/uploads/photos/ousmane_diallo.jpg",
      companyId: company1.id
    },
    {
      firstName: "Aminata",
      lastName: "Ndiaye",
      email: "aminata.ndiaye@techsolutions.sn",
      phone: "+221774567890",
      position: "Chef de Projet",
      contractType: "HONORAIRE" as const,
      salary: 600000,
      bankAccount: "SN4567890123456789012345",
      bankName: "CBAO",
      taxIdentifier: "SN456789012",
      hireDate: new Date("2024-01-20"),
      photos: "/uploads/photos/aminata_ndiaye.jpg",
      companyId: company1.id
    },

    // AgriBusiness SA
    {
      firstName: "Ibrahima",
      lastName: "Gueye",
      email: "ibrahima.gueye@agribusiness.sn",
      phone: "+221775678901",
      position: "Agronome",
      contractType: "FIXE" as const,
      salary: 320000,
      bankAccount: "SN5678901234567890123456",
      bankName: "Ecobank",
      taxIdentifier: "SN567890123",
      hireDate: new Date("2024-01-10"),
      photos: "/uploads/photos/ibrahima_gueye.jpg",
      companyId: company2.id
    },
    {
      firstName: "Khadija",
      lastName: "Sylla",
      email: "khadija.sylla@agribusiness.sn",
      phone: "+221776789012",
      position: "Comptable",
      contractType: "FIXE" as const,
      salary: 280000,
      bankAccount: "SN6789012345678901234567",
      bankName: "BHS",
      taxIdentifier: "SN678901234",
      hireDate: new Date("2024-02-15"),
      photos: "/uploads/photos/khadija_sylla.jpg",
      companyId: company2.id
    },
    {
      firstName: "Moussa",
      lastName: "Diouf",
      email: "moussa.diouf@agribusiness.sn",
      phone: "+221777890123",
      position: "Ouvrier Agricole",
      contractType: "JOURNALIER" as const,
      salary: 18000,
      bankAccount: "SN7890123456789012345678",
      bankName: "CBAO",
      taxIdentifier: "SN789012345",
      hireDate: new Date("2024-03-01"),
      photos: "/uploads/photos/moussa_diouf.jpg",
      companyId: company2.id
    },

    // Digital Marketing Pro
    {
      firstName: "Cheikh",
      lastName: "Fall",
      email: "cheikh.fall@digitalmarketing.sn",
      phone: "+221778901234",
      position: "Marketing Manager",
      contractType: "FIXE" as const,
      salary: 400000,
      bankAccount: "SN8901234567890123456789",
      bankName: "Ecobank",
      taxIdentifier: "SN890123456",
      hireDate: new Date("2024-01-05"),
      photos: "/uploads/photos/cheikh_fall.jpg",
      companyId: company3.id
    },
    {
      firstName: "Ndeye",
      lastName: "Mbaye",
      email: "ndeye.mbaye@digitalmarketing.sn",
      phone: "+221779012345",
      position: "Community Manager",
      contractType: "HONORAIRE" as const,
      salary: 300000,
      bankAccount: "SN9012345678901234567890",
      bankName: "BHS",
      taxIdentifier: "SN901234567",
      hireDate: new Date("2024-02-20"),
      photos: "/uploads/photos/ndeye_mbaye.jpg",
      companyId: company3.id
    },
  ];

  const createdEmployees = [];
  for (const emp of employeesData) {
    const employee = await prisma.employee.create({
      data: {
        ...emp,
        fullName: `${emp.firstName} ${emp.lastName}`,
        isActive: true,
      },
    });
    createdEmployees.push(employee);
  }

  // --------------------------
  // Profils employés (QR codes)
  // --------------------------
  console.log("📱 Création des profils employés avec QR codes...");
  for (const employee of createdEmployees) {
    const qrToken = `EMP${employee.id.toString().padStart(4, '0')}-${Date.now().toString().slice(-6)}`;
    await prisma.employeeProfile.create({
      data: {
        employeeId: employee.id,
        qrToken,
        qrCodePath: `/uploads/qr_codes/qr_${employee.id}.png`,
      },
    });
  }

  // --------------------------
  // Cycles de paie
  // --------------------------
  console.log("💰 Création des cycles de paie...");
  const payRuns = await Promise.all([
    prisma.payRun.create({
      data: {
        companyId: company1.id,
        title: "Paie Septembre 2025",
        type: "MONTHLY",
        periodStart: new Date("2025-09-01"),
        periodEnd: new Date("2025-09-30"),
        status: "APPROVED",
        createdById: users.find((u: any) => u.companyId === company1.id)?.id || null,
        approvedById: users.find((u: any) => u.companyId === company1.id)?.id || null,
      },
    }),
    prisma.payRun.create({
      data: {
        companyId: company2.id,
        title: "Semaine 39-2025",
        type: "WEEKLY",
        periodStart: new Date("2025-09-22"),
        periodEnd: new Date("2025-09-28"),
        status: "APPROVED",
        createdById: users.find((u: any) => u.companyId === company2.id)?.id || null,
        approvedById: users.find((u: any) => u.companyId === company2.id)?.id || null,
      },
    }),
    prisma.payRun.create({
      data: {
        companyId: company3.id,
        title: "Paie Septembre 2025",
        type: "MONTHLY",
        periodStart: new Date("2025-09-01"),
        periodEnd: new Date("2025-09-30"),
        status: "DRAFT",
        createdById: users.find((u: any) => u.companyId === company3.id)?.id || null,
      },
    }),
  ]);

  // --------------------------
  // Bulletins de salaire
  // --------------------------
  console.log("📄 Création des bulletins de salaire...");
  for (const payRun of payRuns) {
    const companyEmployees = createdEmployees.filter(e => e.companyId === payRun.companyId);

    for (const employee of companyEmployees) {
      let gross: number;
      if (employee.contractType === 'JOURNALIER') {
        // Pour les journaliers, calcul basé sur les présences
        gross = employee.salary.toNumber() * 22; // 22 jours travaillés estimés
      } else {
        gross = employee.salary.toNumber();
      }

      const deductions = gross * 0.1; // 10% de déductions
      const netPayable = gross - deductions;

      await prisma.payslip.create({
        data: {
          payRunId: payRun.id,
          employeeId: employee.id,
          gross: gross,
          deductions: deductions,
          netPayable: netPayable,
          status: payRun.status === 'APPROVED' ? 'PENDING' : 'PENDING',
          locked: payRun.status === 'APPROVED',
        },
      });
    }
  }

  // --------------------------
  // Paiements
  // --------------------------
  console.log("💳 Création des paiements...");
  const approvedPayRuns = payRuns.filter(pr => pr.status === 'APPROVED');

  for (const payRun of approvedPayRuns) {
    const payslips = await prisma.payslip.findMany({
      where: { payRunId: payRun.id },
      include: { employee: true }
    });

    for (const payslip of payslips) {
      const cashier = users.find((u: any) => u.companyId === payRun.companyId && u.role === 'CASHIER');
      if (!cashier) continue;

      // Paiement partiel pour certains, complet pour d'autres
      const paymentAmount = payslip.id % 2 === 0 ?
        payslip.netPayable.toNumber() :
        payslip.netPayable.toNumber() / 2;

      const payment = await prisma.payment.create({
        data: {
          companyId: payRun.companyId,
          payslipId: payslip.id,
          amount: paymentAmount,
          method: payslip.id % 3 === 0 ? 'BANK_TRANSFER' : payslip.id % 3 === 1 ? 'ORANGE_MONEY' : 'CASH',
          reference: `PAY-${payslip.id}-${Date.now().toString().slice(-4)}`,
          paidById: cashier.id,
          notes: `Paiement ${payslip.employee.contractType.toLowerCase()}`,
        },
      });

      // Mettre à jour le statut du bulletin
      const totalPaid = payment.amount.toNumber();
      const newStatus = totalPaid >= payslip.netPayable.toNumber() ? 'PAID' : 'PARTIAL';

      await prisma.payslip.update({
        where: { id: payslip.id },
        data: {
          paidAmount: totalPaid,
          status: newStatus,
        },
      });
    }
  }

  // --------------------------
  // Présences
  // --------------------------
  console.log("⏰ Création des présences...");
  const journaliers = createdEmployees.filter(e => e.contractType === 'JOURNALIER');

  for (const employee of journaliers) {
    const baseDate = new Date("2025-09-25");

    // Créer des présences pour les 5 derniers jours ouvrables
    for (let i = 0; i < 5; i++) {
      const workDate = new Date(baseDate);
      workDate.setDate(baseDate.getDate() - i);

      // Skip weekends
      if (workDate.getDay() === 0 || workDate.getDay() === 6) continue;

      const entryTime = new Date(workDate);
      entryTime.setHours(8, 30, 0, 0); // 8h30

      const exitTime = new Date(workDate);
      exitTime.setHours(17, 30, 0, 0); // 17h30

      await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          companyId: employee.companyId,
          timestamp: entryTime,
          type: 'ENTRY',
          deviceId: 'kiosk-tablet-001',
        },
      });

      await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          companyId: employee.companyId,
          timestamp: exitTime,
          type: 'EXIT',
          deviceId: 'kiosk-tablet-001',
        },
      });
    }
  }

  // --------------------------
  // Documents
  // --------------------------
  console.log("📋 Création des documents...");
  const documents = [
    {
      companyId: company1.id,
      type: "bulletin",
      path: "/uploads/documents/bulletin_techsolutions_sep2025.pdf",
      meta: { period: "2025-09", payRunId: payRuns[0].id }
    },
    {
      companyId: company1.id,
      type: "receipt",
      path: "/uploads/documents/receipt_techsolutions_001.pdf",
      meta: { paymentId: 1, amount: 225000 }
    },
    {
      companyId: company2.id,
      type: "bulletin",
      path: "/uploads/documents/bulletin_agribusiness_w39.pdf",
      meta: { period: "2025-W39", payRunId: payRuns[1].id }
    },
    {
      companyId: company2.id,
      type: "liste_paiements",
      path: "/uploads/documents/payments_agribusiness_sep2025.pdf",
      meta: { period: "2025-09", totalAmount: 280000 }
    },
    {
      companyId: company3.id,
      type: "contrat",
      path: "/uploads/documents/contract_digitalmarketing_001.pdf",
      meta: { employeeId: createdEmployees.find(e => e.companyId === company3.id)?.id }
    },
  ];

  await prisma.document.createMany({
    data: documents,
  });

  // --------------------------
  // Mise à jour des totaux des payRuns
  // --------------------------
  console.log("📊 Calcul des totaux des cycles de paie...");
  for (const payRun of payRuns) {
    const payslips = await prisma.payslip.findMany({
      where: { payRunId: payRun.id },
      select: {
        gross: true,
        deductions: true,
        netPayable: true,
        paidAmount: true
      }
    });

    const totalGross = payslips.reduce((sum, p) => sum + p.gross.toNumber(), 0);
    const totalDeductions = payslips.reduce((sum, p) => sum + p.deductions.toNumber(), 0);
    const totalNet = payslips.reduce((sum, p) => sum + p.netPayable.toNumber(), 0);
    const totalPaid = payslips.reduce((sum, p) => sum + p.paidAmount.toNumber(), 0);

    await prisma.payRun.update({
      where: { id: payRun.id },
      data: {
        totalGross,
        totalDeductions,
        totalNet,
        totalPaid,
      },
    });
  }

  console.log("✅ Seed complet terminé avec succès !");
  console.log("\n📊 Résumé des données créées :");
  console.log(`🏢 ${3} entreprises`);
  console.log(`👥 ${users.length} utilisateurs`);
  console.log(`👷 ${createdEmployees.length} employés`);
  console.log(`📱 ${createdEmployees.length} profils QR`);
  console.log(`💰 ${payRuns.length} cycles de paie`);
  console.log(`📄 ${createdEmployees.length * payRuns.length} bulletins de salaire`);
  console.log(`💳 Paiements créés`);
  console.log(`⏰ Présences pour ${journaliers.length} employés journaliers`);
  console.log(`📋 ${documents.length} documents`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
