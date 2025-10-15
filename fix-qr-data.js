import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixQRData() {
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
        // Créer les nouvelles données QR
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

        // Mettre à jour le profil
        await prisma.employeeProfile.update({
          where: { id: employee.profile.id },
          data: {
            qrToken: qrToken
          }
        });

        console.log(`✅ QR mis à jour pour ${employee.fullName}`);
        console.log(`📄 Nouvelles données:`, qrToken.substring(0, 100) + '...');
      }
    }

    console.log("🎉 Mise à jour terminée !");
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixQRData();