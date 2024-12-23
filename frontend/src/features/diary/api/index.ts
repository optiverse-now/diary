import { getToken } from '@/features/auth/utils/token';
import { CreateDiaryInput, Diary, DiaryListResponse, UpdateDiaryInput } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createDiary = async (diary: CreateDiaryInput): Promise<Diary> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/diaries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(diary),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};

export const getDiary = async (id: string): Promise<Diary> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/diaries/${id}`, {
    method: 'GET',
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

export const updateDiary = async (id: string, diary: UpdateDiaryInput): Promise<Diary> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/diaries/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(diary),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};

export const deleteDiary = async (id: string): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/diaries/${id}`, {
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

export const getDiaries = async (page: number = 1): Promise<{ diaries: Diary[]; totalPages: number }> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/diaries?page=${page}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data: DiaryListResponse = await response.json();
  return {
    diaries: data.diaries,
    totalPages: data.pagination.total,
  };
};