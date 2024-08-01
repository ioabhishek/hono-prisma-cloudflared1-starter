import { PrismaD1 } from "@prisma/adapter-d1"
import { PrismaClient } from "@prisma/client"

import { Hono } from "hono"

export interface Env {
  DB: D1Database
}

const app = new Hono<{ Bindings: CloudflareEnv }>()

app.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB)
  const prisma = new PrismaClient({ adapter })
  const users = await prisma.user.findMany()
  return c.json(users)
})

app.post("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB)
  const prisma = new PrismaClient({ adapter })
  const { email, name } = await c.req.json()

  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  })

  return c.json(user)
})

export default app
