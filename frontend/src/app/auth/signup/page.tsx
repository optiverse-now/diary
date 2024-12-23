import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { SignUpForm } from '@/features/auth/components/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">新規登録</h1>
          <p className="text-gray-600 mt-2">
            既にアカウントをお持ちの場合は{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              ログイン
            </Link>
          </p>
        </div>

        <SignUpForm />
      </Card>
    </div>
  );
} 