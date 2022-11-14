import { prisma } from '../pages/api/db/db';
import {BaseRepository} from './base-repository';

export class AllocatedExperimentRepository extends BaseRepository {
  async create(data: any) {
    const result = await this.getPrisma().allocatedExperiment.create({
      data,
    });

    return result;
  }

  async findById(id: number) {
    const result = await prisma.allocatedExperiment.findUnique({
      where: { id },
    });

    return result;
  }

  async update(id: number, data: any) {
    const result = await this.getPrisma().allocatedExperiment.update({
      where: { id },
      data,
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    if (orderBy) {
      orderBy = JSON.parse(orderBy);
    }
    const count = await prisma.allocatedExperiment.count({ where });

    const result: object | any = await prisma.allocatedExperiment.findMany({
      select,
      skip,
      take,
      where,
      orderBy,
    });

    result.total = count;
    return result;
  }
}
