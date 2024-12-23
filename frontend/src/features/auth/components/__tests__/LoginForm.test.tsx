import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { LoginForm } from '../LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { AuthProvider } from '../../contexts/AuthContext';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginForm = () => {
    const login = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      login,
      signUp: vi.fn(),
      logout: vi.fn(),
      user: null,
      isAuthenticated: false,
    });

    return {
      login,
      ...render(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      ),
    };
  };

  it('フォームが正しくレンダリングされる', () => {
    renderLoginForm();

    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });

  it('必須フィールドが空の場合にエラーを表示する', async () => {
    renderLoginForm();

    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    expect(await screen.findByText('メールアドレスは必須です')).toBeInTheDocument();
    expect(await screen.findByText('パスワードは必須です')).toBeInTheDocument();
  });

  it('無効なメールアドレスの場合にエラーを表示する', async () => {
    renderLoginForm();

    await userEvent.type(screen.getByLabelText('メールアドレス'), 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    expect(await screen.findByText('メールアドレスの形式が正しくありません')).toBeInTheDocument();
  });

  it('パスワードが要件を満たさない場合にエラーを表示する', async () => {
    renderLoginForm();

    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('パスワード'), 'short');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    expect(await screen.findByText('パスワードは8文字以上である必要があります')).toBeInTheDocument();
  });

  it('認証情報が不正な場合エラーを表示する', async () => {
    const { login } = renderLoginForm();
    login.mockRejectedValue(new Error('メールアドレスまたはパスワードが間違っています'));

    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('パスワード'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    expect(await screen.findByText('メールアドレスまたはパスワードが間違っています')).toBeInTheDocument();
  });

  it('正しい認証情報でログインできること', async () => {
    const { login } = renderLoginForm();

    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('パスワード'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
}); 