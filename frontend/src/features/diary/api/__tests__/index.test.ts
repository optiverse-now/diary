import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDiary, getDiary, updateDiary, deleteDiary, getDiaries } from '../index';
import { getToken } from '@/features/auth/utils/token';

vi.mock('@/features/auth/utils/token', () => ({
  getToken: vi.fn(),
}));

const mockToken = 'mock-token';
const API_BASE_URL = 'http://localhost:3000';

describe('日記API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getToken as jest.Mock).mockReturnValue(mockToken);
    global.fetch = vi.fn();
    process.env.NEXT_PUBLIC_API_BASE_URL = API_BASE_URL;
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  });

  describe('createDiary', () => {
    it('日記の作成が成功すること', async () => {
      const mockDiary = {
        title: 'テスト日記',
        content: 'テスト内容',
        mood: '楽しい',
        tags: 'テスト,日記',
      };

      const mockResponse = {
        id: '1',
        ...mockDiary,
        createdAt: '2024-03-20T00:00:00.000Z',
        updatedAt: '2024-03-20T00:00:00.000Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await createDiary(mockDiary);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/diaries`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify(mockDiary),
        }
      );
    });

    it('APIエラーが適切に処理されること', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: '日記の作成に失敗しました' }),
      });

      await expect(createDiary({
        title: '',
        content: '',
        mood: '',
        tags: '',
      })).rejects.toThrow('日記の作成に失敗しました');
    });
  });

  describe('getDiary', () => {
    it('指定したIDの日記を取得できること', async () => {
      const mockDiary = {
        id: '1',
        title: 'テスト日記',
        content: 'テスト内容',
        mood: '楽しい',
        tags: 'テスト,日記',
        createdAt: '2024-03-20T00:00:00.000Z',
        updatedAt: '2024-03-20T00:00:00.000Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDiary),
      });

      const result = await getDiary('1');
      expect(result).toEqual(mockDiary);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/diaries/1`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
    });

    it('存在しない日記のIDを指定した場合エラーになること', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: '日記が見つかりません' }),
      });

      await expect(getDiary('999')).rejects.toThrow('日記が見つかりません');
    });
  });

  describe('updateDiary', () => {
    it('日記の更新が成功すること', async () => {
      const mockDiary = {
        id: '1',
        title: '更新後のタイトル',
        content: '更新後の内容',
        mood: '楽しい',
        tags: 'テスト,日記',
      };

      const mockResponse = {
        ...mockDiary,
        createdAt: '2024-03-20T00:00:00.000Z',
        updatedAt: '2024-03-20T00:00:00.000Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await updateDiary('1', mockDiary);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/diaries/1`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify(mockDiary),
        }
      );
    });

    it('存在しない日記の更新を試みた場合エラーになること', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: '日記が見つかりません' }),
      });

      await expect(updateDiary('999', {
        title: '更新後のタイトル',
        content: '更新後の内容',
        mood: '楽しい',
        tags: 'テスト,日記',
      })).rejects.toThrow('日記が見つかりません');
    });
  });

  describe('deleteDiary', () => {
    it('日記の削除が成功すること', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await deleteDiary('1');
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/diaries/1`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
    });

    it('存在しない日記の削除を試みた場合エラーになること', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: '日記が見つかりません' }),
      });

      await expect(deleteDiary('999')).rejects.toThrow('日記が見つかりません');
    });
  });

  describe('getDiaries', () => {
    it('日記一覧を取得できること', async () => {
      const mockDiaries = {
        diaries: [
          {
            id: '1',
            title: 'テスト日記1',
            content: 'テスト内容1',
            mood: '楽しい',
            tags: 'テスト,日記',
            createdAt: '2024-03-20T00:00:00.000Z',
            updatedAt: '2024-03-20T00:00:00.000Z',
          },
          {
            id: '2',
            title: 'テスト日記2',
            content: 'テスト内容2',
            mood: '疲れた',
            tags: 'テスト,日記',
            createdAt: '2024-03-21T00:00:00.000Z',
            updatedAt: '2024-03-21T00:00:00.000Z',
          },
        ],
        pagination: {
          total: 2,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDiaries),
      });

      const result = await getDiaries();
      expect(result).toEqual({
        diaries: mockDiaries.diaries,
        totalPages: mockDiaries.pagination.total,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/diaries?page=1`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
    });

    it('APIエラーが適切に処理されること', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: '日記の取得に失敗しました' }),
      });

      await expect(getDiaries()).rejects.toThrow('日記の取得に失敗しました');
    });
  });
}); 