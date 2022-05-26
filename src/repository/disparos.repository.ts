import { prisma } from '../pages/api/db/db';

export class DisparoRepository {
  async create(data: any) {
    const disparos = await prisma.disparos.create({ data });
    return disparos;
  }

  async findOne(id: number) {
    const disparos = await prisma.disparos.findUnique({
      where: { id }
    });
    return disparos;
  }

  async update(id: number, data: any) {
    const disparos = await this.findOne(id);

    if (disparos !== null) {
      const result = await prisma.disparos.update({
        where: { id },
        data
      });
      return result;
    } else {
      return false;
    }
  }

  async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy){
      order = JSON.parse(orderBy);
    }

    const count = await prisma.disparos.count({ where: where });

    const result: object | any = await prisma.disparos.findMany({
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
