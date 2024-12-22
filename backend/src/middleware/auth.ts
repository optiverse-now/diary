import { Context, Next } from 'hono';
import { verifyToken } from '../lib/auth';

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: '認証が必要です' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return c.json({ error: '無効なトークンです' }, 401);
  }

  c.set('userId', decoded.userId);
  await next();
}; 