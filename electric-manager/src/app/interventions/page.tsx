import JobForm from '@/components/JobForm'
import InterventionsList from './InterventionsList'
import NewInterventionButton from './NewInterventionButton'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InterventionsPage() {
  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })
  const users = await prisma.user.findMany({ orderBy: { email: 'asc' } })
  const jobs = await prisma.job.findMany({ orderBy: { scheduledAt: 'asc' }, include: { client: true, assignedTo: true } })

  // Statistiques
  const totalInterventions = jobs.length
  const planned = jobs.filter(j => j.status === 'scheduled').length
  const done = jobs.filter(j => j.status === 'done').length
  const cancelled = jobs.filter(j => j.status === 'cancelled').length

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header avec gradient animé */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-300 dark:to-gray-400 rounded-full shadow-lg shadow-indigo-500/50 dark:shadow-none animate-gradient" />
              <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight">
                Interventions
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm ml-5">Planifiez et suivez vos interventions</p>
          </div>
          <NewInterventionButton clients={clients as any} users={users as any} />
        </div>

        {/* Statistiques KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Total */}
          <div className="group relative rounded-xl border-2 border-indigo-200 dark:border-gray-700 bg-gradient-to-br from-indigo-100 via-purple-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 p-4 shadow-lg shadow-indigo-200/50 dark:shadow-none hover:shadow-xl hover:shadow-indigo-300/60 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/30 via-purple-400/20 dark:from-gray-700/20 to-transparent rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 group-hover:rotate-45 transition-all duration-700" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-700 dark:to-gray-700 group-hover:scale-110 transition-all duration-300 shadow-md shadow-indigo-500/30 dark:shadow-none">
                  <svg className="w-5 h-5 text-white dark:text-gray-300 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="text-xs font-semibold text-indigo-700 dark:text-gray-400 mb-1">Total</div>
              <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-white dark:to-white bg-clip-text text-transparent">{totalInterventions}</div>
            </div>
          </div>

          {/* Planifiées */}
          <div className="group relative rounded-xl border-2 border-blue-200 dark:border-gray-700 bg-gradient-to-br from-blue-100 via-cyan-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 p-4 shadow-lg shadow-blue-200/50 dark:shadow-none hover:shadow-xl hover:shadow-blue-300/60 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 via-cyan-400/20 dark:from-gray-700/20 to-transparent rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 group-hover:rotate-45 transition-all duration-700" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-gray-700 dark:to-gray-700 group-hover:scale-110 transition-all duration-300 shadow-md shadow-blue-500/30 dark:shadow-none">
                  <svg className="w-5 h-5 text-white dark:text-gray-300 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-xs font-semibold text-blue-700 dark:text-gray-400 mb-1">Planifiées</div>
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 dark:from-white dark:to-white bg-clip-text text-transparent">{planned}</div>
            </div>
          </div>

          {/* Terminées */}
          <div className="group relative rounded-xl border-2 border-emerald-200 dark:border-gray-700 bg-gradient-to-br from-emerald-100 via-teal-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 p-4 shadow-lg shadow-emerald-200/50 dark:shadow-none hover:shadow-xl hover:shadow-emerald-300/60 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/30 via-teal-400/20 dark:from-gray-700/20 to-transparent rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 group-hover:rotate-45 transition-all duration-700" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-gray-700 dark:to-gray-700 group-hover:scale-110 transition-all duration-300 shadow-md shadow-emerald-500/30 dark:shadow-none">
                  <svg className="w-5 h-5 text-white dark:text-gray-300 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-xs font-semibold text-emerald-700 dark:text-gray-400 mb-1">Terminées</div>
              <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-white dark:to-white bg-clip-text text-transparent">{done}</div>
            </div>
          </div>

          {/* Annulées */}
          <div className="group relative rounded-xl border-2 border-red-200 dark:border-gray-700 bg-gradient-to-br from-red-100 via-rose-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 p-4 shadow-lg shadow-red-200/50 dark:shadow-none hover:shadow-xl hover:shadow-red-300/60 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/30 via-rose-400/20 dark:from-gray-700/20 to-transparent rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 group-hover:rotate-45 transition-all duration-700" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 dark:from-gray-700 dark:to-gray-700 group-hover:scale-110 transition-all duration-300 shadow-md shadow-red-500/30 dark:shadow-none">
                  <svg className="w-5 h-5 text-white dark:text-gray-300 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-xs font-semibold text-red-700 dark:text-gray-400 mb-1">Annulées</div>
              <div className="text-3xl font-black bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 dark:from-white dark:to-white bg-clip-text text-transparent">{cancelled}</div>
            </div>
          </div>
        </div>

        {/* Liste des interventions */}
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-black dark:text-white">Liste des interventions</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-neutral-200 dark:from-gray-700 to-transparent" />
        </div>

        <InterventionsList jobs={jobs as any} clients={clients as any} users={users as any} />
      </div>
    </div>
  )
}


