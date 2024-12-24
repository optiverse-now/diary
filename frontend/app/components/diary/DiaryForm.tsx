'use client'

import { useState, useEffect } from 'react'
import Input from '../ui/input'
import Button from '../ui/button'
import TagInput from './TagInput'
import { cn } from '@/lib/utils'
import { getMoodTags, getCategoryTags } from '@/lib/api/tags'

interface Tag {
  id: string
  name: string
}

interface DiaryFormProps {
  initialData?: {
    title: string
    content: string
    moodIds: string[]
    tagIds: string[]
  }
  onSubmit: (data: {
    title: string
    content: string
    moodIds: string[]
    tagIds: string[]
  }) => Promise<void>
  isEditing?: boolean
}

export default function DiaryForm({ initialData, onSubmit, isEditing = false }: DiaryFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    moodIds: initialData?.moodIds || [],
    tagIds: initialData?.tagIds || [],
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [moodSuggestions, setMoodSuggestions] = useState<Tag[]>([])
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([])
  const [selectedMoods, setSelectedMoods] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])

  useEffect(() => {
    const fetchInitialTags = async () => {
      try {
        const [moods, tags] = await Promise.all([
          getMoodTags(),
          getCategoryTags()
        ])
        setMoodSuggestions(moods)
        setTagSuggestions(tags)

        // 初期値がある場合は選択済みタグを設定
        if (initialData) {
          const selectedMoods = moods.filter(mood => initialData.moodIds.includes(mood.id))
          const selectedTags = tags.filter(tag => initialData.tagIds.includes(tag.id))
          setSelectedMoods(selectedMoods)
          setSelectedTags(selectedTags)
        }
      } catch (err) {
        console.error('タグの取得に失敗しました:', err)
      }
    }

    fetchInitialTags()
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit({
        ...formData,
        moodIds: selectedMoods.map(mood => mood.id),
        tagIds: selectedTags.map(tag => tag.id),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleMoodSearch = async (query: string) => {
    try {
      const moods = await getMoodTags(query)
      setMoodSuggestions(moods)
    } catch (err) {
      console.error('気分タグの検索に失敗しました:', err)
    }
  }

  const handleTagSearch = async (query: string) => {
    try {
      const tags = await getCategoryTags(query)
      setTagSuggestions(tags)
    } catch (err) {
      console.error('カテゴリータグの検索に失敗しました:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル
        </label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="mt-1"
          placeholder="日記のタイトルを入力"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          内容
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows={10}
          className={cn(
            'mt-1 block w-full rounded-md border border-gray-200 p-2.5 text-gray-900',
            'focus:border-primary focus:ring-primary',
            'placeholder:text-gray-400'
          )}
          placeholder="今日はどんな一日でしたか？"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          気分タグ
        </label>
        <TagInput
          selectedTags={selectedMoods}
          onTagsChange={setSelectedMoods}
          suggestions={moodSuggestions}
          onSuggestionsFetch={handleMoodSearch}
          placeholder="気分タグを入力または選択"
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          カテゴリータグ
        </label>
        <TagInput
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          suggestions={tagSuggestions}
          onSuggestionsFetch={handleTagSearch}
          placeholder="カテゴリータグを入力または選択"
          className="mt-1"
        />
      </div>

      {error && (
        <div className="text-error text-sm">{error}</div>
      )}

      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? '保存中...' : isEditing ? '更新' : '作成'}
        </Button>
      </div>
    </form>
  )
} 