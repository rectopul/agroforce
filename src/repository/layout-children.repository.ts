import { prisma } from '../pages/api/db/db';

export class LayoutChildrenRepository {
  async create(data: any) {
    const result = await prisma.layout_children.create({ data });
    return result;
  }

  async findOne(id: number) {
    const result = await prisma.layout_children.findUnique({
      where: { id },
    });
    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.layout_children.update({
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

    const count = await prisma.layout_children.count({ where });

    const result: object | any = await prisma.layout_children.findMany({
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
