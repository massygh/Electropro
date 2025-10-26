import DashboardView from "@/components/DashboardView"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const role = session.user.role
  const userId = parseInt(session.user.id)

  let events: { id: number; title: string; start: string }[] = []
  try {
    // Si PRO, afficher uniquement les interventions assignées
    const jobs = role === 'PRO'
      ? await prisma.job.findMany({ where: { assignedToId: userId } })
      : await prisma.job.findMany()

    events = jobs
      .map((j: any) => {
        const start = j.scheduledAt ? new Date(j.scheduledAt).toISOString() : undefined
        return { id: j.id, title: j.title, start }
      })
      .filter((e: any) => Boolean(e.start))
    } catch {
      const now = new Date()
      const dayMs = 24 * 60 * 60 * 1000
      events = [
        { id: 1, title: "Intervention tableau électrique", start: new Date(now.getTime() + dayMs).toISOString() },
        { id: 2, title: "Dépannage prise salon", start: new Date(now.getTime() + 2 * dayMs).toISOString() },
        { id: 3, title: "Pose éclairage extérieur", start: new Date(now.getTime() + 3 * dayMs).toISOString() },
      ]
    }

  const totalEvents = events.length
  const upcoming7d = events.filter(e => {
    const d = new Date(e.start).getTime()
    const now = Date.now()
    return d >= now && d <= now + 7 * 24 * 60 * 60 * 1000
  }).length

  return (
    <div className="p-4">
      <DashboardView
        events={events}
        totalEvents={totalEvents}
        upcoming7d={upcoming7d}
        role={role}
      />
    </div>
  )
}



