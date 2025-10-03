'use client'

import { useMemo, useState } from 'react'

type Job = { id: number; title: string; scheduledAt?: string; status?: string; assignedToId?: number | null; client?: { id: number; name: string } | null }
type Client = { id: number; name: string }
type User = { id: number; name?: string | null; email: string }

export default function InterventionsList({ jobs, clients }: { jobs: Job[]; clients: Client[] }) {
  const [q, setQ] = useState('')
  const [clientId, setClientId] = useState<number | ''>('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState<'date-asc' | 'date-desc' | 'title-asc' | 'title-desc'>('date-asc')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [bulk, setBulk] = useState<number[]>([])
  const [assignTo, setAssignTo] = useState<number | ''>('')

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
    await fetch('/api/jobs', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) })
    window.location.reload()
  }

  async function assignSelected() {
    if (!assignTo || bulk.length === 0) return
    for (const id of bulk) {
      await fetch('/api/jobs', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, assignedToId: Number(assignTo) }) })
    }
    window.location.reload()
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input className="w-full border rounded-xl px-4 py-3 text-black text-lg" placeholder="Recherche titre" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select className="w-full border rounded-xl px-4 py-3 text-black text-lg" value={clientId} onChange={(e)=>setClientId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">Tous les clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" className="w-full border rounded-xl px-4 py-3 text-black text-lg" value={date} onChange={(e)=>setDate(e.target.value)} />
        <select className="w-full border rounded-xl px-4 py-3 text-black text-lg" value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="">Tous statuts</option>
          <option value="scheduled">Planifiée</option>
          <option value="done">Terminée</option>
          <option value="cancelled">Annulée</option>
        </select>
        <select className="w-full border rounded-xl px-4 py-3 text-black text-lg" value={sort} onChange={(e)=>setSort(e.target.value as any)}>
          <option value="date-asc">Date ↑</option>
          <option value="date-desc">Date ↓</option>
          <option value="title-asc">Titre A→Z</option>
          <option value="title-desc">Titre Z→A</option>
        </select>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="font-medium text-black text-lg">Résultats ({filtered.length})</div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-lg">Exporter CSV</button>
            <button onClick={deleteSelected} className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-lg">Supprimer sélection</button>
            <select className="border rounded-xl px-4 py-2 text-black text-lg" value={assignTo} onChange={(e)=>setAssignTo(e.target.value ? Number(e.target.value) : '')}>
              <option value="">Assigner à...</option>
              {/* Future: populate with employees if available */}
              <option value="1">Employé #1</option>
              <option value="2">Employé #2</option>
            </select>
            <button onClick={assignSelected} className="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-lg">Assigner</button>
          </div>
        </div>
        <ul className="divide-y">
          {filtered.length === 0 && <li className="py-2 text-black/70">Aucune intervention</li>}
          {filtered.map(j => (
            <li key={j.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={bulk.includes(j.id)} onChange={() => toggleBulk(j.id)} />
                <div className="text-black">
                  <div className="font-medium text-lg">{j.title}</div>
                  <div className="text-base text-black/70">{j.client?.name || '—'} · {j.scheduledAt ? new Date(j.scheduledAt).toLocaleString() : '—'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select className="border rounded-xl px-3 py-2 text-black text-lg" value={j.status || 'scheduled'} onChange={(e)=>changeStatus(j.id, e.target.value)}>
                  <option value="scheduled">Planifiée</option>
                  <option value="done">Terminée</option>
                  <option value="cancelled">Annulée</option>
                </select>
                <button onClick={() => onDelete(j.id)} disabled={deletingId === j.id} className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 text-lg">
                  {deletingId === j.id ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


