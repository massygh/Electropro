import JobForm from '@/components/JobForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InterventionsPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })
  const jobs = await prisma.job.findMany({ orderBy: { scheduledAt: 'asc' }, include: { client: true } })
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-black">Interventions</h1>
        <p className="text-black/60 mt-2">Planifiez et suivez vos interventions.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm lg:col-span-1">
          <JobForm clients={clients as any} />
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="font-medium text-black mb-3">À venir</div>
          <ul className="divide-y">
            {jobs.length === 0 && <li className="py-2 text-black/70">Aucune intervention</li>}
            {jobs.map(j => (
              <li key={j.id} className="py-3">
                <div className="font-medium text-black">{j.title}</div>
                <div className="text-sm text-black/70">{j.client?.name || '—'} · {j.scheduledAt ? new Date(j.scheduledAt).toLocaleString() : '—'}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


