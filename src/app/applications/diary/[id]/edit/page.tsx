import { DiaryForm } from "@/components/diary-form"

interface EditDiaryPageProps {
  params: {
    id: string
  }
}

interface DiaryData {
  title: string;
  content: string;
  mood?: string;
  tags?: string;
}

export default function EditDiaryPage({ params }: EditDiaryPageProps) {
  // This would typically fetch the diary entry from your database
  const initialData = {
    title: "今日の振り返り",
    content: "今日は新しいプロジェクトを始めました...",
    mood: "やる気満々",
    tags: "仕事,プロジェクト",
  }

  async function updateDiary(data: DiaryData) {
    "use server"
    // Here you would typically update the data in your database
    console.log("Updating diary entry:", params.id, data)
  }

  return (
    <div className="container max-w-2xl py-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">日記を編集</h1>
      <DiaryForm initialData={initialData} onSubmit={updateDiary} />
    </div>
  )
}

