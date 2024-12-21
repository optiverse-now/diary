'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '../../../components/atoms/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/molecules/FormField'
import { Input } from '../../../components/atoms/Input'
import { type CreateDiaryInput } from '../../../features/diary/types'

const formSchema = z.object({
  title: z.string().min(1, '必須項目です'),
  content: z.string().min(1, '必須項目です'),
  mood: z.string().optional(),
  tags: z.string().optional(),
})

type DiaryFormProps = {
  initialData?: CreateDiaryInput
  onSubmit: (data: CreateDiaryInput) => Promise<void>
  isSubmitting?: boolean
}

export function DiaryForm({ initialData, onSubmit, isSubmitting = false }: DiaryFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      content: initialData?.content ?? '',
      mood: initialData?.mood ?? '',
      tags: initialData?.tags?.join(',') ?? '',
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const data: CreateDiaryInput = {
      title: values.title,
      content: values.content,
      mood: values.mood || undefined,
      tags: values.tags ? values.tags.split(',').map((tag) => tag.trim()) : undefined,
    }
    await onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">タイトル</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="今日の出来事" 
                  disabled={isSubmitting}
                  className="h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">内容</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={10}
                  placeholder="今日はどんな1日でしたか？"
                  disabled={isSubmitting}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">今日の気分</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="例: 楽しい、疲れた、やる気満々" 
                    disabled={isSubmitting}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">タグ</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="カンマ区切りでタグを入力" 
                    disabled={isSubmitting}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-32"
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-32">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存
          </Button>
        </div>
      </form>
    </Form>
  )
} 