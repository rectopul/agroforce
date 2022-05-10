import { prisma } from '../pages/api/db/db';

export class GenotipoRepository {
  async create(data: any) {
    const genotipo = await prisma.genotipo.create({ data });
    return genotipo;
  }

  async findByGenealogy(genealogy: any) {
    const genotipo = await prisma.genotipo.findFirst({
      where: { genealogy }
    });
    return genotipo;
  }

  async findOne(id: number) {
    const genotipo = await prisma.genotipo.findUnique({
      where: { id }
    });
    return genotipo;
  }

  async update(id: number, data: any) {
    const genotipo = await this.findOne(id);

    if (genotipo !== null) {
      const result = await prisma.genotipo.update({
        where: { id },
        data
      });
      return result;
    } else {
      return false;
    }
  }

  async list(id_culture: number) {
    const genotipo = await prisma.genotipo.findMany({
      where: { id_culture },
      select: {
        id: true,
        id_culture: true,
        genealogy: true,
        cruza: true,
        status: true,
      }
    });

    return genotipo;
  }

  async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy){
      order = JSON.parse(orderBy);
    }

    const count = await prisma.genotipo.count({ where: where });

    const result: object | any = await prisma.genotipo.findMany({
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
