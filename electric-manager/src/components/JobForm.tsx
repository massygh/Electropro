'use client'

import { useState } from 'react'

type Client = { id: number; name: string }

export default function JobForm({ clients }: { clients: Client[] }) {
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState<number | ''>('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !clientId || !date) return
    setLoading(true)
    try {
      const iso = time ? new Date(`${date}T${time}:00`).toISOString() : new Date(`${date}T09:00:00`).toISOString()
      const res = await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: title.trim(), clientId: Number(clientId), scheduledAt: iso }) })
      if (!res.ok) throw new Error('fail')
      setTitle(''); setClientId(''); setDate(''); setTime('')
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="font-medium text-black">Planifier une intervention</div>
      <input className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Titre" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select className="w-full border rounded-lg px-3 py-2 text-black" value={clientId} onChange={(e)=>setClientId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">Sélectionner un client</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" className="w-full border rounded-lg px-3 py-2 text-black" value={date} onChange={(e)=>setDate(e.target.value)} />
        <input type="time" className="w-full border rounded-lg px-3 py-2 text-black" value={time} onChange={(e)=>setTime(e.target.value)} />
      </div>
      <button disabled={loading} className="w-full px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 transition disabled:opacity-50">{loading ? 'Planification...' : 'Planifier'}</button>
    </form>
  )
}


