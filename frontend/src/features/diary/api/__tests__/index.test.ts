import { vi } from 'vitest';
import { createDiary, deleteDiary, getDiaries, getDiary, updateDiary } from '..';
import { getToken } from '@/features/auth/utils/token';

vi.mock('@/features/auth/utils/token', () => ({
  getToken: vi.fn(),
}));

describe('日記API', () => {
  beforeEach(() => {
    vi.mocked(getToken).mockReturnValue('dummy-token');
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createDiary', () => {
    it('日記の作成が成功すること', async () => {
      const mockResponse = {
        id: 1,
        title: 'テスト日記',
        content: 'テスト内容',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await createDiary({
        title: 'テスト日記',
        content: 'テスト内容',
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        '/api/diaries',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer dummy-token',
          },
          body: JSON.stringify({
            title: 'テスト日記',
            content: 'テスト内容',
          }),
        })
      );
    });

    it('APIエラーが適切に処理されること', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: '無効なリクエストです' }),
      });

      await expect(
        createDiary({
          title: '',
          content: '',
        })
      ).rejects.toThrow('無効なリクエストです');
    });
  });

  describe('getDiary', () => {
    it('指定したIDの日記を取得できること', async () => {
      const mockResponse = {
        id: 1,
        title: 'テスト日記',
        content: 'テスト内容',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getDiary(1);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/diaries/1', {
        headers: {
          Authorization: 'Bearer dummy-token',
        },
      });
    });

    it('存在しない日記のIDを指定した場合エラーになること', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: '日記が見つかりません' }),
      });

      await expect(getDiary(999)).rejects.toThrow('日記が見つかりません');
    });
  });

  describe('updateDiary', () => {
    it('日記の更新が成功すること', async () => {
      const mockResponse = {
        id: 1,
        title: '更新後のタイトル',
        content: '更新後の内容',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await updateDiary(1, {
        title: '更新後のタイトル',
        content: '更新後の内容',
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        '/api/diaries/1',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer dummy-token',
          },
          body: JSON.stringify({
            title: '更新後のタイトル',
            content: '更新後の内容',
          }),
        })
      );
    });

    it('存在しない日記の更新を試みた場合エラーになること', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: '日記が見つかりません' }),
      });

      await expect(
        updateDiary(999, {
          title: '更新後のタイトル',
          content: '更新後の内容',
        })
      ).rejects.toThrow('日記が見つかりません');
    });
  });

  describe('deleteDiary', () => {
    it('日記の削除が成功すること', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
      });

      await deleteDiary(1);

      expect(fetch).toHaveBeenCalledWith('/api/diaries/1', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer dummy-token',
        },
      });
    });

    it('存在しない日記の削除を試みた場合エラーになること', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: '日記が見つかりません' }),
      });

      await expect(deleteDiary(999)).rejects.toThrow('日記が見つかりません');
    });
  });

  describe('getDiaries', () => {
    it('日記一覧を取得できること', async () => {
      const mockResponse = {
        diaries: [
          {
            id: 1,
            title: 'テスト日記1',
            content: 'テスト内容1',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
          {
            id: 2,
            title: 'テスト日記2',
            content: 'テスト内容2',
            createdAt: '2024-01-02T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
        ],
        totalPages: 1,
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getDiaries();

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/diaries?page=1', {
        headers: {
          Authorization: 'Bearer dummy-token',
        },
      });
    });

    it('APIエラーが適切に処理されること', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'サーバーエラーが発生しました' }),
      });

      await expect(getDiaries()).rejects.toThrow('サーバーエラーが発生しました');
    });
  });
}); 