import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(clients)
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 })
  }
  const client = await prisma.client.create({
    data: {
      name: body.name,
      phone: body.phone ?? null,
      email: body.email ?? null,
      address: body.address ?? null,
      notes: body.notes ?? null,
    },
  })
  return NextResponse.json(client, { status: 201 })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const cid = Number(id)
  const countJobs = await prisma.job.count({ where: { clientId: cid } })
  if (countJobs > 0) return NextResponse.json({ error: 'client has related jobs' }, { status: 409 })
  await prisma.client.delete({ where: { id: cid } })
  return NextResponse.json({ ok: true })
}


