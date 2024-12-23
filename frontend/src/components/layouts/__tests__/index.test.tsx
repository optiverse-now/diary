import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MainLayout } from '../index';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { AuthProvider } from '@/features/auth/contexts/AuthContext';
import { usePathname } from 'next/navigation';

vi.mock('@/shared/hooks/use-mobile');
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
  })),
}));

const mockUseIsMobile = useIsMobile as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;

describe('MainLayout', () => {
  beforeEach(() => {
    mockUseIsMobile.mockReturnValue(false);
    mockUsePathname.mockReturnValue('/applications/diary');
  });

  it('子コンポーネントが正しくレンダリングされること', () => {
    render(
      <AuthProvider>
        <MainLayout>
          <div>テストコンテンツ</div>
        </MainLayout>
      </AuthProvider>
    );

    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument();
  });

  it('サイドバーが表示されるこ���', () => {
    render(
      <AuthProvider>
        <MainLayout>
          <div>テストコンテンツ</div>
        </MainLayout>
      </AuthProvider>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  describe('モバイル表示', () => {
    beforeEach(() => {
      mockUseIsMobile.mockReturnValue(true);
    });

    it('初期状態ではサイドバーが非表示であること', () => {
      render(
        <AuthProvider>
          <MainLayout>
            <div>テストコンテンツ</div>
          </MainLayout>
        </AuthProvider>
      );

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveClass('-translate-x-full');
    });

    it('メニューボタンをクリックするとサイドバーが表示されること', () => {
      render(
        <AuthProvider>
          <MainLayout>
            <div>テストコンテンツ</div>
          </MainLayout>
        </AuthProvider>
      );

      const menuButton = screen.getByRole('button', { name: 'メニューを開く' });
      fireEvent.click(menuButton);

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).not.toHaveClass('-translate-x-full');
    });

    it('サイドバーを閉じるボタンをクリックするとサイドバーが非表示になること', () => {
      render(
        <AuthProvider>
          <MainLayout>
            <div>テストコンテンツ</div>
          </MainLayout>
        </AuthProvider>
      );

      const menuButton = screen.getByRole('button', { name: 'メニューを開く' });
      fireEvent.click(menuButton);

      const closeButton = screen.getByRole('button', { name: 'メニューを閉じる' });
      fireEvent.click(closeButton);

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveClass('-translate-x-full');
    });
  });
}); 