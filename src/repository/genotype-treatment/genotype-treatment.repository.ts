import { prisma } from '../../pages/api/db/db';
import { BaseRepository } from '../base-repository';
export class GenotypeTreatmentRepository extends BaseRepository {
  async create(data: any) {
    const result = await this.getPrisma().genotype_treatment.create({
      data,
    });

    return result;
  }

  async findById(id: number) {
    const result = await this.getPrisma().genotype_treatment.findUnique({
      where: { id },
    });

    return result;
  }

  async update(id: number, data: any) {
    const result = await this.getPrisma().genotype_treatment.update({
      where: { id },
      data,
    });
    return result;
  }

  async replaceLote(idList: any, idLote: number) {
    const result = await this.getPrisma().genotype_treatment.updateMany({
      where: {
        id: {
          in: idList,
        },
      },
      data: {
        id_lote: idLote,
      },
    });
    return result;
  }

  async replaceGenotype(idList: any, idLote: any, idGenotype: number) {
    const result = await this.getPrisma().genotype_treatment.updateMany({
      where: {
        id: {
          in: idList,
        },
      },
      data: {
        id_genotipo: idGenotype,
        id_lote: idLote, // for store both values
      },
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order;
    if (typeof orderBy === 'object') {
      order = orderBy.map((item: any) => {
        JSON.parse(item);
      });
    } else if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await this.getPrisma().genotype_treatment.count({ where });

    const result: object | any = await this.getPrisma().genotype_treatment.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });
    result.total = count;
    return result;
  }

  async deleteAll(idAssayList: number) {
    const result = await this.getPrisma().genotype_treatment.deleteMany({
      where: {
        id_assay_list: idAssayList,
      },
    });
    return result;
  }
}
