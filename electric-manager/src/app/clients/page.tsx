import ClientForm from '@/components/ClientForm'
import { prisma } from '@/lib/prisma'
import DeleteClientButton from './DeleteClientButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-black dark:text-white">Clients</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Ajoutez et gérez vos clients.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm lg:col-span-1">
          <ClientForm />
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm lg:col-span-2">
          <div className="font-medium text-black dark:text-white mb-3">Liste</div>
          <ul className="divide-y divide-neutral-200 dark:divide-gray-700">
            {clients.length === 0 && <li className="py-2 text-gray-600 dark:text-gray-400">Aucun client</li>}
            {clients.map(c => (
              <li key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-black dark:text-white">{c.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{c.email || '—'} · {c.phone || '—'}</div>
                </div>
                <form action={`/api/clients?id=${c.id}`} method="post" className="hidden" />
                <DeleteClientButton id={c.id} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


