import { prisma } from '../pages/api/db/db';
import {BaseRepository} from './base-repository';

export class CulturaRepository extends BaseRepository {
  async findOne(id: number) {
    const foco = await prisma.culture.findUnique({
      where: { id },
    });
    return foco;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.culture.count({ where });

    const result: object | any = await prisma.culture.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    result.total = count;
    return result;
  }

  async create(data: any) {
    const culture = await this.getPrisma().culture.create({ data });
    return culture;
  }

  async findByName(name: string) {
    const culture = await prisma.culture.findFirst({
      where: { name },
    });

    return culture;
  }

  async update(id: number, data: any) {
    const culture = await this.findOne(id);

    if (culture !== null) {
      const result = await this.getPrisma().culture.update({
        where: { id },
        data,
      });
      return result;
    }
    return false;
  }
}
