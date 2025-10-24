const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testPassword() {
  try {
    // Récupérer l'utilisateur
    const user = await prisma.$queryRaw`
      SELECT id, email, name, role, password
      FROM "User"
      WHERE email = 'admin@electropro.com'
    `;

    console.log('=== Résultats de la recherche ===');
    console.log('Utilisateurs trouvés:', user.length);

    if (user.length > 0) {
      const admin = user[0];
      console.log('\n✅ Utilisateur trouvé:');
      console.log('  ID:', admin.id);
      console.log('  Email:', admin.email);
      console.log('  Name:', admin.name);
      console.log('  Role:', admin.role);
      console.log('  Has password:', admin.password ? 'YES' : 'NO');

      if (admin.password) {
        // Tester le mot de passe
        console.log('\n=== Test du mot de passe ===');
        const testPassword = 'Admin123!';
        const isValid = await bcrypt.compare(testPassword, admin.password);
        console.log(`  Mot de passe "${testPassword}" valide:`, isValid ? '✅ OUI' : '❌ NON');

        // Afficher les premiers caractères du hash pour debug
        console.log('  Hash starts with:', admin.password.substring(0, 20) + '...');
      }
    } else {
      console.log('\n❌ Aucun utilisateur trouvé avec cet email');
      console.log('Le compte admin n\'a pas été créé correctement.');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPassword();
