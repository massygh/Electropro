'use client'

import { useEffect, useMemo, useState } from 'react'
import Calendar from '@/components/Calendar'

type EventItem = { id: number; title: string; start: string }

type Client = { id: number; name: string }

type UpcomingItem = { id: number; title: string; start: string }

export default function DashboardView({ events, totalEvents, upcoming7d }: { events: EventItem[]; totalEvents: number; upcoming7d: number }) {
  const [showAgenda, setShowAgenda] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [creatingClient, setCreatingClient] = useState(false)
  const [creatingJob, setCreatingJob] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')

  const [jobTitle, setJobTitle] = useState('')
  const [jobClientId, setJobClientId] = useState<number | ''>('')
  const [jobDate, setJobDate] = useState('')
  const [jobTime, setJobTime] = useState('')

  const upcomingText = useMemo(() => `${upcoming7d} dans les 7 jours`, [upcoming7d])

  const upcomingItems: UpcomingItem[] = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5)
  }, [events])

  async function refreshClients() {
    try {
      setLoadingClients(true)
      const res = await fetch('/api/clients')
      if (!res.ok) throw new Error('failed')
      const data: Client[] = await res.json()
      setClients(data)
    } catch {
      // noop
    } finally {
      setLoadingClients(false)
    }
  }

  useEffect(() => {
    refreshClients()
  }, [])

  async function submitCreateClient(e: React.FormEvent) {
    e.preventDefault()
    if (!clientName.trim()) return
    setCreatingClient(true)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clientName.trim(), phone: clientPhone || null, email: clientEmail || null }),
      })
      if (!res.ok) throw new Error('create client failed')
      setClientName('')
      setClientPhone('')
      setClientEmail('')
      await refreshClients()
    } finally {
      setCreatingClient(false)
    }
  }

  async function submitCreateJob(e: React.FormEvent) {
    e.preventDefault()
    if (!jobTitle.trim() || !jobClientId || !jobDate) return
    const iso = jobTime ? new Date(`${jobDate}T${jobTime}:00`).toISOString() : new Date(`${jobDate}T09:00:00`).toISOString()
    setCreatingJob(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: jobTitle.trim(), clientId: Number(jobClientId), scheduledAt: iso }),
      })
      if (!res.ok) throw new Error('create job failed')
      setJobTitle('')
      setJobClientId('')
      setJobDate('')
      setJobTime('')
      window.location.reload()
    } finally {
      setCreatingJob(false)
    }
  }

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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-black tracking-tight">Tableau de bord</h1>
          <p className="text-black/60 mt-1">Gérez vos clients et interventions simplement.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAgenda((v) => !v)} className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 transition">
            {showAgenda ? 'Masquer agenda' : 'Afficher agenda'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-black/70">Interventions planifiées</div>
          <div className="text-4xl font-bold mt-1 text-black">{totalEvents}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-black/70">Sur les 7 prochains jours</div>
          <div className="text-4xl font-bold mt-1 text-black">{upcoming7d}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-black/70">Taux d'occupation</div>
          <div className="text-4xl font-bold mt-1 text-black">{Math.min(100, Math.round((upcoming7d / Math.max(1, totalEvents)) * 100))}%</div>
          <div className="text-xs text-black/50">{upcomingText}</div>
        </div>
      </div>

      {/* Services */}
      <div>
        <div className="mb-3 text-black font-medium">Services</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/clients" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow transition">
            <div className="text-lg font-medium text-black">Clients</div>
            <div className="text-black/60 text-sm mt-1">Gérer vos clients</div>
          </a>
          <a href="/agenda" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow transition">
            <div className="text-lg font-medium text-black">Agenda</div>
            <div className="text-black/60 text-sm mt-1">Calendrier des interventions</div>
          </a>
          <a href="/interventions" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow transition">
            <div className="text-lg font-medium text-black">Planifier interventions</div>
            <div className="text-black/60 text-sm mt-1">Créer et suivre</div>
          </a>
          <a href="/employes" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow transition">
            <div className="text-lg font-medium text-black">Employés</div>
            <div className="text-black/60 text-sm mt-1">Équipe et rôles</div>
          </a>
          <a href="/marchandise" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow transition">
            <div className="text-lg font-medium text-black">Marchandise</div>
            <div className="text-black/60 text-sm mt-1">Produits & stock</div>
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upcoming + Agenda */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-black">À venir</div>
            </div>
            <ul className="divide-y">
              {upcomingItems.length === 0 && <li className="py-2 text-black/70">Aucune intervention</li>}
              {upcomingItems.map(item => (
                <li key={item.id} className="py-3 flex items-center justify-between">
                  <div className="text-black">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-black/70">{new Date(item.start).toLocaleString()}</div>
                  </div>
                  <button onClick={() => deleteJob(item.id)} disabled={deletingId === item.id} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50">
                    {deletingId === item.id ? 'Suppression...' : 'Supprimer'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {showAgenda && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
              <div className="h-[420px] overflow-hidden rounded-xl">
                <Calendar events={events} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


