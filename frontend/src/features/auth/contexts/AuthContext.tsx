'use client';

import {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { useAuthStore } from '../stores/authStore';
import { login as loginApi, signUp as signUpApi, logout as logoutApi } from '../services/auth';
import type { LoginInput, SignUpInput } from '../services/auth';

type AuthContextType = {
  isAuthenticated: boolean;
  user: { id: string; email: string } | null;
  login: (input: LoginInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setUser, setToken, clearAuth } = useAuthStore();

  const login = async (input: LoginInput) => {
    try {
      const response = await loginApi(input);
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('認証に失敗しました');
      }
      throw error;
    }
  };

  const signUp = async (input: SignUpInput) => {
    try {
      const response = await signUpApi(input);
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('サインアップに失敗しました');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      clearAuth();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('ログアウトに失敗しました');
      }
      throw error;
    }
  };

  const value = {
    isAuthenticated: useAuthStore((state) => state.isAuthenticated),
    user: useAuthStore((state) => state.user),
    login,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 