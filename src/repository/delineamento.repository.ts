import { prisma } from '../pages/api/db/db';
import { BaseRepository } from './base-repository';

export class DelineamentoRepository extends BaseRepository {
  async findOne(id: number) {
    const Result = await this.getPrisma().delineamento.findUnique({
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
    const count = await this.getPrisma().delineamento.count({ where });
    const Result: object | any = await this.getPrisma().delineamento.findMany({
      select, skip, take, where, orderBy: order,
    });
    Result.total = count;

    return Result;
  }

  async create(Local: object | any) {
    Local.created_at = new Date();
    const Result = await this.getPrisma().delineamento.create({ data: Local });
    return Result;
  }

  async update(id: number, Local: Object) {
    const ExisLocal = await this.findOne(id);
    if (ExisLocal !== null) {
      const Result = await this.getPrisma().delineamento.update({
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
