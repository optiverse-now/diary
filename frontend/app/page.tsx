import Header from './components/common/Header'

export default function Home() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">あなたの日記を書き始めましょう</h1>
        <p className="text-lg text-gray-600 mb-8">
          日々の出来事や感情を記録し、自分自身を振り返るための場所です。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">感情を記録</h2>
            <p className="text-gray-600">
              その日の気分や感情をタグで記録できます。過去の感情の変化を振り返ることができます。
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">カテゴリで整理</h2>
            <p className="text-gray-600">
              日記にカテゴリタグを付けて整理できます。後���ら見返すときに便利です。
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">プライバシー保護</h2>
            <p className="text-gray-600">
              あなたの日記は安全に保護されます。他人に見られる心配はありません。
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 