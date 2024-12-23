import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
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

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('正しい入力でフォームを送信できる', async () => {
    const { signUp } = renderSignUpForm();

    await userEvent.type(screen.getByLabelText('名前'), '山田 太郎');
    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('パスワード'), 'Password123');
    await userEvent.type(screen.getByLabelText('パスワード（確認）'), 'Password123');
    await userEvent.click(screen.getByRole('button', { name: '新規登録' }));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith({
        name: '山田 太郎',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
    });
  });

  it('名前が空の場合にエラーを表示する', async () => {
    renderSignUpForm();

    await userEvent.click(screen.getByRole('button', { name: '新規登録' }));

    const errorMessage = await screen.findByText('名前は必須です');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-destructive');
  });

  it('メールアドレスが無効な場合にエラーを表示する', async () => {
    renderSignUpForm();

    await userEvent.type(screen.getByLabelText('メールアドレス'), 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: '新規登録' }));

    const errorMessage = await screen.findByText('メールアドレスの形式が正しくありません');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-destructive');
  });

  it('パスワードが一致しない場合にエラーを表示する', async () => {
    renderSignUpForm();

    await userEvent.type(screen.getByLabelText('パスワード'), 'Password123');
    await userEvent.type(screen.getByLabelText('パスワード（確認）'), 'DifferentPassword123');
    await userEvent.click(screen.getByRole('button', { name: '新規登録' }));

    const errorMessage = await screen.findByText('パスワードが一致しません');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-destructive');
  });

  it('サインアップに失敗した場合にエラーを表示する', async () => {
    const { signUp } = renderSignUpForm();
    signUp.mockRejectedValue(new Error('このメールアドレスは既に登録されています'));

    await userEvent.type(screen.getByLabelText('名前'), '山田 太郎');
    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('パスワード'), 'Password123');
    await userEvent.type(screen.getByLabelText('パスワード（確認）'), 'Password123');
    await userEvent.click(screen.getByRole('button', { name: '新規登録' }));

    const errorMessage = await screen.findByText('このメールアドレスは既に登録されています');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-destructive');
  });
}); 