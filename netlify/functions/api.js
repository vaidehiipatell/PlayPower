import serverless from 'serverless-http'
import dotenv from 'dotenv'
import { connectDB } from '../../src/config/db.js'
import { buildApp } from '../../src/server.js'

dotenv.config()

let cached

async function getHandler() {
  if (!cached) {
    process.env.NETLIFY = 'true'
    await connectDB()
    const app = buildApp()
    cached = serverless(app)
  }
  return cached
}

export async function handler(event, context) {
  const h = await getHandler()
  return h(event, context)
}
