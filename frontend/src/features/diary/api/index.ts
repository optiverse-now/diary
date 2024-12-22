import { getToken } from '@/features/auth/utils/token';

export type DiaryResponse = {
  id: string;
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diaries?page=${page}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('認証が必要です。再度ログインしてください');
    }
    if (response.status === 404) {
      throw new Error('日記が見つかりません');
    }
    const errorData = await response.json().catch(() => ({ error: '不明なエラーが発生しました' }));
    throw new Error(errorData.error || '日記の取得に失敗しました');
  }

  const data = await response.json();
  return {
    diaries: data.diaries,
    totalPages: data.pagination.total
  };
};

export const getDiary = async (id: string): Promise<DiaryResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diaries/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('日記が見つかりません');
    }
    throw new Error('日記の取得に失敗しました');
  }

  return response.json();
};

export const createDiary = async (input: CreateDiaryInput): Promise<DiaryResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diaries`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('認証が必要です');
    }
    throw new Error('日記の作成に失敗しました');
  }

  return response.json();
};

export const updateDiary = async (id: number, input: UpdateDiaryInput): Promise<DiaryResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diaries/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('日記が見つかりません');
    }
    throw new Error('日記の更新に失敗しました');
  }

  return response.json();
};

export const deleteDiary = async (id: number): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error('認証が必要です');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/diaries/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('日記が見つかりません');
    }
    throw new Error('日記の削除に失敗しました');
  }
};