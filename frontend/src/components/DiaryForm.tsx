"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { diarySchema, type CreateDiaryInput } from "../lib/api/diary"

interface DiaryFormProps {
  initialData?: CreateDiaryInput
  onSubmit: (data: CreateDiaryInput) => Promise<void>
  isSubmitting?: boolean
}

export function DiaryForm({ initialData, onSubmit, isSubmitting = false }: DiaryFormProps) {
  const router = useRouter()
  const form = useForm<CreateDiaryInput>({
    resolver: zodResolver(diarySchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      mood: "",
      tags: "",
    },
  })

  const handleSubmit = async (data: CreateDiaryInput) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">タイトル</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} className="h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">内容</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={10} 
                    {...field} 
                    disabled={isSubmitting}
                    className="min-h-[200px] resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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