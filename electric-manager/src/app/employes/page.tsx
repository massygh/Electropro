import UserForm from '@/components/UserForm'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EmployesPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-black">Employés</h1>
        <p className="text-black/60 mt-2">Ajoutez et gérez les membres de l'équipe.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm lg:col-span-1">
          <UserForm />
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="font-medium text-black mb-3">Liste</div>
          <ul className="divide-y">
            {users.length === 0 && <li className="py-2 text-black/70">Aucun employé</li>}
            {users.map(u => (
              <li key={u.id} className="py-3">
                <div className="font-medium text-black">{u.name || u.email}</div>
                <div className="text-sm text-black/70">{u.email} · {u.role}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


