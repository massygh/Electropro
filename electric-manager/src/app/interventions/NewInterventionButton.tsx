'use client'

import { useState } from 'react'
import JobForm from '@/components/JobForm'

export default function NewInterventionButton({ clients, users }: { clients: any[]; users?: any[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={()=>setOpen(true)}
        className="group px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-700 dark:to-gray-800 text-white font-medium hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 dark:hover:from-gray-600 dark:hover:to-gray-700 hover:shadow-lg hover:shadow-purple-500/50 dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center gap-2 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 dark:via-white/0 animate-shimmer" />
        <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Planifier une intervention
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60">
          <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-medium text-black dark:text-white">Nouvelle intervention</div>
              <button onClick={()=>setOpen(false)} className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-gray-600 hover:bg-neutral-50 dark:hover:bg-gray-700 text-black dark:text-white transition">Fermer</button>
            </div>
            <JobForm clients={clients as any} users={users} />
          </div>
        </div>
      )}
    </div>
  )
}


