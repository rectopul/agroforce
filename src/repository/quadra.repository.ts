import { prisma } from '../pages/api/db/db';

export class QuadraRepository {
  async create(data: any) {
    const quadra = await prisma.quadra.create({ data });
    return quadra;
  }

  async findOne(id: number) {
    const quadra = await prisma.quadra.findUnique({
      where: { id }
    });
    return quadra;
  }

  async update(id: number, data: any) {
    const quadra = await this.findOne(id);

    if (quadra !== null) {
      const result = await prisma.quadra.update({
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

    const count = await prisma.quadra.count({ where: where });

    const result: object | any = await prisma.quadra.findMany({
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
