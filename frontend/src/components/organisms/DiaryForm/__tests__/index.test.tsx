import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { DiaryForm } from '..';

// Next.jsのルーターをモック
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// toastをモック
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('DiaryForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('フォームが正しくレンダリングされること', () => {
    render(<DiaryForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('内容')).toBeInTheDocument();
    expect(screen.getByLabelText('今日の気分')).toBeInTheDocument();
    expect(screen.getByLabelText('タグ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  it('初期値が正しく設定されること', () => {
    const initialData = {
      title: 'テストタイトル',
      content: 'テスト内容',
      mood: '楽しい',
      tags: 'テスト,日記',
    };

    render(<DiaryForm initialData={initialData} onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('タイトル')).toHaveValue('テストタイトル');
    expect(screen.getByLabelText('内容')).toHaveValue('テスト内容');
    expect(screen.getByLabelText('今日の気分')).toHaveValue('楽しい');
    expect(screen.getByLabelText('タグ')).toHaveValue('テスト,日記');
  });

  it('必須フィールドが空の場合にエラーを表示すること', async () => {
    render(<DiaryForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByRole('alert');
      expect(errorMessages).toHaveLength(2);
      expect(errorMessages[0]).toHaveTextContent('必須項目です');
      expect(errorMessages[1]).toHaveTextContent('必須項目です');
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('フォームの送信が成功すること', async () => {
    render(<DiaryForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText('タイトル');
    const contentInput = screen.getByLabelText('内容');
    const moodInput = screen.getByLabelText('今日の気分');
    const tagsInput = screen.getByLabelText('タグ');

    fireEvent.change(titleInput, { target: { value: 'テストタイトル' } });
    fireEvent.change(contentInput, { target: { value: 'テスト内容' } });
    fireEvent.change(moodInput, { target: { value: '楽しい' } });
    fireEvent.change(tagsInput, { target: { value: 'テスト,日記' } });

    const submitButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'テストタイトル',
        content: 'テスト内容',
        mood: '楽しい',
        tags: 'テスト,日記',
      });
    });
  });

  it('送信中は入力とボタンが無効化されること', async () => {
    render(<DiaryForm onSubmit={mockOnSubmit} isSubmitting={true} />);

    expect(screen.getByLabelText('タイトル')).toBeDisabled();
    expect(screen.getByLabelText('内容')).toBeDisabled();
    expect(screen.getByLabelText('今日の気分')).toBeDisabled();
    expect(screen.getByLabelText('タグ')).toBeDisabled();
    expect(screen.getByRole('button', { name: '保存' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeDisabled();
  });
}); 