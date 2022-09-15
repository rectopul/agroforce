import { prisma } from '../pages/api/db/db';

export class ExperimentGenotipeRepository {

  async createMany(data: any) {
    const result = await prisma.experiment_genotipe.createMany({ data });
    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.experiment_genotipe.update({
      where: { id },
      data,
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    if (orderBy) {
      orderBy = JSON.parse(orderBy);
    }

    const count = await prisma.experiment_genotipe.count({ where });

    const result: object | any = await prisma.experiment_genotipe.findMany({
      select,
      skip,
      take,
      where,
      orderBy,
    });

    result.total = count;
    return result;
  }


  async findById(id: number) {
    const experiment_genotipe = await prisma.experiment_genotipe.findUnique({
      where: { id },
    });

    return experiment_genotipe;
  }

  async replaceLote(idList: any, idLote: any, geneticName: any) {

    const result = await prisma.experiment_genotipe.updateMany({
      where: {
        id: {
          in: idList,
        },
      },
      data: {
        nca: idLote,
        // name_genotipo: geneticName,
      },
    });
    return result;
  }

  async replaceGenotype(idList: any, idGenotype: any) {

    const result = await prisma.experiment_genotipe.updateMany({
      where: {
        id: {
          in: idList,
        },
      },
      data: {
        // name_genotipo: idGenotype,
      },
    });
    return result;
  }
}
