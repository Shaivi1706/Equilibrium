import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  return new NextResponse('👋 Hey there! This is the contact POST endpoint. Try sending a POST request instead!');
}

export async function POST(req: Request) {
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