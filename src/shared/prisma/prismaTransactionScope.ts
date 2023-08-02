import { Prisma, PrismaClient } from '@prisma/client';

import * as cls from 'cls-hooked';
import { TransactionScope } from './transactionScope';

export const PRISMA_CLIENT_KEY = 'prisma';

export class PrismaTransactionScope implements TransactionScope {
  private readonly prisma: PrismaClient;

  private readonly transactionContext: cls.Namespace;

  constructor(prisma: PrismaClient, transactionContext: cls.Namespace) {
    // inject the original Prisma Client to use when you actually create a transaction
    this.prisma = prisma;
    // A CLS namespace to temporarily save the Transaction Prisma Client
    this.transactionContext = transactionContext;
  }

  async run(fn: () => Promise<any>): Promise<any> {
    // attempt to get the Transaction Client
    const prisma = this.transactionContext.get(
      PRISMA_CLIENT_KEY,
    ) as Prisma.TransactionClient;

    // if the Transaction Client
    if (prisma) {
      // exists, there is no need to create a transaction and you just execute the callback
      return await fn();
    } else {
      await this.prisma.$executeRaw`SET TRANSACTION ISOLATION LEVEL READ COMMITTED`;
      await this.prisma.$executeRaw`SET wait_timeout=3600000`;
      await this.prisma.$executeRaw`SET interactive_timeout=3600000`;
      // await this.prisma.$executeRaw`SET max_statement_time=60000`; 
      // does not exist, create a Prisma transaction 
      await this.prisma.$transaction(async (prisma) => {
        await this.transactionContext.runPromise(async () => {
          // and save the Transaction Client inside the CLS namespace to be retrieved later on
          this.transactionContext.set(PRISMA_CLIENT_KEY, prisma);

          try {
            // execute the transaction callback
            return await fn();
          } catch (err) {
            // unset the transaction client when something goes wrong
            this.transactionContext.set(PRISMA_CLIENT_KEY, null);
            throw err;
          }
        });
      }, {
        maxWait: (3600000 * 3), // default: 2000 === 3600000 ms == 1 hr => 1 hora * 3
        timeout: (3600000 * 3), // default: 5000 === 3600000 ms == 1 hr => 1 hora * 3
      });
    }
  }
}
