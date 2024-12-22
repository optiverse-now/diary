import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { LoginForm } from '../components/LoginForm';
import { SignUpForm } from '../components/SignUpForm';
import { AuthProvider } from '../contexts/AuthContext';
import { signIn, signUp } from '../api';

// モックの設定
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('../api', () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

const renderWithAuth = (component: React.ReactNode) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

describe('認証フロー', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ログインフォーム', () => {
    it('正常にログインできること', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      };
      const mockToken = 'mock-token';

      vi.mocked(signIn).mockResolvedValueOnce({
        user: mockUser,
        token: mockToken,
      });

      renderWithAuth(<LoginForm />);

      // フォームに入力
      const emailInput = screen.getByPlaceholderText('example@example.com');
      const passwordInput = screen.getByPlaceholderText('********');
      const submitButton = screen.getByText('ログイン');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.click(submitButton);

      // APIが呼び出されたことを確認
      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password123',
        });
      });
    });

    it('ログインエラーが表示されること', async () => {
      const errorMessage = 'メールアドレスまたはパスワードが間違っています';
      vi.mocked(signIn).mockRejectedValueOnce(new Error(errorMessage));

      renderWithAuth(<LoginForm />);

      // フォームに入力
      const emailInput = screen.getByPlaceholderText('example@example.com');
      const passwordInput = screen.getByPlaceholderText('********');
      const submitButton = screen.getByText('ログイン');

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'WrongPass123' } });
      fireEvent.click(submitButton);

      // エラーメッセージが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe('サインアップフォーム', () => {
    it('正常に登録できること', async () => {
      const mockUser = {
        id: '1',
        name: 'New User',
        email: 'new@example.com',
      };
      const mockToken = 'mock-token';

      vi.mocked(signUp).mockResolvedValueOnce({
        user: mockUser,
        token: mockToken,
      });

      renderWithAuth(<SignUpForm />);

      // フォームに入力
      const nameInput = screen.getByPlaceholderText('山田 太郎');
      const emailInput = screen.getByPlaceholderText('example@example.com');
      const passwordInput = screen.getByPlaceholderText('********');
      const submitButton = screen.getByText('新規登録');

      fireEvent.change(nameInput, { target: { value: 'New User' } });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'NewPass123' } });
      fireEvent.click(submitButton);

      // APIが呼び出されたことを確認
      await waitFor(() => {
        expect(signUp).toHaveBeenCalledWith({
          name: 'New User',
          email: 'new@example.com',
          password: 'NewPass123',
        });
      });
    });

    it('登録エラーが表示されること', async () => {
      const errorMessage = '既に登録されているメールアドレスです';
      vi.mocked(signUp).mockRejectedValueOnce(new Error(errorMessage));

      renderWithAuth(<SignUpForm />);

      // フォームに入力
      const nameInput = screen.getByPlaceholderText('山田 太郎');
      const emailInput = screen.getByPlaceholderText('example@example.com');
      const passwordInput = screen.getByPlaceholderText('********');
      const submitButton = screen.getByText('新規登録');

      fireEvent.change(nameInput, { target: { value: 'Existing User' } });
      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'ExistPass123' } });
      fireEvent.click(submitButton);

      // エラーメッセージが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });
}); 