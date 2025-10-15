import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkQRData() {
  try {
    const profiles = await prisma.employeeProfile.findMany({
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    console.log(`📋 Trouvé ${profiles.length} profils QR:\n`);

    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.employee.fullName} (${profile.employee.email})`);
      console.log(`   QR Token: ${profile.qrToken.substring(0, 100)}...`);
      console.log(`   Longueur: ${profile.qrToken.length} caractères`);
      console.log(`   Est JSON: ${profile.qrToken.startsWith('{') && profile.qrToken.endsWith('}')}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQRData();