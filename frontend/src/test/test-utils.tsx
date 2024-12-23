import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/features/auth/contexts/AuthContext'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AuthProvider, ...options })

export * from '@testing-library/react'
export { customRender as render } 