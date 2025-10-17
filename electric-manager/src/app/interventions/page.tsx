import JobForm from '@/components/JobForm'
import InterventionsList from './InterventionsList'
import NewInterventionButton from './NewInterventionButton'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InterventionsPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })
  const jobs = await prisma.job.findMany({ orderBy: { scheduledAt: 'asc' }, include: { client: true } })
  return (
    <div className="w-full mx-auto p-17 space-y-17">
      <div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-semibold text-black dark:text-white tracking-tight">Interventions</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">Planifiez et suivez vos interventions.</p>
          </div>
          <NewInterventionButton clients={clients as any} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 items-start">
        <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-10 shadow-sm">
          <InterventionsList jobs={jobs as any} clients={clients as any} />
        </div>
      </div>
    </div>
  )
}


