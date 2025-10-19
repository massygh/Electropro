'use client'

import { useMemo, useState } from 'react'
import EditJobModal from './EditJobModal'

type Job = {
  id: number;
  title: string;
  description?: string | null;
  address?: string | null;
  scheduledAt?: string;
  status?: string;
  assignedToId?: number | null;
  assignedTo?: { id: number; name?: string | null; email: string } | null;
  client?: { id: number; name: string } | null;
}
type Client = { id: number; name: string }
type User = { id: number; name?: string | null; email: string }

export default function InterventionsList({ jobs, clients, users, isPro }: { jobs: Job[]; clients: Client[]; users?: User[]; isPro?: boolean }) {
  const [q, setQ] = useState('')
  const [clientId, setClientId] = useState<number | ''>('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState<'date-asc' | 'date-desc' | 'title-asc' | 'title-desc'>('date-asc')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [bulk, setBulk] = useState<number[]>([])
  const [assignTo, setAssignTo] = useState<number | ''>('')
  const [expandedIds, setExpandedIds] = useState<number[]>([])
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  function toggleExpand(id: number) {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const filtered = useMemo(() => {
    let out = jobs.filter(j => {
      if (q && !j.title.toLowerCase().includes(q.toLowerCase())) return false
      if (clientId && j.client?.id !== clientId) return false
      if (date) {
        const ds = j.scheduledAt ? new Date(j.scheduledAt) : null
        if (!ds) return false
        const dstr = ds.toISOString().slice(0,10)
        if (dstr !== date) return false
      }
      if (status && j.status !== status) return false
      return true
    })
    out.sort((a,b)=>{
      if (sort === 'title-asc') return a.title.localeCompare(b.title)
      if (sort === 'title-desc') return b.title.localeCompare(a.title)
      const da = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0
      const db = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0
      return sort === 'date-desc' ? db - da : da - db
    })
    return out
  }, [jobs, q, clientId, date, status, sort])

  async function onDelete(id: number) {
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

  function toggleBulk(id: number) {
    setBulk(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id])
  }

  async function deleteSelected() {
    if (bulk.length === 0) return
    if (!confirm(`Supprimer ${bulk.length} intervention(s) ?`)) return
    for (const id of bulk) {
      await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' })
    }
    window.location.reload()
  }

  async function changeStatus(id: number, newStatus: string) {
    try {
      const res = await fetch(`/api/jobs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error('update failed')
      window.location.reload()
    } catch (error) {
      alert('Erreur lors de la mise à jour du statut')
    }
  }

  async function assignSelected() {
    if (!assignTo || bulk.length === 0) return
    for (const id of bulk) {
      await fetch('/api/jobs', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, assignedToId: Number(assignTo) }) })
    }
    window.location.reload()
  }

  function getStatusBadge(status?: string) {
    switch (status) {
      case 'done':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
      case 'in_progress':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-700'
      case 'scheduled':
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
    }
  }

  function getStatusLabel(status?: string) {
    switch (status) {
      case 'done': return 'Terminée'
      case 'cancelled': return 'Annulée'
      case 'in_progress': return 'En cours'
      case 'scheduled':
      default: return 'Planifiée'
    }
  }

  function exportCSV() {
    const rows = [['ID','Titre','Client','Date','Statut']]
    filtered.forEach(j => rows.push([
      String(j.id), j.title, j.client?.name || '', j.scheduledAt ? new Date(j.scheduledAt).toLocaleString() : '', j.status || ''
    ]))
    const csv = rows.map(r => r.map(f => '"'+String(f).replace(/"/g,'""')+'"').join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'interventions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <input className="w-full border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-black dark:text-white text-sm" placeholder="Recherche titre" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select className="w-full border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-black dark:text-white text-sm" value={clientId} onChange={(e)=>setClientId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">Tous les clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" className="w-full border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-black dark:text-white text-sm" value={date} onChange={(e)=>setDate(e.target.value)} />
        <select className="w-full border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-black dark:text-white text-sm" value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="">Tous statuts</option>
          <option value="scheduled">Planifiée</option>
          <option value="in_progress">En cours</option>
          <option value="done">Terminée</option>
          <option value="cancelled">Annulée</option>
        </select>
        <select className="w-full border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-black dark:text-white text-sm" value={sort} onChange={(e)=>setSort(e.target.value as any)}>
          <option value="date-asc">Date ↑</option>
          <option value="date-desc">Date ↓</option>
          <option value="title-asc">Titre A→Z</option>
          <option value="title-desc">Titre Z→A</option>
        </select>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium text-black dark:text-white">Résultats ({filtered.length})</div>
          {!isPro && <button onClick={deleteSelected} className="px-3 py-1.5 rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium">Supprimer sélection</button>}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex p-4 rounded-full bg-neutral-50 dark:bg-gray-700 mb-3">
              <svg className="w-8 h-8 text-neutral-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Aucune intervention trouvée</p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map(j => {
            const addressLines = j.address ? j.address.split('\n') : []
            const mainAddress = addressLines[0] || ''
            const addressDetails = addressLines.slice(1).join('\n')
            const isExpanded = expandedIds.includes(j.id)

            return (
              <div
                key={j.id}
                className="group rounded-xl border-2 border-neutral-200 dark:border-gray-700 bg-gradient-to-br from-white to-neutral-50/50 dark:from-gray-800 dark:to-gray-900 overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                {/* Vue compacte - toujours visible */}
                <div
                  onClick={() => toggleExpand(j.id)}
                  className="p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {!isPro && <input
                      type="checkbox"
                      checked={bulk.includes(j.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        toggleBulk(j.id)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 w-5 h-5 rounded border-neutral-300 dark:border-gray-600"
                    />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-black dark:text-white truncate">{j.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(j.status)} flex-shrink-0`}>
                          {getStatusLabel(j.status)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {mainAddress && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{mainAddress}</span>
                          </div>
                        )}
                        {j.scheduledAt && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                              {new Date(j.scheduledAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                              {' à '}
                              {new Date(j.scheduledAt).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Détails étendus - visible au clic */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-neutral-200 dark:border-gray-700 pt-4">
                    {/* Détails de l'intervention */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Client */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <svg className="w-5 h-5 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Client</div>
                          <div className="text-base font-medium text-black dark:text-white">{j.client?.name || '—'}</div>
                        </div>
                      </div>

                      {/* Employé assigné */}
                      {j.assignedTo && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <svg className="w-5 h-5 text-green-700 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Employé assigné</div>
                            <div className="text-base font-medium text-black dark:text-white">
                              {j.assignedTo.name || j.assignedTo.email}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Adresse complète avec détails */}
                      {mainAddress && (
                        <div className="flex items-start gap-3 md:col-span-2">
                          <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <svg className="w-5 h-5 text-orange-700 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Adresse complète</div>
                            <div className="text-base font-medium text-black dark:text-white">{mainAddress}</div>
                            {addressDetails && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line">{addressDetails}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {j.description && (
                      <div className="p-3 rounded-lg bg-neutral-50 dark:bg-gray-700/50 border border-neutral-200 dark:border-gray-700">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description du travail</div>
                        <p className="text-base text-gray-900 dark:text-gray-100 whitespace-pre-line">{j.description}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-gray-700">
                      <select
                        className="border border-neutral-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-black dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-gray-500 transition"
                        value={j.status || 'scheduled'}
                        onChange={(e) => changeStatus(j.id, e.target.value)}
                      >
                        <option value="scheduled">Planifiée</option>
                        <option value="in_progress">En cours</option>
                        <option value="done">Terminée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                      {!isPro && (
                        <>
                          <button
                            onClick={() => setEditingJob(j)}
                            className="px-4 py-2 rounded-lg border-2 border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-medium transition text-sm"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => onDelete(j.id)}
                            disabled={deletingId === j.id}
                            className="px-4 py-2 rounded-lg border-2 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 font-medium transition text-sm"
                          >
                            {deletingId === j.id ? 'Suppression...' : 'Supprimer'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Modale d'édition */}
      {editingJob && (
        <EditJobModal
          job={editingJob}
          clients={clients}
          users={users}
          onClose={() => setEditingJob(null)}
        />
      )}
    </div>
  )
}


