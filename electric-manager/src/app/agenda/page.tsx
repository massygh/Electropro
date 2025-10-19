import Calendar from '@/components/Calendar'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AgendaPage() {
  let events: { id: number; title: string; start: string }[] = []
  try {
    const jobs = await prisma.job.findMany()
    events = jobs
      .map((j: any) => ({ id: j.id, title: j.title, start: j.scheduledAt ? new Date(j.scheduledAt).toISOString() : undefined }))
      .filter((e: any) => Boolean(e.start))
  } catch {}
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-300 dark:to-gray-400 rounded-full shadow-lg shadow-indigo-500/50 dark:shadow-none animate-gradient" />
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight">Agenda</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm ml-5">Visualisez vos interventions planifiées</p>
        </div>
      </div>
      <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm">
        <div className="h-[520px] overflow-hidden rounded-xl">
          <Calendar events={events} />
        </div>
      </div>
    </div>
  )
}


