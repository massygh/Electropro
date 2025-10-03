'use client'

import { useState } from 'react'

export default function UserForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('technicien')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !role.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name || null, email: email.trim(), role: role.trim(), password: password || null }) })
      if (!res.ok) throw new Error('fail')
      setName(''); setEmail(''); setRole('technicien'); setPassword('')
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="font-medium text-black">Ajouter un employé</div>
      <input className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Nom" value={name} onChange={(e)=>setName(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <select className="w-full border rounded-lg px-3 py-2 text-black" value={role} onChange={(e)=>setRole(e.target.value)}>
        <option value="technicien">Technicien</option>
        <option value="admin">Admin</option>
        <option value="commercial">Commercial</option>
      </select>
      <input type="password" className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Mot de passe (optionnel)" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button disabled={loading} className="w-full px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 transition disabled:opacity-50">{loading ? 'Ajout...' : 'Ajouter'}</button>
    </form>
  )
}


