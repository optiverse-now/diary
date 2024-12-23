import { describe, it, expect, vi } from 'vitest';
import { signIn, signUp } from '@/features/auth/api';
import { User } from '@/features/auth/types';

vi.mock('@/features/auth/api');

const mockedSignUp = vi.mocked(signUp);
const mockedSignIn = vi.mocked(signIn);

describe('認証API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('正常に登録できること', async () => {
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      };
      const mockToken = 'mock-token';

      mockedSignUp.mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const result = await signUp({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe(mockToken);
    });

    it('既に登録されているメールアドレスの場合エラーを返すこと', async () => {
      mockedSignUp.mockRejectedValue(new Error('既に登録されているメールアドレスです'));

      await expect(signUp({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      })).rejects.toThrow('既に登録されているメールアドレスです');
    });

    it('サーバーエラーの場合適切なエラーを返すこと', async () => {
      mockedSignUp.mockRejectedValue(new Error('サーバーエラーが発生しました'));

      await expect(signUp({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })).rejects.toThrow('サーバーエラーが発生しました');
    });

    it('ネットワークエラーの場合適切なエラーを返すこと', async () => {
      mockedSignUp.mockRejectedValue(new Error('ネットワークエラーが発生しました'));

      await expect(signUp({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })).rejects.toThrow('ネットワークエラーが発生しました');
    });
  });

  describe('signIn', () => {
    it('正常にログインできること', async () => {
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      };
      const mockToken = 'mock-token';

      mockedSignIn.mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const result = await signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe(mockToken);
    });

    it('無効な認証情報の場合エラーを返すこと', async () => {
      mockedSignIn.mockRejectedValue(new Error('メールアドレスまたはパスワードが間違っています'));

      await expect(signIn({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow('メールアドレスまたはパスワードが間違っています');
    });

    it('サーバーエラーの場合適切なエラーを返すこと', async () => {
      mockedSignIn.mockRejectedValue(new Error('サーバーエラーが発生しました'));

      await expect(signIn({
        email: 'test@example.com',
        password: 'password123',
      })).rejects.toThrow('サーバーエラーが発生しました');
    });

    it('ネットワークエラーの場合適切なエラーを返すこと', async () => {
      mockedSignIn.mockRejectedValue(new Error('ネットワークエラーが発生しました'));

      await expect(signIn({
        email: 'test@example.com',
        password: 'password123',
      })).rejects.toThrow('ネットワークエラーが発生しました');
    });
  });
}); 