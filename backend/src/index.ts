import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import diaryRouter from './routes/diary'

const app = new Hono()

app.use('*', cors({
  origin: 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type'],
}));

app.route('/api/diaries', diaryRouter)
app.get('/api', (c) => c.text('Hello Hono!'))
console.log(`Server is running on port ${process.env.PORT}`)

serve({
  fetch: app.fetch,
  port: 8080,
})
