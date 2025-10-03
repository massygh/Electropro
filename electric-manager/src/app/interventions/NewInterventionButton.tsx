'use client'

import { useState } from 'react'
import JobForm from '@/components/JobForm'

export default function NewInterventionButton({ clients }: { clients: any[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={()=>setOpen(true)} className="px-5 py-3 rounded-xl bg-black text-white hover:opacity-90 text-lg">+ Planifier une intervention</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-medium text-black">Nouvelle intervention</div>
              <button onClick={()=>setOpen(false)} className="px-3 py-1.5 rounded-lg border hover:bg-neutral-50">Fermer</button>
            </div>
            <JobForm clients={clients as any} />
          </div>
        </div>
      )}
    </div>
  )
}


