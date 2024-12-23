import { create } from 'zustand'
import { getToken, setToken as setTokenUtil, removeToken } from '../utils/token'

type User = {
  id: string
  email: string
} | null

type AuthStore = {
  user: User
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  setIsLoading: (isLoading: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: getToken(),
  isAuthenticated: !!getToken(),
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    setTokenUtil(token)
    set({ token, isAuthenticated: true })
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  clearAuth: () => {
    removeToken()
    set({ user: null, token: null, isAuthenticated: false })
  },
})) 