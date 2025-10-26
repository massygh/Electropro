import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: "Non authentifie" },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const jobId = parseInt(resolvedParams.id)
    const { status } = await req.json()

    // Mettre a jour le statut
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status },
      include: {
        assignedTo: {
          select: { name: true }
        }
      }
    })

    // Creer une notification pour l'admin si c'est un PRO qui change le statut
    if (session.user.role === 'PRO') {
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true }
      })

      const statusText = status === 'done' ? 'terminé' : status === 'in_progress' ? 'en cours' : 'annulé'
      const message = `${session.user.name} a marqué l'intervention "${updatedJob.title}" comme ${statusText}`

      for (const admin of adminUsers) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            message,
            type: 'JOB_STATUS_CHANGE',
            read: false
          }
        })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Update job status error:', error)
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour du statut" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
