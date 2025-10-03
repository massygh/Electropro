import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { id: "desc" } })
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!body?.email || !body?.role) {
    return NextResponse.json({ error: "email and role are required" }, { status: 400 })
  }
  const passwordHash = body.password ? await hash(String(body.password), 10) : null
  const user = await prisma.user.create({
    data: {
      name: body.name ?? null,
      email: String(body.email),
      role: String(body.role),
      password: passwordHash,
    },
  })
  return NextResponse.json(user, { status: 201 })
}


