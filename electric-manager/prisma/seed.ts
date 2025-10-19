import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Créer un compte ADMIN
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@electropro.com' },
    update: {},
    create: {
      email: 'admin@electropro.com',
      password: adminPassword,
      name: 'Admin ElectroPro',
      firstName: 'Admin',
      lastName: 'ElectroPro',
      accountType: 'ADMIN',
      phone: '0123456789',
    },
  })

  // Créer un compte PRO
  const proPassword = await bcrypt.hash('pro123', 10)
  const pro = await prisma.user.upsert({
    where: { email: 'pro@electropro.com' },
    update: {},
    create: {
      email: 'pro@electropro.com',
      password: proPassword,
      name: 'Jean Dupont',
      firstName: 'Jean',
      lastName: 'Dupont',
      accountType: 'PRO',
      phone: '0612345678',
    },
  })

  // Créer des comptes CLIENT avec leurs profils Client associés
  const clientUser1Password = await bcrypt.hash('client1', 10)
  const clientUser1 = await prisma.user.upsert({
    where: { email: 'jean.dupont@example.com' },
    update: {},
    create: {
      email: 'jean.dupont@example.com',
      password: clientUser1Password,
      name: 'Dupont Électricité',
      firstName: 'Jean',
      lastName: 'Dupont',
      accountType: 'CLIENT',
      phone: '0601020304',
    },
  })

  const client1 = await prisma.client.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Dupont Électricité',
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '0601020304',
      email: 'jean.dupont@example.com',
      address: '123 Rue de la République, 75001 Paris',
      notes: 'Client régulier',
      userId: clientUser1.id,
    },
  })

  const clientUser2Password = await bcrypt.hash('client2', 10)
  const clientUser2 = await prisma.user.upsert({
    where: { email: 'sophie.martin@example.com' },
    update: {},
    create: {
      email: 'sophie.martin@example.com',
      password: clientUser2Password,
      name: 'Martin Résidence',
      firstName: 'Sophie',
      lastName: 'Martin',
      accountType: 'CLIENT',
      phone: '0605060708',
    },
  })

  const client2 = await prisma.client.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Martin Résidence',
      firstName: 'Sophie',
      lastName: 'Martin',
      phone: '0605060708',
      email: 'sophie.martin@example.com',
      address: '456 Avenue des Champs, 75008 Paris',
      notes: 'Préfère les rendez-vous le matin',
      userId: clientUser2.id,
    },
  })

  const clientUser3Password = await bcrypt.hash('client3', 10)
  const clientUser3 = await prisma.user.upsert({
    where: { email: 'pierre.bernard@example.com' },
    update: {},
    create: {
      email: 'pierre.bernard@example.com',
      password: clientUser3Password,
      name: 'Bernard Entreprise',
      firstName: 'Pierre',
      lastName: 'Bernard',
      accountType: 'CLIENT',
      phone: '0609101112',
    },
  })

  const client3 = await prisma.client.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Bernard Entreprise',
      firstName: 'Pierre',
      lastName: 'Bernard',
      phone: '0609101112',
      email: 'pierre.bernard@example.com',
      address: '789 Boulevard Haussmann, 75009 Paris',
      userId: clientUser3.id,
    },
  })

  console.log('✅ Seed completed!')
  console.log('👤 Admin:', admin.email, '/ password: admin123')
  console.log('👤 Pro:', pro.email, '/ password: pro123')
  console.log('👥 Clients:')
  console.log('   -', clientUser1.email, '/ password: client1')
  console.log('   -', clientUser2.email, '/ password: client2')
  console.log('   -', clientUser3.email, '/ password: client3')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
