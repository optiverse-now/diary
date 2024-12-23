import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EditDiaryPage from '../page';
import { getDiary } from '@/features/diary/api';
import { AuthProvider } from '@/features/auth/contexts/AuthContext';

vi.mock('@/features/diary/api', () => ({
  getDiary: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/applications/diary/1/edit',
}));

const mockDiary = {
  id: '1',
  title: 'テスト日記',
  content: 'テスト内容',
  mood: '楽しい',
  tags: 'テスト,日記',
  createdAt: '2024-03-20T00:00:00.000Z',
  updatedAt: '2024-03-20T00:00:00.000Z',
};

describe('EditDiaryPage', () => {
  it('日記の編集ページが正しくレンダリングされること', async () => {
    (getDiary as jest.Mock).mockResolvedValueOnce(mockDiary);

    render(
      <AuthProvider>
        <EditDiaryPage />
      </AuthProvider>
    );

    expect(await screen.findByText('日記を編集')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('テスト日記')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('テスト内容')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('楽しい')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('テスト,日記')).toBeInTheDocument();
  });
}); 