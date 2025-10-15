import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function testPhotoUpload() {
  try {
    // Créer un employé de test
    const testEmployee = await prisma.employee.create({
      data: {
        firstName: 'Test',
        lastName: 'Photo',
        fullName: 'Test Photo',
        email: `test.photo.${Date.now()}@example.com`,
        phone: '123456789',
        position: 'Testeur',
        contractType: 'FIXE',
        salary: 100000,
        hireDate: new Date(),
        isActive: true,
        companyId: 1, // Assumons que la compagnie 1 existe
      }
    });

    console.log('👤 Employé de test créé:', testEmployee.id);

    // Simuler un upload de photo
    const testImagePath = path.join(process.cwd(), 'uploads', 'photos', `employee_${testEmployee.id}_test.jpg`);

    // Créer un fichier image factice
    const dummyImageContent = Buffer.from('fake image content');
    fs.writeFileSync(testImagePath, dummyImageContent);

    console.log('📸 Photo de test créée:', testImagePath);

    // Mettre à jour l'employé avec le chemin de la photo
    const relativePath = testImagePath.replace(/\\/g, '/').replace(/^\/+/, '');
    const updatedEmployee = await prisma.employee.update({
      where: { id: testEmployee.id },
      data: { photos: relativePath }
    });

    console.log('✅ Employé mis à jour avec photo:', updatedEmployee.photos);

    // Nettoyer
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }

    // Supprimer l'employé de test
    await prisma.employee.delete({ where: { id: testEmployee.id } });
    console.log('🧹 Employé de test supprimé');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPhotoUpload();