import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">ログイン</h1>
          <p className="text-gray-600 mt-2">
            アカウントをお持ちでない場合は{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              新規登録
            </Link>
          </p>
        </div>

        <LoginForm />
      </Card>
    </div>
  );
} 