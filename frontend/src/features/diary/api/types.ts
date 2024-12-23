export type Diary = {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDiaryInput = {
  title: string;
  content: string;
  mood: string;
  tags: string;
};

export type UpdateDiaryInput = {
  title: string;
  content: string;
  mood: string;
  tags: string;
  id?: string;
};

export type DiaryListResponse = {
  diaries: Diary[];
  pagination: {
    total: number;
  };
}; 