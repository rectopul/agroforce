import { prisma } from '../pages/api/db/db';

export class LogImportRepository {
  async create(data: any) {
    if (!data.updated_at) {
      data.updated_at = null; // set explicitly to null
    }
    const result = await prisma.log_import.create({
      data,
    });

    return result;
  }

  async findById(id: number) {
    const result = await prisma.log_import.findUnique({
      where: { id },
    });

    return result;
  }

  async update(
    id: number,
    data: any,
  ) {
    console.log('🚀 ~ file: log-import.repository.ts:27 ~ LogImportRepository ~ data', data);
    if (!data.updated_at) {
      data.updated_at = null;
    }
    console.log('🚀 ~ file: log-import.repository.ts:29 ~ LogImportRepository ~ data', data);
    const result = await prisma.log_import.update({
      where: { id },
      data,
    });
    return result;
  }

  async validateImportInExecuting() {
    const result = await prisma.log_import.findFirst({
      where: {
        status: 2,
      },
    });

    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.log_import.count({ where });

    const result: object | any = await prisma.log_import.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    result.total = count;
    return result;
  }

  async reset() {
    const first = await prisma.log_import.findMany({
      where: {
        state: 'EM ANDAMENTO',
      },
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });
    const result = await prisma.log_import.update({
      where: {
        id: first[0]?.id,
      },
      data: {
        status: 1,
        state: 'CANCELADO MANUALMENTE',
      },
    });
    return result;
  }
}
