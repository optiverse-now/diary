import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { DiaryList } from '..';
import type { DiaryResponse } from '@/features/diary/api';

// Next.jsのルーターをモック
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('DiaryList', () => {
  const mockDiaries: DiaryResponse[] = [
    {
      id: '1',
      title: '今日の日記',
      content: '今日は良い一日でした。',
      mood: '楽しい',
      tags: '日常,感想',
      createdAt: new Date('2024-03-20').toISOString(),
      updatedAt: new Date('2024-03-20').toISOString(),
    },
    {
      id: '2',
      title: '明日の予定',
      content: '明日は早起きします。',
      mood: 'やる気満々',
      tags: '予定,目標',
      createdAt: new Date('2024-03-21').toISOString(),
      updatedAt: new Date('2024-03-21').toISOString(),
    },
  ];

  it('日記一覧が正しくレンダリングされること', () => {
    render(<DiaryList diaries={mockDiaries} />);

    expect(screen.getByText('今日の日記')).toBeInTheDocument();
    expect(screen.getByText('明日の予定')).toBeInTheDocument();
    expect(screen.getByText('気分: 楽しい')).toBeInTheDocument();
    expect(screen.getByText('気分: やる気満々')).toBeInTheDocument();
  });

  it('日記が存在しない場合、適切なメッセージが表示されること', () => {
    render(<DiaryList diaries={[]} />);

    expect(screen.getByText('日記がありません')).toBeInTheDocument();
  });

  it('タグがクリック可能であること', () => {
    render(<DiaryList diaries={mockDiaries} />);

    const tags = screen.getAllByTestId('diary-tag');
    expect(tags).toHaveLength(4); // 2つの日記それぞれに2つのタグ
  });

  it('ローディング中の表示が正しく動作すること', () => {
    render(<DiaryList diaries={[]} isLoading={true} />);

    expect(screen.getAllByTestId('diary-skeleton')).toHaveLength(2);
  });

  it('エラー時の表示が正しく動作すること', () => {
    const error = 'データの取得に失敗しました';
    render(<DiaryList diaries={[]} error={error} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });


  it('日記の編集リンクが正しく機能すること', () => {
    const { container } = render(<DiaryList diaries={mockDiaries} />);

    const editLinks = container.querySelectorAll('a[href^="/applications/diary/"][href$="/edit"]');
    expect(editLinks).toHaveLength(2);
  });

  it('日記の詳細リンクが正しく機能すること', () => {
    const { container } = render(<DiaryList diaries={mockDiaries} />);

    const detailLinks = container.querySelectorAll('a[href^="/applications/diary/"][href$="/show"]');
    expect(detailLinks).toHaveLength(2);
  });
}); 