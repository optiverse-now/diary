'use client'

import { AppSidebar } from '../../organisms/AppSidebar'

type MainLayoutProps = {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 w-[calc(100vw-255px)] bg-gray-50">
        {children}
      </main>
    </div>
  )
} 