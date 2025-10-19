import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await auth()

    if (!session || session.user.accountType !== 'ADMIN') {
      return NextResponse.json(
        { error: "Non autorise" },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        accountType: true,
        createdAt: true,
        emailVerified: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des utilisateurs" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session || session.user.accountType !== 'ADMIN') {
      return NextResponse.json(
        { error: "Non autorise" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, email, phone, password, accountType } = body

    if (!email || !password || !accountType) {
      return NextResponse.json(
        { error: "Email, mot de passe et type de compte sont requis" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur existe deja avec cet email" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        accountType,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        accountType: true,
        createdAt: true,
      }
    })

    return NextResponse.json(user, { status: 201 })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: "Erreur lors de la creation de l'utilisateur" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
