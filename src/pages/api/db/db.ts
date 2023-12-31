/* eslint-disable no-unused-vars */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
import {Prisma, PrismaClient} from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma
  || new PrismaClient({
    log: [
      {
        emit: 'stdout',
        level: 'error',
      },
      /*{
        emit: 'event',
        level: 'query',
      }*/
    ],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// @ts-ignore
prisma.$on('query', (e: any) => {
  console.log(`Query: ${e.query}`);
  console.log(`Params: ${e.params}`);
  console.log(`Duration: ${e.duration}ms`);
});

/*
// https://github.com/prisma/studio/issues/614
// 
BigInt.prototype.toJSON = function() {
  return this.toString()
}*/
