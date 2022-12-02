import { prisma } from '../pages/api/db/db';

export class LogImportRepository {
  async create(data: any) {
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
    const result = await prisma.log_import.updateMany({
      where: {
        status: 2,
      },
      data: {
        status: 1,
      },
    });
    return result;
  }
}
