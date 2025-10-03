'use client'

import { useState } from 'react'

export default function ProductForm() {
  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState<number | ''>('')
  const [costPrice, setCostPrice] = useState<number | ''>('')
  const [salePrice, setSalePrice] = useState<number | ''>('')
  const [lowStockThreshold, setLowStockThreshold] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!sku.trim() || !name.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sku: sku.trim(), name: name.trim(), quantity: Number(quantity || 0), costPrice: Number(costPrice || 0), salePrice: Number(salePrice || 0), lowStockThreshold: Number(lowStockThreshold || 5) }) })
      if (!res.ok) throw new Error('fail')
      setSku(''); setName(''); setQuantity(''); setCostPrice(''); setSalePrice(''); setLowStockThreshold('')
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="font-medium text-black">Ajouter un produit</div>
      <input className="w-full border rounded-lg px-3 py-2 text-black" placeholder="SKU" value={sku} onChange={(e)=>setSku(e.target.value)} />
      <input className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Nom" value={name} onChange={(e)=>setName(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input type="number" className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Quantité" value={quantity} onChange={(e)=>setQuantity(e.target.value === '' ? '' : Number(e.target.value))} />
        <input type="number" className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Prix achat" value={costPrice} onChange={(e)=>setCostPrice(e.target.value === '' ? '' : Number(e.target.value))} />
        <input type="number" className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Prix vente" value={salePrice} onChange={(e)=>setSalePrice(e.target.value === '' ? '' : Number(e.target.value))} />
      </div>
      <input type="number" className="w-full border rounded-lg px-3 py-2 text-black" placeholder="Seuil bas" value={lowStockThreshold} onChange={(e)=>setLowStockThreshold(e.target.value === '' ? '' : Number(e.target.value))} />
      <button disabled={loading} className="w-full px-4 py-2 rounded-lg bg-black text-white hover:opacity-90 transition disabled:opacity-50">{loading ? 'Ajout...' : 'Ajouter'}</button>
    </form>
  )
}


