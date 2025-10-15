import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function updateSuperAdmin() {
  const email = "superadmin@local.com";
  const newPassword = "admin123";

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log("Superadmin mis à jour:");
    console.log(`Email: ${email}`);
    console.log(`Nouveau mot de passe: ${newPassword}`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du superadmin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSuperAdmin();