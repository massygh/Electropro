const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function verifyAdmin() {
  try {
    console.log('=== VÉRIFICATION COMPLÈTE DU COMPTE ADMIN ===\n');

    // 1. Vérifier la connexion à la base
    console.log('1. Test de connexion à la base de données...');
    await prisma.$connect();
    console.log('   ✅ Connecté à Neon\n');

    // 2. Lister TOUS les utilisateurs
    console.log('2. Liste de TOUS les utilisateurs dans la base:');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    });

    console.log(`   Nombre total d'utilisateurs: ${allUsers.length}`);
    allUsers.forEach(u => {
      console.log(`   - ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Has Password: ${u.password ? 'YES' : 'NO'}`);
    });
    console.log('');

    // 3. Chercher spécifiquement l'admin
    console.log('3. Recherche de admin@electropro.com...');
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@electropro.com' }
    });

    if (!admin) {
      console.log('   ❌ ADMIN NON TROUVÉ!\n');
      console.log('Le compte admin n\'existe PAS dans la base Neon!');
      return;
    }

    console.log('   ✅ Admin trouvé!');
    console.log(`   - ID: ${admin.id}`);
    console.log(`   - Email: ${admin.email}`);
    console.log(`   - Name: ${admin.name}`);
    console.log(`   - Role: ${admin.role}`);
    console.log(`   - Has password: ${admin.password ? 'YES' : 'NO'}`);
    console.log('');

    // 4. Vérifier le mot de passe
    if (admin.password) {
      console.log('4. Test du mot de passe "Admin123!"...');
      const isValid = await bcrypt.compare('Admin123!', admin.password);
      console.log(`   ${isValid ? '✅' : '❌'} Mot de passe ${isValid ? 'VALIDE' : 'INVALIDE'}`);
      console.log('');
    }

    // 5. Vérifier les colonnes de la table User
    console.log('5. Structure de la table User:');
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'User'
      ORDER BY ordinal_position;
    `;
    console.log('   Colonnes:');
    tableInfo.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });

    console.log('\n=== FIN DE LA VÉRIFICATION ===');

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdmin();
