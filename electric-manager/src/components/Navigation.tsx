'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      // Par défaut, mode light - on s'assure qu'il n'y a pas de classe dark
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Ne pas afficher la navigation sur la page d'accueil
  if (pathname === '/') {
    return null
  }

  return (
    <div className="rounded-none sm:rounded-b-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white shadow-sm dark:shadow-gray-900/50">
      <div className="px-5 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="font-semibold tracking-tight">Electropro</div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 transition">Dashboard</Link>
          <Link href="/clients" className="px-3 py-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition">Clients</Link>
          <Link href="/interventions" className="px-3 py-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition">Interventions</Link>
          <Link href="/agenda" className="px-3 py-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition">Agenda</Link>
          <Link href="/marchandise" className="px-3 py-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition">Marchandise</Link>
          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-lg bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 transition"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </div>
  )
}
