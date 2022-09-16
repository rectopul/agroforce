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
        idAssayList: true,
        density: true,
        period: true,
        repetitionsNumber: true,
        experimentName: true,
        experimentGroupId: true,
        status: true,
        nlp: true,
        clp: true,
        eel: true,
        comments: true,
        orderDraw: true,
        experiment_genotipe: true,
        assay_list: {
          select: {
            status: true,
            gli: true,
            bgm: true,
            protocol_name: true,
            tecnologia: {
              select: {
                name: true,
                cod_tec: true,
              },
            },
            foco: {
              select: {
                name: true,
              },
            },
            type_assay: {
              select: {
                name: true,
              },
            },
            safra: {
              select: {
                safraName: true,
              },
            },
          },
        },
        local: {
          select: {
            name_local_culture: true,
            cultureUnity: true,
          },
        },
        delineamento: {
          select: {
            name: true,
            repeticao: true,
            trat_repeticao: true,
          },
        },

      },
    });
    return experiment;
  }

  async update(id: number, data: any) {
    const result = await prisma.experiment.update({
      where: { id },
      data,
    });
    return result;
  }

  async relationGroup({ idList, experimentGroupId, status }: any): Promise<any> {
    const result = await prisma.experiment.updateMany({
      where: {
        id: {
          in: idList,
        },
      },
      data: {
        experimentGroupId,
        status,
      },
    });
    return result;
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
      orderBy: order,
    });

    result.total = count;
    return result;
  }

  async delete(id: number) {
    const result = await prisma.experiment.delete({ where: { id } });
    return result;
  }
}
