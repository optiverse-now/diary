import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '@/shared/config/constants';

export const handlers = [
  // 認証関連のモック
  http.post(`${API_BASE_URL}/auth/login`, () => {
    return HttpResponse.json({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      },
      token: 'dummy-token',
    });
  }),

  // 日記関連のモック
  http.get(`${API_BASE_URL}/diaries`, () => {
    return HttpResponse.json({
      diaries: [
        {
          id: '1',
          title: 'テスト日記',
          content: 'これはテスト用の日記です',
          createdAt: '2023-12-22T00:00:00.000Z',
          updatedAt: '2023-12-22T00:00:00.000Z',
        },
      ],
    });
  }),
]; 