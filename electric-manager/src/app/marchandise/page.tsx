import ProductForm from '@/components/ProductForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MarchandisePage() {
  const products = await prisma.product.findMany({ orderBy: { id: 'desc' } })
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-black">Marchandise</h1>
        <p className="text-black/60 mt-2">Gérez vos produits et le stock.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm lg:col-span-1">
          <ProductForm />
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="font-medium text-black mb-3">Inventaire</div>
          <ul className="divide-y">
            {products.length === 0 && <li className="py-2 text-black/70">Aucun produit</li>}
            {products.map(p => (
              <li key={p.id} className="py-3">
                <div className="font-medium text-black">{p.name} <span className="text-black/60">({p.sku})</span></div>
                <div className="text-sm text-black/70">Qté: {p.quantity} · Achat: {p.costPrice}€ · Vente: {p.salePrice}€</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


