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
    const result = await prisma.experiment_genotipe.findUnique({
      where: { id },
    });

    return result;
  }

  async replaceLote(idList: any, ncc :any, idLote: any, genetic_id: any) {
    const result = await prisma.experiment_genotipe.updateMany({
      where: {
        id: {
          in: idList,
        },
      },
      data: {
        nca: ncc,
        idGenotipo: genetic_id,
        idLote,
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

  async updateStatus(idList: number, status: string) {
    const result = await prisma.experiment_genotipe.updateMany({
      where: {
        idExperiment: {
          in: idList,
        },
      },
      data: {
        status,
      },
    });
    return result;
  }

  async printed(idList: number, status: string) {
    const result = await prisma.experiment_genotipe.updateMany({
      where: {
        id: {
          in: idList,
        },
      },
      data: {
        status,
      },
    });
    return result;
  }
}
