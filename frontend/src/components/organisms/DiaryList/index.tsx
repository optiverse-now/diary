'use client'

import React from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Card } from '@/components/atoms/Card';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ja } from 'date-fns/locale';
import { Button } from '@/components/atoms/Button';
import { Pencil } from 'lucide-react';
import { DiaryListProps } from '@/features/diary/types';

const DiaryListSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="p-4">
          <div data-testid="diary-skeleton">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export const DiaryList: React.FC<DiaryListProps> = ({
  diaries,
  isLoading = false,
  error,
}) => {
  if (isLoading) {
    return <DiaryListSkeleton />;
  }

  if (!diaries || diaries.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        日記がありません
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {diaries.map((diary) => (
        <Card key={diary.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <Link
                href={`/applications/diary/${diary.id}/show`}
                className="text-lg font-medium hover:underline"
              >
                {diary.title}
              </Link>
              <p className="text-sm text-gray-500">
                {format(parseISO(diary.createdAt), 'PPP', { locale: ja })}
              </p>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/applications/diary/${diary.id}/edit`}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">編集する</span>
              </Link>
            </Button>
          </div>
          <p className="mt-2 text-gray-600 line-clamp-3">{diary.content}</p>
          {(diary.mood || diary.tags) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {diary.mood && (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {diary.mood}
                </span>
              )}
              {diary.tags && diary.tags.split(',').map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}; 