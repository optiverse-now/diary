'use client'

import { Book, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from '../../../components/molecules/SidebarItem'

export function AppSidebar() {
  const pathname = usePathname()

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
    </Sidebar>
  )
} 