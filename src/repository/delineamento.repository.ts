import { prisma } from '../pages/api/db/db';

export class DelineamentoRepository {
  async findOne(id: number) {
    const Result = await prisma.delineamento.findUnique({
      where: {
        id,
      },
    });
    return Result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const count = await prisma.delineamento.count({ where });
    const Result: object | any = await prisma.delineamento.findMany({
      select, skip, take, where, orderBy: order,
    });
    Result.total = count;
    return Result;
  }

  async create(Local: object | any) {
    Local.created_at = new Date();
    const Result = await prisma.delineamento.create({ data: Local });
    return Result;
  }

  async update(id: number, Local: Object) {
    const ExisLocal = await this.findOne(id);
    if (ExisLocal !== null) {
      const Result = await prisma.delineamento.update({
        where: {
          id,
        },
        data: Local,
      });

      return Result;
    }
    return false;
  }
}
