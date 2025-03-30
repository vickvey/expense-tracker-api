import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis; // Ensures compatibility with hot reload in development

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn']
        : ['error', 'info', 'query', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
