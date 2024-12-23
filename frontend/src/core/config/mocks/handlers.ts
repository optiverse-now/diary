import { rest } from 'msw';
import { API_BASE_URL } from '@/core/config';

export const handlers = [
  // 認証関連のモック
  rest.post(`${API_BASE_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
        token: 'dummy-token',
      })
    );
  }),

  // 日記関連のモック
  rest.get(`${API_BASE_URL}/diaries`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        diaries: [
          {
            id: '1',
            title: 'テスト日記',
            content: 'これはテスト用の日記です',
            createdAt: '2023-12-22T00:00:00.000Z',
            updatedAt: '2023-12-22T00:00:00.000Z',
          },
        ],
      })
    );
  }),
]; 