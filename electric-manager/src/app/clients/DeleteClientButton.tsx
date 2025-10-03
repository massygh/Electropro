'use client'

export default function DeleteClientButton({ id }: { id: number }) {
  async function onDelete() {
    if (!confirm('Supprimer ce client ?')) return
    const res = await fetch(`/api/clients?id=${id}`, { method: 'DELETE' })
    if (res.status === 409) {
      alert("Impossible: ce client a des interventions liées.")
      return
    }
    if (!res.ok) {
      alert('Suppression impossible')
      return
    }
    window.location.reload()
  }
  return <button onClick={onDelete} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50">Supprimer</button>
}


