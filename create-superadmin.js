import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createSuperAdmin() {
  const email = "superadmin@local.com";
  const password = "SuperAdmin123!";
  const fullName = "Super Admin Local";

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        fullName,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    console.log("Superadmin créé avec succès:");
    console.log(`Email: ${email}`);
    console.log(`Mot de passe: ${password}`);
    console.log(`Nom complet: ${fullName}`);
  } catch (error) {
    console.error("Erreur lors de la création du superadmin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();