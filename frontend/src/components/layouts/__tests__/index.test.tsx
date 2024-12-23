import { render, screen, fireEvent } from '@testing-library/react';
import { MainLayout } from '..';
import { vi } from 'vitest';
import { useIsMobile } from '@/shared/hooks/use-mobile';

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(),
}));

describe('MainLayout', () => {
  beforeEach(() => {
    vi.mocked(useIsMobile).mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('子コンポーネントが正しくレンダリングされること', () => {
    render(
      <MainLayout>
        <div>テストコンテンツ</div>
      </MainLayout>
    );

    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument();
  });

  it('サイドバーが表示されること', () => {
    render(
      <MainLayout>
        <div>テストコンテンツ</div>
      </MainLayout>
    );

    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar).toBeInTheDocument();
    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('日記')).toBeInTheDocument();
  });

  describe('モバイル表示', () => {
    beforeEach(() => {
      vi.mocked(useIsMobile).mockReturnValue(true);
    });

    it('初期状態ではサイドバーが非表示であること', () => {
      render(
        <MainLayout>
          <div>テストコンテンツ</div>
        </MainLayout>
      );

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveClass('translate-x-[-100%]');
    });

    it('メニューボタンをクリックするとサイドバーが表示されること', () => {
      render(
        <MainLayout>
          <div>テストコンテンツ</div>
        </MainLayout>
      );

      const menuButton = screen.getByTestId('menu-button');
      fireEvent.click(menuButton);

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).not.toHaveClass('translate-x-[-100%]');
    });

    it('サイドバーを閉じるボタンをクリックするとサイドバーが非表示になること', () => {
      render(
        <MainLayout>
          <div>テストコンテンツ</div>
        </MainLayout>
      );

      const menuButton = screen.getByTestId('menu-button');
      fireEvent.click(menuButton);

      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveClass('translate-x-[-100%]');
    });
  });
}); 