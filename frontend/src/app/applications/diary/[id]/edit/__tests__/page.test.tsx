import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import EditDiaryPage from '../page';
import { getDiary, updateDiary } from '@/features/diary/api';
import { useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useParams: () => ({ id: '1' }),
}));

vi.mock('@/features/diary/api', () => ({
  getDiary: vi.fn(),
  updateDiary: vi.fn(),
}));

describe('日記編集ページ', () => {
  const mockRouter = {
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  } satisfies AppRouterInstance;

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('既存の日記データが正しく表示されること', async () => {
    const mockDiary = {
      id: 1,
      title: 'テスト日記',
      content: 'テスト内容',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    vi.mocked(getDiary).mockResolvedValueOnce(mockDiary);

    render(<EditDiaryPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('テスト日記')).toBeInTheDocument();
      expect(screen.getByDisplayValue('テスト内容')).toBeInTheDocument();
    });
  });

  it('日記の更新が成功すること', async () => {
    const mockDiary = {
      id: 1,
      title: 'テスト日記',
      content: 'テスト内容',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    vi.mocked(getDiary).mockResolvedValueOnce(mockDiary);
    vi.mocked(updateDiary).mockResolvedValueOnce({
      ...mockDiary,
      title: '更新後のタイトル',
      content: '更新後の内容',
    });

    render(<EditDiaryPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('テスト日記')).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText('タイトル');
    const contentInput = screen.getByLabelText('内容');
    const submitButton = screen.getByRole('button', { name: '更新' });

    fireEvent.change(titleInput, { target: { value: '更新後のタイトル' } });
    fireEvent.change(contentInput, { target: { value: '更新後の内容' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateDiary).toHaveBeenCalledWith(1, {
        title: '更新後のタイトル',
        content: '更新後の内容',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/applications/diary');
    });
  });

  it('バリデーションエラーが表示されること', async () => {
    const mockDiary = {
      id: 1,
      title: 'テスト日記',
      content: 'テスト���容',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    vi.mocked(getDiary).mockResolvedValueOnce(mockDiary);

    render(<EditDiaryPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('テスト日記')).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText('タイトル');
    const contentInput = screen.getByLabelText('内容');
    const submitButton = screen.getByRole('button', { name: '更新' });

    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(contentInput, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('必須項目です')).toBeInTheDocument();
    });
  });

  it('APIエラーが適切に処理されること', async () => {
    const mockDiary = {
      id: 1,
      title: 'テスト日記',
      content: 'テスト内容',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    vi.mocked(getDiary).mockResolvedValueOnce(mockDiary);
    vi.mocked(updateDiary).mockRejectedValueOnce(new Error('更新に失敗しました'));

    render(<EditDiaryPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('テスト日記')).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText('タイトル');
    const contentInput = screen.getByLabelText('内容');
    const submitButton = screen.getByRole('button', { name: '更新' });

    fireEvent.change(titleInput, { target: { value: '更新後のタイトル' } });
    fireEvent.change(contentInput, { target: { value: '更新後の内容' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('更新に失敗しました')).toBeInTheDocument();
    });
  });

  it('データ取得中はローディング状態が表示されること', async () => {
    vi.mocked(getDiary).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<EditDiaryPage />);

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });
}); 