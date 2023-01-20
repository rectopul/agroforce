import { prisma } from '../pages/api/db/db';
import { BaseRepository } from './base-repository';

export class ExperimentRepository extends BaseRepository {
  async create(data: any) {
    const experiment = await this.getPrisma().experiment.create({ data });
    return experiment;
  }

  async findOne(id: number) {
    const experiment = await prisma.experiment.findUnique({
      where: { id },
      select: {
        id: true,
        idAssayList: true,
        idSafra: true,
        idLocal: true,
        density: true,
        period: true,
        repetitionsNumber: true,
        experimentName: true,
        experimentGroupId: true,
        status: true,
        nlp: true,
        clp: true,
        comments: true,
        orderDraw: true,
        experiment_genotipe: true,
        assay_list: {
          select: {
            status: true,
            gli: true,
            bgm: true,
            tecnologia: {
              select: {
                id: true,
                name: true,
                cod_tec: true,
              },
            },
            foco: {
              select: {
                id: true,
                name: true,
              },
            },
            type_assay: {
              select: {
                id: true,
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

  async findOneByName(name : any) {
    const result: object | any = await prisma.experiment.findMany({
      where: { experimentName: name },
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
        comments: true,
        orderDraw: true,
        assay_list: {
          select: {
            id: true,
            status: true,
            gli: true,
            bgm: true,
            tecnologia: {
              select: {
                id: true,
                name: true,
                cod_tec: true,
              },
            },
            foco: {
              select: {
                id: true,
                name: true,
              },
            },
            type_assay: {
              select: {
                id: true,
                name: true,
              },
            },
            safra: {
              select: {
                id: true,
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
    return result;
  }

  async update(id: number, data: any) {
    const result = await this.getPrisma().experiment.update({
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

    if (typeof orderBy === 'object') {
      order = orderBy.map((item: any) => {
        console.log('JSON.parse(item)', JSON.parse(item), item, typeof item);
        return JSON.parse(item);
      });
    } else if (orderBy) {
      order = JSON.parse(orderBy);
    }
    
    console.log('prisma.order', order);
    
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
