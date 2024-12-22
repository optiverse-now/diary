import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './routes/auth';
import diary from './routes/diary';

const app = new Hono();

// 環境変数の検証
const requiredEnvVars = ['PORT', 'JWT_SECRET', 'DATABASE_URL', 'FRONTEND_URL'] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`環境変数${envVar}が設定されていません`);
  }
}

const frontendUrl = process.env.FRONTEND_URL as string;

// CORSの設定
app.use('/*', cors({
  origin: frontendUrl,
  credentials: true,
}));

// ルートの設定
app.route('/api/auth', auth);
app.route('/api/diaries', diary);

// サーバーの起動
const port = process.env.PORT || 8080;
console.log(`Server is running on port ${port} (${process.env.NODE_ENV} mode)`);

serve({
  fetch: app.fetch,
  port: Number(port),
});
