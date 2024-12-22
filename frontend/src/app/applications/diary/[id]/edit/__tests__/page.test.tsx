import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import EditDiaryPage from '../page';
import { getDiary } from '@/features/diary/api';

// モックの設定
vi.mock('@/features/diary/api', () => ({
  getDiary: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('EditDiaryPage', () => {
  const mockDiary = {
    id: '1',
    title: 'テスト日記',
    content: 'これはテストです。',
    createdAt: '2024-03-20T00:00:00.000Z',
    updatedAt: '2024-03-20T00:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('日記の編集ページが正しくレンダリングされること', async () => {
    vi.mocked(getDiary).mockResolvedValueOnce(mockDiary);

    render(<EditDiaryPage />);

    await waitFor(() => {
      expect(screen.getByText('日記を編集')).toBeInTheDocument();
    });
  });
}); 