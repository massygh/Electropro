'use client'

import { usePathname } from 'next/navigation'
import { SessionProvider, useSession } from 'next-auth/react'
import Navigation from '@/components/Navigation'
import ClientNavigation from '@/components/ClientNavigation'

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Hide navigation on public pages (landing, login, signup)
  const hideNavigation = pathname === '/' || pathname === '/login' || pathname === '/signup'

  // Determine which navbar to show based on account type
  const accountType = session?.user?.accountType

  return (
    <>
      {!hideNavigation && (
        <>
          {accountType === 'CLIENT' ? (
            <ClientNavigation />
          ) : (
            <Navigation />
          )}
        </>
      )}
      {children}
    </>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  )
}
