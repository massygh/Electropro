'use client'

import { useState } from 'react'

type Client = { id: number; name: string }
type User = { id: number; name?: string | null; email: string }

export default function ProjectForm({ clients, users }: { clients: Client[]; users: User[] }) {
  const [name, setName] = useState('')
  const [clientId, setClientId] = useState<number | ''>('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [estimatedEndDate, setEstimatedEndDate] = useState('')
  const [assignedToId, setAssignedToId] = useState<number | ''>('')
  const [budget, setBudget] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !clientId || !address.trim() || !startDate || !estimatedEndDate) return
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          clientId,
          address: address.trim(),
          description: description || null,
          startDate,
          estimatedEndDate,
          assignedToId: assignedToId || null,
          budget: budget || null,
          status: 'planned'
        })
      })
      if (!res.ok) throw new Error('fail')
      setName('')
      setClientId('')
      setAddress('')
      setDescription('')
      setStartDate('')
      setEstimatedEndDate('')
      setAssignedToId('')
      setBudget('')
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="font-medium text-black dark:text-white mb-4">Nouveau chantier</div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du chantier *</label>
        <input
          className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700"
          placeholder="Ex: Rénovation électrique maison"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client *</label>
        <select
          className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700"
          value={clientId}
          onChange={(e) => setClientId(e.target.value ? Number(e.target.value) : '')}
          required
        >
          <option value="">Sélectionner un client</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Adresse *</label>
        <input
          className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700"
          placeholder="Adresse du chantier"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
        <textarea
          className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700 min-h-[80px]"
          placeholder="Description des travaux"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de début *</label>
          <input
            type="date"
            className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date fin prévue *</label>
          <input
            type="date"
            className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700"
            value={estimatedEndDate}
            onChange={(e) => setEstimatedEndDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employé assigné</label>
        <select
          className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700"
          value={assignedToId}
          onChange={(e) => setAssignedToId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">Non assigné</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name || u.email}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget (€)</label>
        <input
          type="number"
          step="0.01"
          className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2 text-black dark:text-white bg-white dark:bg-gray-700"
          placeholder="Budget estimé"
          value={budget}
          onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
        />
      </div>

      <button
        disabled={loading}
        className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-700 dark:to-gray-800 text-white font-medium hover:from-indigo-700 hover:to-purple-700 dark:hover:from-gray-600 dark:hover:to-gray-700 transition disabled:opacity-50"
      >
        {loading ? 'Création...' : 'Créer le chantier'}
      </button>
    </form>
  )
}
