'use client'

import { useState } from 'react'

export default function ClientForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone: phone || null, email: email || null, address: address || null }) })
      if (!res.ok) throw new Error('fail')
      setName(''); setPhone(''); setEmail(''); setAddress('')
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="font-medium text-black">Nouveau client</div>
      <input className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Nom" value={name} onChange={(e)=>setName(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Téléphone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Adresse" value={address} onChange={(e)=>setAddress(e.target.value)} />
      <button disabled={loading} className="w-full px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 transition disabled:opacity-50">{loading ? 'Création...' : 'Créer'}</button>
    </form>
  )
}


