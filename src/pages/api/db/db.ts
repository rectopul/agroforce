/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma
  || new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// prisma.$on('query', (e: any) => {
//   console.log(`Query: ${e.query}`);
//   console.log(`Params: ${e.params}`);
//   console.log(`Duration: ${e.duration}ms`);
// });
