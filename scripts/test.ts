// scripts/test.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const messages = await prisma.contactMessage.findMany()
  console.log(messages)
}

main()