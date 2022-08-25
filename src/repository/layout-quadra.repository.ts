import { prisma } from '../pages/api/db/db';

export class LayoutQuadraRepository {
  async findOne(id: number) {
    const result = await prisma.layout_quadra.findUnique({
      where: {
        id,
      },
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const count = await prisma.layout_quadra.count({ where });
    const result: object | any = await prisma.layout_quadra.findMany({
      select, skip, take, where, orderBy: order,
    });
    result.total = count;
    return result;
  }

  async create(Local: object | any) {
    const result = await prisma.layout_quadra.create({ data: Local });
    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.layout_quadra.update({
      where: {
        id,
      },
      data,
    });
    return result;
  }
}
