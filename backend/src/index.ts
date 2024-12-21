import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(
  '*',
  cors({
    allowMethods: ['GET', 'POST'],
    origin: 'http://localhost:3000',
  })
)

app.get('/', (c) => c.text('Hello Hono!'))
console.log(`Server is running on port ${process.env.PORT}`)

serve({
  fetch: app.fetch,
  port: 8080,
})
