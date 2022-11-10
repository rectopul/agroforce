import { prisma } from '../pages/api/db/db';
import {BaseRepository} from './base-repository';

export class TecnologiaRepository extends BaseRepository {
  async findOne(id: number) {
    const result = await prisma.tecnologia.findUnique({
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
    const count = await prisma.tecnologia.count({ where });
    const result: object | any = await prisma.tecnologia.findMany({
      select, skip, take, where, orderBy: order,
    });
    result.total = count;
    return result;
  }

  async create(data: object | any) {
    const result = await this.getPrisma().tecnologia.create({ data });
    return true;
  }

  async update(id: number, data: Object) {
    const result = await this.getPrisma().tecnologia.update({
      where: {
        id,
      },
      data,
    });
    return true;
  }
}
