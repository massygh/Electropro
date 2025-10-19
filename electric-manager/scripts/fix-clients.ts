import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Trouver tous les utilisateurs CLIENT
  const clientUsers = await prisma.user.findMany({
    where: { accountType: 'CLIENT' },
    include: { client: true }
  })

  console.log(`✅ Trouvé ${clientUsers.length} utilisateurs CLIENT`)

  for (const user of clientUsers) {
    if (!user.client) {
      console.log(`⚠️  L'utilisateur ${user.email} n'a pas de profil Client associé`)

      // Créer le profil Client
      const newClient = await prisma.client.create({
        data: {
          name: user.name || user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          userId: user.id,
        }
      })

      console.log(`✅ Profil Client créé pour ${user.email}`)
    } else {
      console.log(`✅ ${user.email} a déjà un profil Client (ID: ${user.client.id})`)
    }
  }

  // Afficher tous les clients
  const allClients = await prisma.client.findMany({
    include: { user: true }
  })

  console.log(`\n📋 Total de ${allClients.length} clients dans la table Client:`)
  for (const client of allClients) {
    console.log(`   - ${client.name} (${client.email})${client.user ? ` -> Lié au User ID ${client.userId}` : ' -> Pas de User lié'}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
