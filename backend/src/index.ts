import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import diaryRouter from './routes/diary'

const app = new Hono()

app.use(
  '*',
  cors({
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: 'http://localhost:8080',
  })
)

app.route('/api', diaryRouter)
app.get('/api', (c) => c.text('Hello Hono!'))
console.log(`Server is running on port ${process.env.PORT}`)

serve({
  fetch: app.fetch,
  port: 8080,
})
