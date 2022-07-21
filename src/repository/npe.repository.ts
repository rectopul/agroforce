import { prisma } from '../pages/api/db/db';

export class NpeRepository {
  async findOne(id: number) {
    const result = await prisma.npe.findUnique({
      where: {
        id,
      },
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    if (orderBy) {
      orderBy = JSON.parse(orderBy);
    }
    const count = await prisma.npe.count({ where });
    const result: object | any = await prisma.npe.findMany({
      select, skip, take, where, orderBy,
    });
    result.total = count;
    return result;
  }

  async create(data: object | any) {
    const result = await prisma.npe.create({ data });
    return result;
  }

  async update(id: number, data: Object) {
    const result = await prisma.npe.update({
      where: {
        id,
      },
      data,
    });

    return result;
  }

  async queryRaw(query: any) {
    return await prisma.$queryRaw`${query}`;
  }
}
