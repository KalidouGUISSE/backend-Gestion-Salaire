import { PrismaClient } from "@prisma/client";
import { AttendanceService } from "./src/services/AttendanceService.js";

const prisma = new PrismaClient();
const attendanceService = new AttendanceService();

async function testQRScan() {
  try {
    // Récupérer un employé avec son profil QR
    const employee = await prisma.employee.findFirst({
      include: { profile: true }
    });

    if (!employee || !employee.profile) {
      console.log('❌ Aucun employé avec profil QR trouvé');
      return;
    }

    console.log('👤 Employé trouvé:', employee.fullName);
    console.log('📱 QR Token:', employee.profile.qrToken);

    // Tester le scan avec les données QR
    const result = await attendanceService.scanQRCode(employee.profile.qrToken, 'test-device');

    console.log('✅ Scan réussi!');
    console.log('📊 Résultat:', {
      attendance: {
        id: result.attendance.id,
        type: result.attendance.type,
        timestamp: result.attendance.timestamp
      },
      employeeInfo: result.employeeInfo
    });

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testQRScan();