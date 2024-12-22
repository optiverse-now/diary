import { z } from 'zod';

export const diarySchema = z.object({
  title: z.string().min(1, { message: 'タイトルを入力してください' }),
  content: z.string().min(1, { message: '内容を入力してください' }),
  mood: z.string().optional(),
  tags: z.string().optional(),
});

export type CreateDiaryInput = z.infer<typeof diarySchema>;

export interface Diary {
  id: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface DiaryListProps {
  diaries: Diary[];
  isLoading?: boolean;
  error?: string;
  onDelete?: (id: string) => void;
}

export interface DiaryFormProps {
  initialData?: CreateDiaryInput;
  onSubmit: (data: CreateDiaryInput) => Promise<void>;
  isSubmitting?: boolean;
} 