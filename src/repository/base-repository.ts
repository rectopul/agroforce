import { PrismaClientManager } from '../shared/prisma/prismaClientManager';
import { TransactionScope } from '../shared/prisma/transactionScope';
import { prisma as primaDB } from '../pages/api/db/db';

export class BaseRepository {
  protected clientManager: any;
  protected transactionScope: any;


  setTransaction( clientManager: PrismaClientManager, transactionScope: TransactionScope) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
  }

  async create(data: object | any){
    return data;
  }

  async update(id: number, data: object | any){
    return data;
  }

  getPrisma() {
    return (this.clientManager)? this.clientManager.getClient() : primaDB;
  }

  async createTransaction(data: object | any){
    if (this.clientManager && this.transactionScope){
      return await this.transactionScope.run(async () => {
        return this.create(data);
      } );
    } else {
      throw new Error("Transação não encontrada!");
    }  
  }

  async updateTransaction(id: number, data: object | any){
    if (this.clientManager && this.transactionScope){
      return await this.transactionScope.run(async () => {
        return this.update(id, data);
      } );
    } else {
      throw new Error("Transação não encontrada!");
    }  
  }
}