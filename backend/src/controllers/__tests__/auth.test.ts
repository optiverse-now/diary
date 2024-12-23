import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from 'hono';
import { signIn, signUp } from '../auth';
import { prisma } from '../../lib/prisma';
import { hashPassword, comparePasswords } from '../../lib/auth';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('../../lib/auth', () => ({
  hashPassword: vi.fn(),
  comparePasswords: vi.fn(),
  generateToken: () => 'test-token',
}));

describe('認証コントローラー', () => {
  let mockContext: Context;
  const mockJson = vi.fn();

  beforeEach(() => {
    mockContext = {
      req: {
        json: vi.fn(),
        raw: new Request('http://localhost'),
        routeIndex: 0,
        path: '/',
        param: vi.fn(),
        query: vi.fn(),
        header: vi.fn(),
        cookie: vi.fn(),
      },
      env: {},
      finalized: false,
      get: vi.fn(),
      header: vi.fn(),
      json: mockJson,
      set: vi.fn(),
      status: vi.fn(),
      newResponse: vi.fn(),
    } as unknown as Context;
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('新規ユーザーを作成できる', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 'test-uuid',
        name: 'テスト ユーザー',
        email: 'test@example.com',
        password: 'hashedPassword',
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      vi.mocked(hashPassword).mockResolvedValue('hashedPassword');

      vi.mocked(mockContext.req.json).mockResolvedValue({
        name: 'テスト ユーザー',
        email: 'test@example.com',
        password: 'Password123',
      });

      await signUp(mockContext);

      const result = mockJson.mock.calls[0][0];
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('name', 'テスト ユーザー');
      expect(result.user).toHaveProperty('email', 'test@example.com');
      expect(result).toHaveProperty('token', 'test-token');
    });

    it('既存のメールアドレスの場合エラーを返す', async () => {
      const existingUser = {
        id: 'test-uuid',
        name: 'テスト ユーザー',
        email: 'test@example.com',
        password: 'hashedPassword',
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser);

      vi.mocked(mockContext.req.json).mockResolvedValue({
        name: 'テスト ユーザー',
        email: 'test@example.com',
        password: 'Password123',
      });

      await signUp(mockContext);

      expect(mockJson).toHaveBeenCalledWith({
        error: 'このメールアドレスは既に登録されています',
      }, 400);
    });
  });

  describe('signIn', () => {
    it('正しい認証情報でログインできる', async () => {
      const mockUser = {
        id: 'test-uuid',
        name: 'テスト ユーザー',
        email: 'test@example.com',
        password: 'hashedPassword',
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(comparePasswords).mockResolvedValue(true);

      vi.mocked(mockContext.req.json).mockResolvedValue({
        email: 'test@example.com',
        password: 'Password123',
      });

      await signIn(mockContext);

      const result = mockJson.mock.calls[0][0];
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('name', 'テスト ユーザー');
      expect(result.user).toHaveProperty('email', 'test@example.com');
      expect(result).toHaveProperty('token', 'test-token');
    });

    it('存在しないメールアドレスの場合エラーを返す', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      vi.mocked(mockContext.req.json).mockResolvedValue({
        email: 'nonexistent@example.com',
        password: 'Password123',
      });

      await signIn(mockContext);

      expect(mockJson).toHaveBeenCalledWith({
        error: 'メールアドレスまたはパスワードが間違っています',
      }, 401);
    });
  });
}); 