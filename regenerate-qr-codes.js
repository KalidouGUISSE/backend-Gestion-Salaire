import { PrismaClient } from "@prisma/client";
import { QRUtils } from "./src/utils/qrUtils.js";

const prisma = new PrismaClient();

async function regenerateQRCodes() {
  console.log("Régénération des QR codes avec les nouvelles données...");

  try {
    // Récupérer tous les employés avec leurs profils
    const employees = await prisma.employee.findMany({
      include: {
        company: true,
        profile: true
      }
    });

    console.log(`Trouvé ${employees.length} employés`);

    for (const employee of employees) {
      if (employee.profile) {
        // Générer les nouvelles données QR
        const qrData = {
          employeeId: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          fullName: employee.fullName,
          email: employee.email,
          phone: employee.phone,
          position: employee.position,
          contractType: employee.contractType,
          companyId: employee.companyId,
          companyName: employee.company.name,
          timestamp: new Date().toISOString(),
          version: '1.0'
        };

        const qrToken = JSON.stringify(qrData);
        const qrCodePath = await QRUtils.generateQRCode(qrToken);

        // Mettre à jour le profil
        await prisma.employeeProfile.update({
          where: { id: employee.profile.id },
          data: {
            qrToken,
            qrCodePath
          }
        });

        console.log(`QR régénéré pour ${employee.fullName}`);
      }
    }

    console.log("Régénération terminée !");
  } catch (error) {
    console.error("Erreur lors de la régénération:", error);
  } finally {
    await prisma.$disconnect();
  }
}

regenerateQRCodes();