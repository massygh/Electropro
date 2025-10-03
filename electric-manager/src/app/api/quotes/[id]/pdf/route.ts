import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import PDFDocument from "pdfkit"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { id: Number(params.id) },
    include: { client: true },
  })

  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const doc = new PDFDocument()
  let buffers: Buffer[] = []
  doc.on("data", buffers.push.bind(buffers))
  doc.on("end", () => {})

  doc.fontSize(20).text(`Devis #${quote.id}`)
  doc.text(`Client: ${quote.client.name}`)
  doc.text(`Total: ${quote.total}€`)
  doc.end()

  const pdfBuffer = Buffer.concat(buffers)
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: { "Content-Type": "application/pdf" },
  })
}



