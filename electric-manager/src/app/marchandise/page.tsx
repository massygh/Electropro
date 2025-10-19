import ProductForm from '@/components/ProductForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MarchandisePage() {
  const products = await prisma.product.findMany({ orderBy: { id: 'desc' } })
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-300 dark:to-gray-400 rounded-full shadow-lg shadow-indigo-500/50 dark:shadow-none animate-gradient" />
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight">Marchandise</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm ml-5">Gérez vos produits et le stock.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm lg:col-span-1">
          <ProductForm />
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm lg:col-span-2">
          <div className="font-medium text-black dark:text-white mb-3">Inventaire</div>
          <ul className="divide-y divide-neutral-200 dark:divide-gray-700">
            {products.length === 0 && <li className="py-2 text-gray-600 dark:text-gray-400">Aucun produit</li>}
            {products.map(p => (
              <li key={p.id} className="py-3">
                <div className="font-medium text-black dark:text-white">{p.name} <span className="text-gray-600 dark:text-gray-400">({p.sku})</span></div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Qté: {p.quantity} · Achat: {p.costPrice}€ · Vente: {p.salePrice}€</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


