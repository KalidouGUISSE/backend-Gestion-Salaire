import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateAttendanceCount() {
  console.log("Mise à jour du compteur de pointages...");

  try {
    // Récupérer tous les employés
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        fullName: true,
        _count: {
          select: {
            attendances: true
          }
        }
      }
    });

    console.log(`Trouvé ${employees.length} employés`);

    // Mettre à jour le compteur pour chaque employé
    for (const employee of employees) {
      await prisma.employee.update({
        where: { id: employee.id },
        data: {
          attendanceCount: employee._count.attendances
        }
      });
      console.log(`${employee.fullName}: ${employee._count.attendances} pointages`);
    }

    console.log("Mise à jour terminée !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAttendanceCount();