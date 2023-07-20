import {PrismaClient} from '@prisma/client';
import {PrismaClientManager} from "../shared/prisma/prismaClientManager";
import {PrismaTransactionScope} from "../shared/prisma/prismaTransactionScope";

const prisma = new PrismaClient();

export abstract class BaseController {

  protected clientManager: PrismaClientManager | null = null;
  protected transactionScope: PrismaTransactionScope | null = null;
  
  protected isTransactioned: boolean = false;
  
  setTransactioned(isTransactioned: boolean) {
    this.isTransactioned = isTransactioned;
  }
  
  isTransaction() {
    return this.isTransactioned;
  }
  
  setTransaction(clientManager: PrismaClientManager, transactionScope: PrismaTransactionScope) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
  }
  
}