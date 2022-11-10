import { prisma } from '../pages/api/db/db';
import { BaseRepository } from '../repository/base-repository'

export class UnidadeCulturaRepository extends BaseRepository {
  async create(data: any) {
    const result = await this.getPrisma().cultureUnity.create({
      data,
    });

    return result;
  }

  async findById(id: number) {
    const result = await prisma.cultureUnity.findUnique({
      where: { id },
    });

    return result;
  }

  async update(id: number, data: any) {
    const result = await this.getPrisma().cultureUnity.update({
      where: { id },
      data,
    });
    return result;
  }

  async findByName({ name_unity_culture }: any) {
    const result = await prisma.cultureUnity.findFirst({
      where: {
        name_unity_culture,
      },
    });

    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    if (orderBy) {
      orderBy = JSON.parse(orderBy);
    }

    const count = await prisma.cultureUnity.count({ where });

    const result: object | any = await prisma.cultureUnity.findMany({
      select,
      skip,
      take,
      where,
      orderBy,
    });

    result.total = count;
    return result;
  }

  async delete(id: number) {
    const result = await prisma.cultureUnity.delete({ where: { id } });
    return result;
  }
}
