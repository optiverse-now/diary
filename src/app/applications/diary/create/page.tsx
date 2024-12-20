import { DiaryForm } from "@/components/diary-form"

interface DiaryData {
  title: string;
  content: string;
  mood?: string;
  tags?: string;
}

export default function CreateDiaryPage() {
  async function createDiary(data: DiaryData) {
    "use server"
    console.log("Creating diary entry:", data)
  }

  return (
    <div className="container max-w-2xl py-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">新規日記作成</h1>
      <DiaryForm onSubmit={createDiary} />
    </div>
  )
}

