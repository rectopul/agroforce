import { prisma } from '../pages/api/db/db';
import { GenotipoRepository } from './genotipo.repository';
import { BaseRepository } from './base-repository';

export class LoteRepository extends BaseRepository {
  genotipoRepository = new GenotipoRepository();

  async create(data: any) {
    const lote = await this.getPrisma().lote.create({ data });

    return lote;
  }

  async findById(id: number) {
    const lote = await prisma.lote.findUnique({
      where: { id },
    });

    return lote;
  }

  async update(id: number, data: any) {
    const lote = await this.findById(id);

    if (lote !== null) {
      const result = await this.getPrisma().lote.update({
        where: { id },
        data,
      });
      return result;
    }
    return false;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.lote.count({ where });

    const result: object | any = await prisma.lote.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    result.total = count;
    return result;
  }
}
