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



