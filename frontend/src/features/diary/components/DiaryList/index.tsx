'use client'

import React from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ja } from 'date-fns/locale';
import type { DiaryResponse } from '@/features/diary/api';

type DiaryListProps = {
  diaries: DiaryResponse[];
  isLoading?: boolean;
  error?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

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
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  if (isLoading) {
    return <DiaryListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!diaries || diaries.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        日記がありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {diaries.map((diary) => (
        <Link
          key={diary.id}
          href={`/applications/diary/${diary.id}/show`}
          className="block transition-colors hover:bg-gray-50"
        >
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-1">{diary.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              {format(parseISO(diary.createdAt), 'PPP', { locale: ja })}
            </p>
            <p className="text-gray-600 line-clamp-3">{diary.content}</p>
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
        </Link>
      ))}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            前へ
          </button>
          <span className="flex items-center px-4">
            {currentPage} / {totalPages}
          </span>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}; 