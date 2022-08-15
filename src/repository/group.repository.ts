import { prisma } from '../pages/api/db/db';

export class GroupRepository {
  async create(data: any) {
    const result = await prisma.group.create({
      data,
    });

    return result;
  }

  async findById(id: number) {
    const result = await prisma.group.findUnique({
      where: { id },
      select: {
        id: true,
        foco: { select: { name: true, id: true } },
        safra: { select: { safraName: true, id: true } },
        group: true,
      },
    });

    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.group.update({
      where: { id },
      data,
    });
    return result;
  }

  async findByData(data: any) {
    const result = await prisma.group.findFirst({
      where: {
        id_safra: data.id_safra,
        id_foco: data.id_foco,
      },
    });

    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.group.count({ where });

    const result: object | any = await prisma.group.findMany({
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
