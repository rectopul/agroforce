import { prisma } from '../pages/api/db/db';

export class AllocatedExperimentRepository {
  async create(data: any) {
    const result = await prisma.allocatedExperiment.create({
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
    const result = await prisma.allocatedExperiment.update({
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
