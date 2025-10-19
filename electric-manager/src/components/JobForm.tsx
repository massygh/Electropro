'use client'

import { useState } from 'react'

type Client = { id: number; name: string }
type User = { id: number; name?: string | null; email: string }

export default function JobForm({ clients, users }: { clients: Client[]; users?: User[] }) {
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState<number | ''>('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetails, setAddressDetails] = useState('')
  const [assignedToId, setAssignedToId] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !clientId || !date) return
    setLoading(true)
    try {
      const iso = time ? new Date(`${date}T${time}:00`).toISOString() : new Date(`${date}T09:00:00`).toISOString()

      // Combine address with details
      const fullAddress = addressDetails
        ? `${address}\n${addressDetails}`
        : address

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          clientId: Number(clientId),
          scheduledAt: iso,
          description: description.trim() || null,
          address: fullAddress.trim() || null,
          assignedToId: assignedToId || null
        })
      })
      if (!res.ok) throw new Error('fail')

      // Reset form
      setTitle('')
      setClientId('')
      setDate('')
      setTime('')
      setDescription('')
      setAddress('')
      setAddressDetails('')
      setAssignedToId('')

      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="font-semibold text-black dark:text-white text-lg mb-4 pb-2 border-b border-neutral-200 dark:border-gray-700">
        Planifier une intervention
      </div>

      {/* Titre de l'intervention */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Titre de l'intervention <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-black dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-gray-500 focus:border-transparent transition"
          placeholder="Ex: Dépannage électrique urgent"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          required
        />
      </div>

      {/* Client */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Client <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-black dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-gray-500 focus:border-transparent transition"
          value={clientId}
          onChange={(e)=>setClientId(e.target.value ? Number(e.target.value) : '')}
          required
        >
          <option value="">Sélectionner un client</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Date et Heure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-black dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-gray-500 focus:border-transparent transition"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Heure
          </label>
          <input
            type="time"
            className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-black dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-gray-500 focus:border-transparent transition"
            value={time}
            onChange={(e)=>setTime(e.target.value)}
          />
        </div>
      </div>

      {/* Description du travail */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Description du travail à faire
        </label>
        <textarea
          className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-black dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-gray-500 focus:border-transparent transition min-h-[80px]"
          placeholder="Décrivez le travail à effectuer..."
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />
      </div>

      {/* Adresse de l'intervention */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Adresse de l'intervention
        </label>
        <input
          className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-black dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-gray-500 focus:border-transparent transition"
          placeholder="123 Rue de la République, 75001 Paris"
          value={address}
          onChange={(e)=>setAddress(e.target.value)}
        />
      </div>

      {/* Détails d'accès */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Détails d'accès (code porte, étage, etc.)
        </label>
        <input
          className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-black dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-gray-500 focus:border-transparent transition"
          placeholder="Code porte: 1234A, 3ème étage, porte droite"
          value={addressDetails}
          onChange={(e)=>setAddressDetails(e.target.value)}
        />
      </div>

      {/* Employé assigné */}
      {users && users.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Employé assigné
          </label>
          <select
            className="w-full border border-neutral-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-black dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-gray-500 focus:border-transparent transition"
            value={assignedToId}
            onChange={(e)=>setAssignedToId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Non assigné</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name || u.email}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Bouton submit */}
      <button
        disabled={loading}
        className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-700 dark:to-gray-800 text-white font-medium hover:from-indigo-700 hover:to-purple-700 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {loading ? 'Planification...' : 'Planifier l\'intervention'}
      </button>
    </form>
  )
}


