import ProjectForm from '@/components/ProjectForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ChantiersPage() {
  const projects = await prisma.project.findMany({
    include: {
      client: true,
      assignedTo: true
    },
    orderBy: { createdAt: 'desc' }
  })

  const clients = await prisma.client.findMany({ orderBy: { name: 'asc' } })
  const users = await prisma.user.findMany({ orderBy: { email: 'asc' } })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
      case 'in_progress': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
      case 'completed': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned': return 'Planifié'
      case 'in_progress': return 'En cours'
      case 'completed': return 'Terminé'
      case 'cancelled': return 'Annulé'
      default: return status
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-300 dark:to-gray-400 rounded-full shadow-lg shadow-indigo-500/50 dark:shadow-none animate-gradient" />
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight">
              Chantiers
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm ml-5">Gérez vos chantiers en cours et à venir</p>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border-2 border-blue-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-4">
          <div className="text-sm font-medium text-blue-700 dark:text-gray-400 mb-1">Planifiés</div>
          <div className="text-2xl font-bold text-black dark:text-white">
            {projects.filter(p => p.status === 'planned').length}
          </div>
        </div>
        <div className="rounded-xl border-2 border-emerald-200 dark:border-gray-700 bg-gradient-to-br from-emerald-50 to-white dark:from-gray-800 dark:to-gray-900 p-4">
          <div className="text-sm font-medium text-emerald-700 dark:text-gray-400 mb-1">En cours</div>
          <div className="text-2xl font-bold text-black dark:text-white">
            {projects.filter(p => p.status === 'in_progress').length}
          </div>
        </div>
        <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Terminés</div>
          <div className="text-2xl font-bold text-black dark:text-white">
            {projects.filter(p => p.status === 'completed').length}
          </div>
        </div>
        <div className="rounded-xl border-2 border-indigo-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 p-4">
          <div className="text-sm font-medium text-indigo-700 dark:text-gray-400 mb-1">Total</div>
          <div className="text-2xl font-bold text-black dark:text-white">
            {projects.length}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Formulaire */}
        <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm lg:col-span-1">
          <ProjectForm clients={clients as any} users={users as any} />
        </div>

        {/* Liste des chantiers */}
        <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm lg:col-span-2">
          <div className="font-medium text-black dark:text-white mb-3">Liste des chantiers</div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex p-4 rounded-full bg-neutral-50 dark:bg-gray-700 mb-3">
                <svg className="w-8 h-8 text-neutral-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Aucun chantier pour le moment</p>
            </div>
          )}

          <div className="space-y-4">
            {projects.map(project => (
              <div
                key={project.id}
                className="group rounded-xl border border-neutral-200 dark:border-gray-700 bg-gradient-to-br from-white to-neutral-50/50 dark:from-gray-800 dark:to-gray-900 p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-black dark:text-white text-lg">{project.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Client:</span> {project.client.name}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{project.address}</span>
                      </div>
                      {project.assignedTo && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Employé:</span> {project.assignedTo.name || project.assignedTo.email}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Début:</span> {new Date(project.startDate).toLocaleDateString('fr-FR')}
                        <span className="mx-1">→</span>
                        <span className="font-medium">Fin prévue:</span> {new Date(project.estimatedEndDate).toLocaleDateString('fr-FR')}
                      </div>
                      {project.budget && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">Budget:</span> {project.budget.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {project.description && (
                  <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">{project.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
