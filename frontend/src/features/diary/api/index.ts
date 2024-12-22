import { getToken } from '@/features/auth/utils/token';

export type DiaryResponse = {
  id: number;
  title: string;
  content: string;
  mood?: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
};

export type DiaryListResponse = {
  diaries: DiaryResponse[];
  totalPages: number;
};

export type CreateDiaryInput = {
  title: string;
  content: string;
};

export type UpdateDiaryInput = {
  title: string;
  content: string;
};

export const getDiaries = async (page = 1): Promise<DiaryListResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch(`/api/diaries?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};

export const getDiary = async (id: number): Promise<DiaryResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch(`/api/diaries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};

export const createDiary = async (input: CreateDiaryInput): Promise<DiaryResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch('/api/diaries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};

export const updateDiary = async (id: number, input: UpdateDiaryInput): Promise<DiaryResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch(`/api/diaries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};

export const deleteDiary = async (id: number): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch(`/api/diaries/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
};