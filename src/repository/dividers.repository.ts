import { prisma } from '../pages/api/db/db';

export class DisparoRepository {
  async create(data: any) {
    const result = await prisma.dividers.create({ data });
    return result;
  }

  async findOne(id: number) {
    const result = await prisma.dividers.findUnique({
      where: { id },
    });
    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.dividers.update({
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

    const count = await prisma.dividers.count({ where });

    const result: object | any = await prisma.dividers.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    result.total = count;
    return result;
  }
}
