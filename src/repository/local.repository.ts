import { prisma } from '../pages/api/db/db';
import {BaseRepository} from '../repository/base-repository'

export class LocalRepository extends BaseRepository {
  async findOne(id: number) {
    const result = await prisma.local.findUnique({
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
    const count = await prisma.local.count({ where });
    const result: object | any = await prisma.local.findMany({
      select, skip, take, where, orderBy: order,
    });
    result.total = count;
    return result;
  }

  async create(data: object | any) {
    const result = await this.getPrisma().local.create({ data });
    return result;
  }

  async update(id: number, data: Object) {
    const result = await this.getPrisma().local.update({
      where: { id },
      data,
    });

    return result;
  }
}
