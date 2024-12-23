import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { SignInForm } from '../SignInForm';
import { SignUpForm } from '../SignUpForm';
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

describe('認証フォーム', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ログインフォーム', () => {
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

    it('正しい認証情報でログインできること', async () => {
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

    it('メールアドレスの形式が正しくない場合エラーが表示されること', async () => {
      renderSignInForm();

      await userEvent.type(screen.getByLabelText('メールアドレス'), 'invalid-email');
      await userEvent.type(screen.getByLabelText('パスワード'), 'Password123');
      await userEvent.click(screen.getByRole('button', { name: 'ログイン' }));

      const errorMessage = await screen.findByText('メールアドレスの形式が正しくありません');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-destructive');
    });
  });

  describe('サインアップフォーム', () => {
    const renderSignUpForm = () => {
      const signUp = vi.fn();
      vi.mocked(useAuth).mockReturnValue({
        login: vi.fn(),
        signUp,
        logout: vi.fn(),
        user: null,
        isAuthenticated: false,
      });

      return {
        signUp,
        ...render(
          <AuthProvider>
            <SignUpForm />
          </AuthProvider>
        ),
      };
    };

    it('正しい情報でサインアップできること', async () => {
      const { signUp } = renderSignUpForm();

      await userEvent.type(screen.getByLabelText('名前'), 'テスト ユーザー');
      await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('パスワード'), 'Password123');
      await userEvent.type(screen.getByLabelText('パスワード（確認）'), 'Password123');
      await userEvent.click(screen.getByRole('button', { name: '新規登録' }));

      await waitFor(() => {
        expect(signUp).toHaveBeenCalledWith({
          name: 'テスト ユーザー',
          email: 'test@example.com',
          password: 'Password123',
          confirmPassword: 'Password123',
        });
      });
    });

    it('パスワードが一致しない場合エラーが表示されること', async () => {
      renderSignUpForm();

      await userEvent.type(screen.getByLabelText('名前'), 'テスト ユーザー');
      await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
      await userEvent.type(screen.getByLabelText('パスワード'), 'Password123');
      await userEvent.type(screen.getByLabelText('パスワード（確認）'), 'DifferentPassword123');
      await userEvent.click(screen.getByRole('button', { name: '新規登録' }));

      const errorMessage = await screen.findByText('パスワードが一致しません');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-destructive');
    });
  });
}); 