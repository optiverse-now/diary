'use client'

import { ReactNode, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { BookOpen, House, List, User, X } from '@phosphor-icons/react';

type Props = {
  children: ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex min-h-screen">
      <div
        data-testid="sidebar"
        className={cn(
          'group/sidebar relative flex h-full flex-col overflow-hidden border-r bg-sidebar text-sidebar-foreground w-[--sidebar-width]',
          isMobile && 'fixed inset-y-0 left-0 z-50 transition-transform',
          isMobile && !isOpen && 'translate-x-[-100%]'
        )}
        style={{
          '--sidebar-width': '16rem',
          '--sidebar-width-mobile': '18rem',
          '--sidebar-width-icon': '3rem',
        } as React.CSSProperties}
      >
        <div
          data-sidebar="header"
          className="h-14 shrink-0 border-b border-sidebar-border px-4 flex items-center gap-2"
        >
          <h1 className="text-xl font-bold">Let&apos;s Change</h1>
        </div>
        <div data-sidebar="content" className="flex-1 overflow-auto">
          <div data-sidebar="menu" className="flex flex-col gap-1 p-2">
            <Link
              href="/applications/home"
              data-sidebar="menu-button"
              data-active={pathname === '/applications/home'}
              data-state="closed"
              data-size="default"
              className={cn(
                'group/menu-button peer/menu-button relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
                'h-9',
                pathname === '/applications/home' && 'bg-sidebar-accent text-sidebar-accent-foreground',
                'flex items-center gap-2'
              )}
            >
              <House />
              <span>ホーム</span>
            </Link>
            <Link
              href="/applications/diary"
              data-sidebar="menu-button"
              data-active={pathname.startsWith('/applications/diary')}
              data-state="closed"
              data-size="default"
              className={cn(
                'group/menu-button peer/menu-button relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
                'h-9',
                pathname.startsWith('/applications/diary') && 'bg-sidebar-accent text-sidebar-accent-foreground',
                'flex items-center gap-2'
              )}
            >
              <BookOpen />
              <span>日記</span>
            </Link>
          </div>
        </div>
        <div data-sidebar="footer" className="mt-auto">
          <div data-sidebar="menu" className="flex flex-col gap-1 p-2">
            <Link
              href={`/applications/user/${user?.id}`}
              data-sidebar="menu-button"
              data-active={pathname.startsWith('/applications/user')}
              data-state="closed"
              data-size="default"
              className={cn(
                'group/menu-button peer/menu-button relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
                'h-9',
                pathname.startsWith('/applications/user') && 'bg-sidebar-accent text-sidebar-accent-foreground',
                'flex items-center gap-2'
              )}
            >
              <User />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-gray-500 truncate max-w-[160px]">{user?.email}</span>
              </div>
            </Link>
          </div>
        </div>
        {isMobile && (
          <button
            data-testid="close-button"
            onClick={handleToggle}
            className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">メニューを閉じる</span>
          </button>
        )}
      </div>
      {isMobile && (
        <button
          data-testid="menu-button"
          onClick={handleToggle}
          className="fixed left-4 top-4 z-40"
        >
          <List className="h-6 w-6" />
          <span className="sr-only">メニューを開く</span>
        </button>
      )}
      <main className="flex-1 w-[calc(100vw-255px)] bg-gray-50">{children}</main>
    </div>
  );
}; 