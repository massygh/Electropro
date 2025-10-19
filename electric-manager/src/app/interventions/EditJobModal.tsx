'use client'

import { useState } from 'react'

type Job = {
  id: number
  title: string
  description?: string | null
  address?: string | null
  scheduledAt?: string
  assignedToId?: number | null
  client?: { id: number; name: string } | null
}
type Client = { id: number; name: string }
type User = { id: number; name?: string | null; email: string }

export default function EditJobModal({
  job,
  clients,
  users,
  onClose
}: {
  job: Job
  clients: Client[]
  users?: User[]
  onClose: () => void
}) {
  const addressLines = job.address ? job.address.split('\n') : []
  const initialAddress = addressLines[0] || ''
  const initialAddressDetails = addressLines.slice(1).join('\n')

  const scheduledDate = job.scheduledAt ? new Date(job.scheduledAt) : new Date()
  const initialDate = scheduledDate.toISOString().split('T')[0]
  const initialTime = scheduledDate.toTimeString().slice(0, 5)

  const [title, setTitle] = useState(job.title)
  const [clientId, setClientId] = useState<number | ''>(job.client?.id || '')
  const [date, setDate] = useState(initialDate)
  const [time, setTime] = useState(initialTime)
  const [description, setDescription] = useState(job.description || '')
  const [address, setAddress] = useState(initialAddress)
  const [addressDetails, setAddressDetails] = useState(initialAddressDetails)
  const [assignedToId, setAssignedToId] = useState<number | ''>(job.assignedToId || '')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !clientId || !date) return
    setLoading(true)
    try {
      const iso = time ? new Date(`${date}T${time}:00`).toISOString() : new Date(`${date}T09:00:00`).toISOString()

      const fullAddress = addressDetails
        ? `${address}\n${addressDetails}`
        : address

      const res = await fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: job.id,
          title: title.trim(),
          clientId: Number(clientId),
          scheduledAt: iso,
          description: description.trim() || null,
          address: fullAddress.trim() || null,
          assignedToId: assignedToId || null
        })
      })
      if (!res.ok) throw new Error('fail')

      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-neutral-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div className="text-xl font-semibold text-black dark:text-white">Modifier l'intervention</div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-gray-600 hover:bg-neutral-50 dark:hover:bg-gray-700 text-black dark:text-white transition"
          >
            Fermer
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
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

          {/* Boutons submit */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-neutral-300 dark:border-gray-600 text-black dark:text-white font-medium hover:bg-neutral-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-700 dark:to-gray-800 text-white font-medium hover:from-indigo-700 hover:to-purple-700 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? 'Modification...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
