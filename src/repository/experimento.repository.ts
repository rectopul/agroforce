import { prisma } from '../pages/api/db/db';

export class ExperimentoRepository {
  async create(data: any) {
    const experimento = await prisma.experimento.create({ data });
    return experimento;
  }
  async findOne(id: number) {
    const experimento = await prisma.experimento.findUnique({
      where: { id }
    });
    return experimento;
  }

  async update(id: number, data: any) {
    const experimento = await this.findOne(id);

    if (experimento !== null) {
      const result = await prisma.experimento.update({
        where: { id },
        data
      });
      return result;
    } else {
      return false;
    }
  }

  async list(id_culture: number) {
    const experimento = await prisma.experimento.findMany({
      where: { id_culture },
      select: {
        id: true,
        id_culture: true,
        cruza: true,
        status: true
      }
    });

    return experimento;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.experimento.count({ where });

    const result: object | any = await prisma.experimento.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order
    });

    result.total = count;
    return result;
  }
}
