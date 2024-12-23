import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'
import { useAuthStore } from '../../stores/authStore'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { login, signUp, logout } from '../../services/auth'
import { AuthProvider } from '../../contexts/AuthContext'
import type { User } from '@/types'

vi.mock('../../services/auth', () => ({
  login: vi.fn(),
  signUp: vi.fn(),
  logout: vi.fn(),
}))

interface AuthResponse {
  token: string
  user: User
}

describe('useAuth', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  )

  it('should handle login success', async () => {
    const mockResponse: AuthResponse = {
      token: 'test-token',
      user: { id: '1', email: 'test@example.com' },
    }
    (login as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })
    await result.current.login({
      email: 'test@example.com',
      password: 'password',
    })

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockResponse.user)
    expect(state.token).toBe(mockResponse.token)
    expect(state.isAuthenticated).toBe(true)
  })

  it('should handle login failure', async () => {
    const error = new Error('メールアドレスまたはパスワードが間違っています')
    (login as jest.Mock).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useAuth(), { wrapper })
    await expect(
      result.current.login({
        email: 'test@example.com',
        password: 'wrong-password',
      })
    ).rejects.toThrow('メールアドレスまたはパスワードが間違っています')
  })

  it('should handle signup success', async () => {
    const mockResponse: AuthResponse = {
      token: 'test-token',
      user: { id: '1', email: 'test@example.com' },
    }
    (signUp as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })
    await result.current.signUp({
      email: 'test@example.com',
      password: 'password',
      passwordConfirmation: 'password',
    })

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockResponse.user)
    expect(state.token).toBe(mockResponse.token)
    expect(state.isAuthenticated).toBe(true)
  })

  it('should handle signup failure', async () => {
    const error = new Error('このメールアドレスは既に使用されています')
    (signUp as jest.Mock).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useAuth(), { wrapper })
    await expect(
      result.current.signUp({
        email: 'test@example.com',
        password: 'password',
        passwordConfirmation: 'password',
      })
    ).rejects.toThrow('このメールアドレスは既に使用されています')
  })

  it('should handle logout', async () => {
    const mockUser: User = { id: '1', email: 'test@example.com' }
    const mockToken = 'test-token'
    const { setUser, setToken } = useAuthStore.getState()
    setUser(mockUser)
    setToken(mockToken)

    const { result } = renderHook(() => useAuth(), { wrapper })
    await result.current.logout()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(logout).toHaveBeenCalled()
  })
}) 