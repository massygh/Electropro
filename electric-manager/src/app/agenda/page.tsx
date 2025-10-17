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
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-semibold text-black dark:text-white">Agenda</h1>
      <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm">
        <div className="h-[520px] overflow-hidden rounded-xl">
          <Calendar events={events} />
        </div>
      </div>
    </div>
  )
}


