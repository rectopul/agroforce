import { PrismaClient } from '@prisma/client';
import * as cls from 'cls-hooked';
import { PrismaClientManager } from './prismaClientManager';
import { PrismaTransactionScope } from './prismaTransactionScope';

export class TransactionConfig {
  public transactionContext;

  public prisma = new PrismaClient();

  public transactionScope: PrismaTransactionScope;
  
  public clientManager: PrismaClientManager;

  constructor() {
    this.transactionContext = cls.createNamespace('transaction');
    this.transactionScope = new PrismaTransactionScope(this.prisma, this.transactionContext);
    this.clientManager = new PrismaClientManager(this.prisma, this.transactionContext);
  }
}
