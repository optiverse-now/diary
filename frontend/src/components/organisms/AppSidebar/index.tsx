'use client'

import { Book, Home, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../../features/auth/contexts/AuthContext'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarFooter,
} from '../../../components/molecules/SidebarItem'

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <Sidebar defaultOpen>
      <SidebarHeader className="flex items-center gap-2">
        <h1 className="text-xl font-bold">Let&apos;s Change</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuButton
            asChild
            isActive={pathname === '/applications/home'}
            tooltip="ホーム"
          >
            <Link href="/applications/home" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>ホーム</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith('/applications/diary')}
            tooltip="日記"
          >
            <Link href="/applications/diary" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>日記</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarContent>
      {user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(`/applications/user/${user.id}`)}
              tooltip="アカウント"
            >
              <Link
                href={`/applications/user/${user.id}`}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[160px]">
                    {user.email}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  )
} 