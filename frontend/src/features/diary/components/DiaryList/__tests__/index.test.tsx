import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DiaryList } from '../index';

const mockDiaries = [
  {
    id: '1',
    title: '今日の日記',
    content: '今日は良い一日でした。',
    mood: '楽しい',
    tags: '日常,感想',
    createdAt: '2024-03-20T00:00:00.000Z',
    updatedAt: '2024-03-20T00:00:00.000Z',
  },
  {
    id: '2',
    title: '明日の予定',
    content: '明日は早起きします。',
    mood: 'やる気満々',
    tags: '予定,目標',
    createdAt: '2024-03-21T00:00:00.000Z',
    updatedAt: '2024-03-21T00:00:00.000Z',
  },
];

describe('DiaryList', () => {
  it('日記一覧が正しくレンダリングされること', () => {
    render(<DiaryList diaries={mockDiaries} />);

    expect(screen.getByText('今日の日記')).toBeInTheDocument();
    expect(screen.getByText('明日の予定')).toBeInTheDocument();
    expect(screen.getByText('今日は良い一日でした。')).toBeInTheDocument();
    expect(screen.getByText('明日は早起きします。')).toBeInTheDocument();
    expect(screen.getByText('楽しい')).toBeInTheDocument();
    expect(screen.getByText('やる気満々')).toBeInTheDocument();
  });

  it('日記が存在しない場合、適切なメッセージが表示されること', () => {
    render(<DiaryList diaries={[]} />);
    expect(screen.getByText('日記がありません')).toBeInTheDocument();
  });

  it('タグが正しく表示されること', () => {
    render(<DiaryList diaries={mockDiaries} />);

    expect(screen.getByText('日常')).toBeInTheDocument();
    expect(screen.getByText('感想')).toBeInTheDocument();
    expect(screen.getByText('予定')).toBeInTheDocument();
    expect(screen.getByText('目標')).toBeInTheDocument();
  });

  it('ローディング中の表示が正しく動作すること', () => {
    render(<DiaryList diaries={[]} isLoading={true} />);
    expect(screen.getAllByTestId('diary-skeleton')).toHaveLength(2);
  });

  it('エラー時の表示が正しく動作すること', () => {
    render(<DiaryList diaries={[]} error="エラーが発生しました" />);
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });

  it('日記の詳細リンクが正しく機能すること', () => {
    const { container } = render(<DiaryList diaries={mockDiaries} />);
    const detailLinks = container.querySelectorAll('a[href^="/applications/diary/"][href$="/show"]');
    expect(detailLinks).toHaveLength(2);
  });
}); 