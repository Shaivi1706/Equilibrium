import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  return new NextResponse('Page is working')
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json()
    const { email, message } = body
    
    const saved = await prisma.contactMessage.create({
      data: { email, message },
    })
    
    return NextResponse.json({ status: 'success', saved })
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: (error as Error).message },
      { status: 500 }
    )
  }
}