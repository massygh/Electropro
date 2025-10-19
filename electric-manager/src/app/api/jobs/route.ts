import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const jobs = await prisma.job.findMany({ include: { client: true } })
  return NextResponse.json(jobs)
}

export async function POST(req: Request) {
  const body = await req.json()
  const job = await prisma.job.create({ data: body })
  return NextResponse.json(job)
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.job.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const id = Number(body?.id)
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const data: any = {}
  if (typeof body.title === 'string') data.title = body.title
  if (typeof body.status === 'string') data.status = body.status
  if (typeof body.assignedToId === 'number' || body.assignedToId === null) data.assignedToId = body.assignedToId
  if (typeof body.scheduledAt === 'string') data.scheduledAt = new Date(body.scheduledAt)
  if (typeof body.description === 'string' || body.description === null) data.description = body.description
  if (typeof body.address === 'string' || body.address === null) data.address = body.address
  if (typeof body.clientId === 'number') data.clientId = body.clientId
  const updated = await prisma.job.update({ where: { id }, data })
  return NextResponse.json(updated)
}



