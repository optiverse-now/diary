import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { SignInForm } from '../SignInForm';
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

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignInForm = () => {
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
          <SignInForm />
        </AuthProvider>
      ),
    };
  };

  it('正しい入力でフォームを送信できる', async () => {
    const { login } = renderSignInForm();

    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('パスワード'), 'Password123');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      });
    });
  });

  it('メールアドレスが無効な場合にエラーを表示する', async () => {
    renderSignInForm();

    await userEvent.type(screen.getByLabelText('メールアドレス'), 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    const errorMessage = await screen.findByText('メールアドレスの形式が正しくありません');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-destructive');
  });

  it('パスワードが空の場合にエラーを表示する', async () => {
    renderSignInForm();

    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    const errorMessage = await screen.findByText('パスワードは必須です');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-destructive');
  });

  it('サインインに��敗した場合にエラーを表示する', async () => {
    const { login } = renderSignInForm();
    login.mockRejectedValue(new Error('メールアドレスまたはパスワードが間違っています'));

    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('パスワード'), 'Password123');
    await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

    const errorMessage = await screen.findByText('メールアドレスまたはパスワードが間違っています');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-destructive');
  });
}); 