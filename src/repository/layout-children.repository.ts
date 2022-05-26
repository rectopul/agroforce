import { prisma } from '../pages/api/db/db';

export class LayoutChildrenRepository {
  async create(data: any) {
    const disparos = await prisma.layout_children.create({ data });
    return disparos;
  }

  async findByDisparo(genealogy: any) {
    const disparos = await prisma.layout_children.findFirst({
      where: { genealogy }
    });
    return disparos;
  }

  async findOne(id: number) {
    const disparos = await prisma.layout_children.findUnique({
      where: { id }
    });
    return disparos;
  }

  async update(id: number, data: any) {
    const disparos = await this.findOne(id);

    if (disparos !== null) {
      const result = await prisma.layout_children.update({
        where: { id },
        data
      });
      return result;
    } else {
      return false;
    }
  }

  async list(id_culture: number) {
    const disparos = await prisma.layout_children.findMany({
      where: { id_culture },
      select: {
        id: true,
        id_culture: true,
        genealogy: true,
        cruza: true,
        status: true,
      }
    });

    return disparos;
  }

  async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy){
      order = JSON.parse(orderBy);
    }

    const count = await prisma.layout_children.count({ where: where });

    const result: object | any = await prisma.layout_children.findMany({
      select: select, 
      skip: skip, 
      take: take, 
      where: where,
      orderBy: order
    });
    
    result.total = count;
    return result;
  }
}
