'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type EventItem = { id: number; title: string; start: string }

type UpcomingItem = { id: number; title: string; start: string }

export default function DashboardView({ events, totalEvents, upcoming7d }: { events: EventItem[]; totalEvents: number; upcoming7d: number }) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const upcomingText = useMemo(() => `${upcoming7d} dans les 7 jours`, [upcoming7d])

  const upcomingItems: UpcomingItem[] = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5)
  }, [events])

  async function deleteJob(id: number) {
    if (!confirm('Supprimer cette intervention ?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete failed')
      window.location.reload()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header avec gradient animé */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-300 dark:to-gray-400 rounded-full shadow-lg shadow-indigo-500/50 dark:shadow-none animate-gradient" />
            <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
              Tableau de bord
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-base ml-5">Bienvenue sur votre espace de gestion Electropro</p>
        </div>
        <div className="flex gap-3 ml-5 sm:ml-0">
          <Link
            href="/interventions"
            className="group px-5 py-2.5 rounded-xl border-2 border-indigo-200 dark:border-gray-700 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-800 text-gray-900 dark:text-white font-medium hover:border-indigo-400 dark:hover:border-gray-600 hover:shadow-lg hover:shadow-indigo-200/50 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300 shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle intervention
          </Link>
          <Link
            href="/clients"
            className="group px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-700 dark:to-gray-800 text-white font-medium hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 dark:hover:from-gray-600 dark:hover:to-gray-700 hover:shadow-lg hover:shadow-purple-500/50 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center gap-2 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 dark:via-white/0 animate-shimmer" />
            <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau client
          </Link>
        </div>
      </div>

      {/* KPIs améliorés avec icônes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Interventions planifiées */}
        <div className="group relative rounded-2xl border-2 border-indigo-200 dark:border-gray-700 bg-gradient-to-br from-indigo-100 via-purple-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 p-6 shadow-lg shadow-indigo-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-300/60 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-400/30 via-purple-400/20 dark:from-gray-700/20 to-transparent rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 group-hover:rotate-45 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 dark:from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-700 dark:to-gray-700 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-indigo-500/30 dark:shadow-none">
                <svg className="w-6 h-6 text-white dark:text-gray-300 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-gray-700 dark:to-gray-700 text-white dark:text-gray-300 text-xs font-bold shadow-md">Total</div>
            </div>
            <div className="text-sm font-semibold text-indigo-700 dark:text-gray-400 mb-1">Interventions planifiées</div>
            <div className="text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-white dark:to-white bg-clip-text text-transparent mb-2">{totalEvents}</div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-2.5 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:bg-gray-700 overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-500 dark:to-gray-600 rounded-full w-full animate-gradient" />
              </div>
            </div>
          </div>
        </div>

        {/* Sur 7 jours */}
        <div className="group relative rounded-2xl border-2 border-emerald-200 dark:border-gray-700 bg-gradient-to-br from-emerald-100 via-teal-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 p-6 shadow-lg shadow-emerald-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-emerald-300/60 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/30 via-teal-400/20 dark:from-gray-700/20 to-transparent rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 group-hover:rotate-45 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 dark:from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-gray-700 dark:to-gray-700 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-emerald-500/30 dark:shadow-none">
                <svg className="w-6 h-6 text-white dark:text-gray-300 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-gray-700 dark:to-gray-700 text-white dark:text-gray-300 text-xs font-bold shadow-md">7 jours</div>
            </div>
            <div className="text-sm font-semibold text-emerald-700 dark:text-gray-400 mb-1">Prochaines interventions</div>
            <div className="text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-white dark:to-white bg-clip-text text-transparent mb-2">{upcoming7d}</div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-2.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:bg-gray-700 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 dark:from-gray-500 dark:to-gray-600 rounded-full transition-all duration-500 animate-gradient"
                  style={{ width: `${Math.min(100, (upcoming7d / Math.max(1, totalEvents)) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-gray-400">{Math.min(100, Math.round((upcoming7d / Math.max(1, totalEvents)) * 100))}%</span>
            </div>
          </div>
        </div>

        {/* Taux d'occupation */}
        <div className="group relative rounded-2xl border-2 border-amber-200 dark:border-gray-700 bg-gradient-to-br from-amber-100 via-orange-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 p-6 shadow-lg shadow-amber-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-amber-300/60 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/30 via-orange-400/20 dark:from-gray-700/20 to-transparent rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 group-hover:rotate-45 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 dark:from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 dark:from-gray-700 dark:to-gray-700 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-amber-500/30 dark:shadow-none">
                <svg className="w-6 h-6 text-white dark:text-gray-300 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 dark:from-gray-700 dark:to-gray-700 text-white dark:text-gray-300 text-xs font-bold shadow-md">Activité</div>
            </div>
            <div className="text-sm font-semibold text-amber-700 dark:text-gray-400 mb-1">Taux d'occupation</div>
            <div className="text-6xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 dark:from-white dark:to-white bg-clip-text text-transparent mb-2">{Math.min(100, Math.round((upcoming7d / Math.max(1, totalEvents)) * 100))}%</div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-2.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:bg-gray-700 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 dark:from-gray-500 dark:to-gray-600 rounded-full transition-all duration-500 animate-gradient"
                  style={{ width: `${Math.min(100, Math.round((upcoming7d / Math.max(1, totalEvents)) * 100))}%` }}
                />
              </div>
              <span className="text-xs font-medium text-amber-700 dark:text-gray-400">{upcomingText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accès rapides améliorés */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-black dark:text-white">Accès rapides</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-neutral-200 dark:from-gray-700 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link href="/clients" className="group relative rounded-2xl border border-indigo-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg hover:border-indigo-300 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 dark:from-gray-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-gray-700 group-hover:bg-indigo-200 dark:group-hover:bg-gray-600 transition-colors">
                <svg className="w-5 h-5 text-indigo-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-gray-200 transition-colors">Clients</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">Gérer vos clients</div>
              </div>
            </div>
          </Link>

          <Link href="/agenda" className="group relative rounded-2xl border border-violet-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg hover:border-violet-300 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 dark:from-gray-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-gray-700 group-hover:bg-violet-200 dark:group-hover:bg-gray-600 transition-colors">
                <svg className="w-5 h-5 text-violet-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-gray-200 transition-colors">Agenda</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">Planning complet</div>
              </div>
            </div>
          </Link>

          <Link href="/interventions" className="group relative rounded-2xl border border-emerald-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg hover:border-emerald-300 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 dark:from-gray-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-gray-700 group-hover:bg-emerald-200 dark:group-hover:bg-gray-600 transition-colors">
                <svg className="w-5 h-5 text-emerald-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-gray-200 transition-colors">Interventions</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">Créer et suivre</div>
              </div>
            </div>
          </Link>

          <Link href="/employes" className="group relative rounded-2xl border border-sky-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg hover:border-sky-300 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 dark:from-gray-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-gray-700 group-hover:bg-sky-200 dark:group-hover:bg-gray-600 transition-colors">
                <svg className="w-5 h-5 text-sky-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-gray-200 transition-colors">Employés</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">Équipe et rôles</div>
              </div>
            </div>
          </Link>

          <Link href="/marchandise" className="group relative rounded-2xl border border-amber-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg hover:border-amber-300 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 dark:from-gray-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-gray-700 group-hover:bg-amber-200 dark:group-hover:bg-gray-600 transition-colors">
                <svg className="w-5 h-5 text-amber-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-gray-200 transition-colors">Marchandise</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">Stock et produits</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Section Vue d'ensemble */}
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-black dark:text-white">Vue d'ensemble</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-neutral-200 dark:from-gray-700 to-transparent" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interventions à venir */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-gray-800 px-6 py-4 border-b border-neutral-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                    <svg className="w-5 h-5 text-indigo-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Interventions à venir</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-gray-300 text-sm font-semibold">
                  {upcomingItems.length} intervention{upcomingItems.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-gray-700">
              {upcomingItems.length === 0 && (
                <div className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-full bg-neutral-50 dark:bg-gray-800 mb-3">
                    <svg className="w-8 h-8 text-neutral-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Aucune intervention planifiée</p>
                </div>
              )}
              {upcomingItems.map(item => (
                <div key={item.id} className="group p-5 hover:bg-neutral-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="rounded-2xl border-2 border-indigo-100 dark:border-gray-600 bg-gradient-to-br from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 px-4 py-3 text-center min-w-[90px] group-hover:border-indigo-300 dark:group-hover:border-gray-500 transition-colors">
                        <div className="text-xs font-medium text-indigo-600 dark:text-gray-300 uppercase tracking-wide leading-none mb-1">
                          {new Date(item.start).toLocaleDateString('fr-FR', { weekday: 'short' })}
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1">
                          {new Date(item.start).toLocaleDateString('fr-FR', { day: '2-digit' })}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 leading-none">
                          {new Date(item.start).toLocaleDateString('fr-FR', { month: 'short' })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white text-base mb-1">{item.title}</div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(item.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            ID: #{item.id}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteJob(item.id)}
                      disabled={deletingId === item.id}
                      className="px-4 py-2 rounded-xl border-2 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {deletingId === item.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
