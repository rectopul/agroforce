import { Prisma, PrismaClient } from '@prisma/client';
import * as cls from 'cls-hooked';
import { PRISMA_CLIENT_KEY } from './prismaTransactionScope';

/**
 * Classe `PrismaClientManager` é responsável por gerenciar o acesso ao Prisma Client,
 * permitindo o uso de transações dentro de um contexto específico.
 */
export class PrismaClientManager {
  private prisma: PrismaClient;

  private transactionContext: cls.Namespace;

  /**
   * Construtor da classe `PrismaClientManager`.
   * @param prisma Instância do Prisma Client.
   * @param transactionContext Espaço de nome (namespace) usado para armazenar dados de transações.
   */
  constructor(prisma: PrismaClient, transactionContext: cls.Namespace) {
    this.prisma = prisma;
    this.transactionContext = transactionContext;
  }

  /**
   * Método `getClient` é usado para obter uma instância do Prisma Client que pode ser
   * usada dentro do contexto atual.
   * @returns Instância do Prisma Client associada ao contexto de transação, se existir.
   * Caso contrário, retorna a instância do Prisma Client padrão.
   */
  getClient(): Prisma.TransactionClient {
    const prisma = this.transactionContext.get(
      PRISMA_CLIENT_KEY,
    ) as Prisma.TransactionClient;
    
    // Verifica se uma instância do Prisma Client está armazenada no contexto de transação
    if (prisma) {
      return prisma;
    }
    
    // Retorna a instância do Prisma Client padrão, não associada a uma transação específica
    return this.prisma;
  }
}
