import { prisma } from '../pages/api/db/db';

export class LayoutChildrenRepository {
  async create(data: any) {
    const disparos = await prisma.layout_children.create({ data });
    return disparos;
  }

  async findOne(id: number) {
    const disparos = await prisma.layout_children.findUnique({
      where: { id },
    });
    return disparos;
  }

  async update(id: number, data: any) {
    const disparos = await this.findOne(id);

    if (disparos !== null) {
      const result = await prisma.layout_children.update({
        where: { id },
        data,
      });
      return result;
    }
    return false;
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
