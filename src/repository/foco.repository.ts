import { prisma } from '../pages/api/db/db';

export class FocoRepository {
  async create(data: any) {
    const result = await prisma.foco.create({ data });
    return result;
  }

  async findOne(id: number) {
    const result = await prisma.foco.findUnique({
      where: { id },
    });
    return result;
  }

  async findByName(data: any) {
    const result = await prisma.foco.findFirst({
      where: {
        name: data.name,
        id_culture: data.id_culture,
      },
    });
    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.foco.update({
      where: { id },
      data,
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    if (orderBy) {
      orderBy = JSON.parse(orderBy);
    }

    const count = await prisma.foco.count({ where });

    const result: object | any = await prisma.foco.findMany({
      select,
      skip,
      take,
      where,
      orderBy,
    });

    result.total = count;
    return result;
  }
}
