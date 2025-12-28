import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter: new PrismaLibSql({
      url: process.env.DATABASE_URL!, // file:./dev.db
    }),
  })
}

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

