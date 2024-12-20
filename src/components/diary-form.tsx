"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  content: z.string().min(1, "内容を入力してください"),
  mood: z.string().optional(),
  tags: z.string().optional(),
})

interface DiaryFormProps {
  initialData?: z.infer<typeof formSchema>
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>
}

export function DiaryForm({ initialData, onSubmit }: DiaryFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      mood: "",
      tags: "",
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(data)
      router.push("/applications/diary")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>内容</FormLabel>
              <FormControl>
                <Textarea rows={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>今日の気分</FormLabel>
              <FormControl>
                <Input {...field} placeholder="例: 楽しい、疲れた、やる気満々" />
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
              <FormLabel>タグ</FormLabel>
              <FormControl>
                <Input {...field} placeholder="カンマ区切りでタグを入力" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            キャンセル
          </Button>
          <Button type="submit">保存</Button>
        </div>
      </form>
    </Form>
  )
}