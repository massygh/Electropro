import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user.accountType !== 'ADMIN') {
      return NextResponse.json(
        { error: "Non autorise" },
        { status: 403 }
      )
    }

    const userId = parseInt(params.id)
    const body = await req.json()
    const { name, email, phone, password, accountType } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (accountType !== undefined) updateData.accountType = accountType
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        accountType: true,
        createdAt: true,
      }
    })

    return NextResponse.json(user)

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de l'utilisateur" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session || session.user.accountType !== 'ADMIN') {
      return NextResponse.json(
        { error: "Non autorise" },
        { status: 403 }
      )
    }

    const userId = parseInt(params.id)

    if (session.user.id === userId.toString()) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte" },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: "Utilisateur supprime avec succes" })

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
