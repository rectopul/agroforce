import { PrismaClient } from '@prisma/client';
import {PrismaClientManager} from "../shared/prisma/prismaClientManager";
import {TransactionScope} from "../shared/prisma/transactionScope";

const prisma = new PrismaClient();

export abstract class BaseController {

  protected clientManager: any;
  protected transactionScope: any;
  
  protected isTransactioned: boolean = false;
  
  setTransactioned(isTransactioned: boolean) {
    this.isTransactioned = isTransactioned;
  }
  
  isTransaction() {
    return this.isTransactioned;
  }
  
  setTransaction(clientManager: PrismaClientManager, transactionScope: TransactionScope) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
  }
  
}