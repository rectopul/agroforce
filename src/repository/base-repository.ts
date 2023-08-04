import { PrismaClientManager } from '../shared/prisma/prismaClientManager';
import { TransactionScope } from '../shared/prisma/transactionScope';
import {prisma, prisma as primaDB} from '../pages/api/db/db';
import {PrismaTransactionScope} from "../shared/prisma/prismaTransactionScope";

export class BaseRepository {
  
  protected clientManager: PrismaClientManager | null = null;
  
  protected transactionScope: PrismaTransactionScope | null = null;
  
  setTransaction(clientManager: PrismaClientManager, transactionScope: PrismaTransactionScope) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
  }
  
  isTransaction() {
    return this.transactionScope && this.clientManager;
  }

  async create(data: object | any) {
    return data;
  }

  async update(id: number, data: object | any) {
    return data;
  }

  async delete(id: number): Promise<any> {
    return {};
  }
  
  async deleteAll(data: any) {
    return data;
  }

  getPrisma() {
    return (this.clientManager) ? this.clientManager.getClient() : primaDB;
  }

  async createTransaction(data: object | any) {
    if (this.clientManager && this.transactionScope) {
      return await this.transactionScope.run(async () => this.create(data));
    }
    throw new Error('Transação não encontrada!');
  }

  async updateTransaction(id: number, data: object | any) {
    if (this.clientManager && this.transactionScope) {
      return await this.transactionScope.run(async () => this.update(id, data));
    }
    throw new Error('Transação não encontrada!');
  }

  async deleteTransaction(id: number) {
    if (this.clientManager && this.transactionScope) {
      return await this.transactionScope.run(async () => this.delete(id));
    }
    throw new Error('Transação não encontrada!');
  }

  async deleteAllTransaction(data: any) {
    if (this.clientManager && this.transactionScope) {
      return await this.transactionScope.run(async () => this.deleteAll(data));
    }
    throw new Error('Transação não encontrada!');
  }
  
}
