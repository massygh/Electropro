import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Non autorise" },
        { status: 403 }
      )
    }

    const userId = parseInt(session.user.id)

    // Recuperer les notifications de l'admin
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20 // Limiter aux 20 dernieres
    })

    // Compter les notifications non lues
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        read: false
      }
    })

    return NextResponse.json({
      notifications,
      unreadCount
    })

  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des notifications" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Non autorise" },
        { status: 403 }
      )
    }

    const { notificationId } = await req.json()

    // Marquer comme lu
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Mark notification as read error:', error)
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
