import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../authStore'

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
  })

  it('should initialize with default values', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should set user and update authentication status', () => {
    const user = { id: '1', email: 'test@example.com' }
    const token = 'test-token'

    const { setUser, setToken } = useAuthStore.getState()
    setUser(user)
    setToken(token)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(user)
    expect(state.token).toBe(token)
    expect(state.isAuthenticated).toBe(true)
  })

  it('should clear auth state', () => {
    const user = { id: '1', email: 'test@example.com' }
    const token = 'test-token'

    const { setUser, setToken, clearAuth } = useAuthStore.getState()
    setUser(user)
    setToken(token)
    clearAuth()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
}) 