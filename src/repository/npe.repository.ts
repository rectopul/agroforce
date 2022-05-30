import { prisma } from '../pages/api/db/db';

export class NpeRepository {
  async findOne(id: number) {
    let Result = await prisma.npe.findUnique({
      where: {
        id: id
      }
    })
    return Result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    let count = await prisma.npe.count({ where: where })
    const result: object | any = await prisma.npe.findMany({ select: select, skip: skip, take: take, where: where, orderBy: order });
    result.total = count;
    return result;
  }

  async create(NPE: object | any) {
    let Result = await prisma.npe.createMany({ data: NPE })
    return Result;
  }

  async update(id: number, NPE: Object) {
    let ExisNPE = await this.findOne(id);
    if (ExisNPE !== null) {
      let Result = await prisma.npe.update({
        where: {
          id: id
        },
        data: NPE
      })

      return Result;
    } else {
      return false;
    }
  }

  async queryRaw(query: any) {
    return await prisma.$queryRaw`${query}`;
  }
}

