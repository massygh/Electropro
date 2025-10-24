const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // Crée l'utilisateur admin avec une requête SQL directe
    await prisma.$executeRaw`
      INSERT INTO "User" (email, name, "firstName", "lastName", password, role, "createdAt")
      VALUES ('admin@electropro.com', 'Admin Electropro', 'Admin', 'Electropro', ${hashedPassword}, 'ADMIN', NOW())
    `;

    console.log('✅ Compte admin créé avec succès !');
    console.log('📧 Email: admin@electropro.com');
    console.log('🔑 Mot de passe: Admin123!');
    console.log('');
    console.log('Vous pouvez maintenant vous connecter sur votre site !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.code === '23505') {
      console.log('ℹ️  Un compte avec cet email existe déjà.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
