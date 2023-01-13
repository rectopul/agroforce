import { prisma } from '../pages/api/db/db';
import { BaseRepository } from './base-repository';

export class NpeRepository extends BaseRepository {
  async findOne(id: number) {
    const result = await prisma.npe.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        safraId: true,
        localId: true,
        prox_npe: true,
        local: { select: { name_local_culture: true } },
        safra: { select: { safraName: true } },
        foco: { select: { name: true, id: true } },
        epoca: true,
        tecnologia: { select: { name: true, id: true, cod_tec: true } },
        type_assay: { select: { name: true, id: true } },
        group: true,
        npei: true,
        npef: true,
        status: true,
        npeQT: true,
      },
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    if (orderBy) {
      orderBy = JSON.parse(orderBy);
    }
    const count = await prisma.npe.count({ where });
    const result: object | any = await prisma.npe.findMany({
      select, skip, take, where, orderBy,
    });
    result.total = count;
    return result;
  }

  async create(data: object | any) {
    const result = await prisma.npe.createMany({ data });
    return result;
  }

  async update(id: number, data: Object) {
    const result = await prisma.npe.update({
      where: {
        id,
      },
      data,
    });

    return result;
  }

  async queryRaw(query: any) {
    return prisma.$queryRaw`${query}`;
  }

  async delete(id: number) {
    const result = await prisma.npe.delete({ where: { id } });
    return result;
  }
}
