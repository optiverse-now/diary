import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { useAuth } from '../useAuth';
import { login, signUp } from '../../services/auth';
import { AuthProvider } from '../../contexts/AuthContext';
import type { AuthResponse } from '../../types/index';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('../../services/auth', () => ({
  login: vi.fn(),
  signUp: vi.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ログインが成功した場合、ユーザー情報が更新される', async () => {
    const mockResponse: AuthResponse = {
      token: 'mock-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
    };

    vi.mocked(login).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(result.current.user).toEqual(mockResponse.user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('ログインが失敗した場合、エラーがスローされる', async () => {
    const error = new Error('認証に失敗しました');
    vi.mocked(login).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await expect(
      act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      })
    ).rejects.toThrow('認証に失敗しました');

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('サインアップが成功した場合、ユーザー情報が更新される', async () => {
    const mockResponse: AuthResponse = {
      token: 'mock-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
    };

    vi.mocked(signUp).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await act(async () => {
      await result.current.signUp({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      });
    });

    expect(result.current.user).toEqual(mockResponse.user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('サインアップが失敗した場合、エラーがスローされる', async () => {
    const error = new Error('アカウントの作成に失敗しました');
    vi.mocked(signUp).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await expect(
      act(async () => {
        await result.current.signUp({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirmation: 'password123',
        });
      })
    ).rejects.toThrow('アカウントの作成に失敗しました');

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('ログアウトが成功した場合、ユーザー情報がクリアされる', async () => {
    const mockResponse: AuthResponse = {
      token: 'mock-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
    };

    vi.mocked(login).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      ),
    });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(result.current.user).toEqual(mockResponse.user);
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
}); 