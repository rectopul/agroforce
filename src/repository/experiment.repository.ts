import { prisma } from '../pages/api/db/db';

export class ExperimentRepository {
  async create(data: any) {
    const experiment = await prisma.experiment.create({ data });
    return experiment;
  }
  async findOne(id: number) {
    const experiment = await prisma.experiment.findUnique({
      where: { id },
      select: {
        id: true,
        protocol_name: true,
        experiment_id: true,
        experiment_name: true,
        safra: { select: { safraName: true } },
        culture: { select: { name: true } },
        foco: { select: { name: true } },
        tecnologia: { select: { cod_tec: true } },
        ensaio: { select: { name: true } },
        epoca: true,
        pjr: true,
        id_culture_unity: true,
        culture_unity_name: true,
        label: true,
        year: true,
        status: true,
      }
    });
    return experiment;
  }

  async update(id: number, data: any) {
    const experiment = await this.findOne(id);

    if (experiment !== null) {
      const result = await prisma.experiment.update({
        where: { id },
        data
      });
      return result;
    } else {
      return false;
    }
  }

  async list(id_culture: number) {
    const experiment = await prisma.experiment.findMany({
      where: { id_culture },
      select: {
        id: true,
        protocol_name: true,
        experiment_id: true,
        experiment_name: true,
        id_safra: true,
        id_culture: true,
        id_foco: true,
        id_ensaio: true,
        id_tecnologia: true,
        epoca: true,
        pjr: true,
        id_culture_unity: true,
        culture_unity_name: true,
        label: true,
        year: true,
        status: true,
      }
    });

    return experiment;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.experiment.count({ where });

    const result: object | any = await prisma.experiment.findMany({
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
