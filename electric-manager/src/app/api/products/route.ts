import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { id: "desc" } })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()
  if (!body?.sku || !body?.name) {
    return NextResponse.json({ error: "sku and name are required" }, { status: 400 })
  }
  const product = await prisma.product.create({
    data: {
      sku: String(body.sku),
      name: String(body.name),
      quantity: Number(body.quantity ?? 0),
      costPrice: Number(body.costPrice ?? 0),
      salePrice: Number(body.salePrice ?? 0),
      lowStockThreshold: Number(body.lowStockThreshold ?? 5),
    },
  })
  return NextResponse.json(product, { status: 201 })
}


