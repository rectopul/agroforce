import { prisma } from '../pages/api/db/db';
import { BaseRepository } from './base-repository';
export class PrintHistoryRepository extends BaseRepository {
  async create(data: any) {
    const result = await prisma.printHistory.create({ data });
    return result;
  }

  async findById(id: number) {
    const result = await prisma.printHistory.findUnique({
      where: { id },
    });

    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.printHistory.update({
      where: { id },
      data,
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.printHistory.count({ where });

    const result: object | any = await prisma.printHistory.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    result.total = count;
    return result;
  }

  async deleteMany(idList: any) {
    const result = await prisma.printHistory.deleteMany({
      where: {
        id: {
          in: idList,
        },
      },
    });
    return result;
  }
}
