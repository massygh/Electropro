import UserForm from '@/components/UserForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EmployesPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-black dark:text-white">Employés</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Ajoutez et gérez les membres de l'équipe.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm lg:col-span-1">
          <UserForm />
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm lg:col-span-2">
          <div className="font-medium text-black dark:text-white mb-3">Liste</div>
          <ul className="divide-y divide-neutral-200 dark:divide-gray-700">
            {users.length === 0 && <li className="py-2 text-gray-600 dark:text-gray-400">Aucun employé</li>}
            {users.map(u => (
              <li key={u.id} className="py-3">
                <div className="font-medium text-black dark:text-white">{u.name || u.email}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{u.email} · {u.role}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


