import { prisma } from '../pages/api/db/db';

export class SafraRepository {
  async create(data: any) {
    const result = await prisma.safra.create({ data });
    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.safra.update({
      where: { id },
      data,
    });
    return result;
  }

  async findOne(id: number) {
    const result = await prisma.safra.findUnique({
      where: { id },
    });
    return result;
  }

  async findBySafraName(data: any) {
    const result = await prisma.safra.findFirst({
      where: {
        safraName: data.safraName,
        id_culture: data.id_culture,
      },
    });

    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.safra.count({ where });

    const result: object | any = await prisma.safra.findMany({
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
