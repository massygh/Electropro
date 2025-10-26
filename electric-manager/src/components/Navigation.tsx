'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

interface Notification {
  id: number
  message: string
  type: string
  read: boolean
  createdAt: string
}

export default function Navigation() {
  const pathname = usePathname()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

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

  // Charger les notifications pour les ADMIN
  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchNotifications()
      // Rafraichir toutes les 30 secondes
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (showNotifications && !target.closest('.notification-container')) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showNotifications])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      })
      if (res.ok) {
        fetchNotifications()
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
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
          <Link href="/interventions" className="px-3 py-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition">Interventions</Link>
          {session?.user?.role === 'ADMIN' && (
            <>
              <Link href="/utilisateurs" className="px-3 py-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition">Utilisateurs</Link>
              <Link href="/chantiers" className="px-3 py-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition">Chantiers</Link>
              <Link href="/agenda" className="px-3 py-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition">Agenda</Link>
              <Link href="/marchandise" className="px-3 py-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/10 transition">Marchandise</Link>
            </>
          )}
          {session?.user?.role === 'ADMIN' && (
            <div className="relative ml-2 notification-container">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 transition relative"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                      Aucune notification
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                            !notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => !notif.read && markAsRead(notif.id)}
                        >
                          <p className="text-sm text-gray-900 dark:text-white">{notif.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(notif.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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

          {session?.user && (
            <div className="ml-4 flex items-center gap-3 border-l border-white/20 pl-4">
              <div className="text-right">
                <div className="text-sm font-semibold">{session.user.name}</div>
                <div className="text-xs opacity-75">
                  {session.user.role === 'ADMIN' && 'Administrateur'}
                  {session.user.role === 'PRO' && 'Professionnel'}
                  {session.user.role === 'CLIENT' && 'Client'}
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 dark:bg-white/5 dark:hover:bg-red-600/80 transition"
                aria-label="Deconnexion"
                title="Deconnexion"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </nav>
      </div>
    </div>
  )
}
