import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Supprimer les clients qui n'ont pas de userId
  const result = await prisma.client.deleteMany({
    where: {
      userId: null
    }
  })

  console.log(`✅ Supprimé ${result.count} clients sans utilisateur associé`)

  // Afficher tous les clients restants
  const allClients = await prisma.client.findMany({
    include: { user: true }
  })

  console.log(`\n📋 Total de ${allClients.length} clients dans la table Client:`)
  for (const client of allClients) {
    console.log(`   - ${client.name} (${client.email}) -> User: ${client.user?.email}`)
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
