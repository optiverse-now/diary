import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DiaryForm } from '../index';

const mockOnSubmit = vi.fn();

describe('DiaryForm', () => {
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
  });

  it('初期値が正しく設定されること', () => {
    const initialData = {
      title: 'テストタイトル',
      content: 'テスト内容',
      mood: '楽しい',
      tags: 'テスト,日記',
    };

    render(
      <DiaryForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText('タイトル')).toHaveValue('テストタイトル');
    expect(screen.getByLabelText('内容')).toHaveValue('テスト内容');
    expect(screen.getByLabelText('今日の気分')).toHaveValue('楽しい');
    expect(screen.getByLabelText('タグ')).toHaveValue('テスト,日記');
  });

  it('必須フィールドが空の場合にエラーを表示すること', async () => {
    render(<DiaryForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: '保存' }));

    await waitFor(() => {
      expect(screen.getAllByText('必須項目です')).toHaveLength(2);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('フォームの送信が成功すること', async () => {
    render(<DiaryForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText('タイトル'), {
      target: { value: 'テストタイトル' },
    });
    fireEvent.change(screen.getByLabelText('内容'), {
      target: { value: 'テスト内容' },
    });
    fireEvent.change(screen.getByLabelText('今日の気分'), {
      target: { value: '楽しい' },
    });
    fireEvent.change(screen.getByLabelText('タグ'), {
      target: { value: 'テスト,日記' },
    });

    fireEvent.click(screen.getByRole('button', { name: '保存' }));

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
    render(<DiaryForm onSubmit={mockOnSubmit} isSubmitting />);

    expect(screen.getByLabelText('タイトル')).toBeDisabled();
    expect(screen.getByLabelText('内容')).toBeDisabled();
    expect(screen.getByLabelText('今日の気分')).toBeDisabled();
    expect(screen.getByLabelText('タグ')).toBeDisabled();
    expect(screen.getByRole('button', { name: '保存' })).toBeDisabled();
  });
}); 