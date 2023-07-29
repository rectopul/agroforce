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

  /**
   * busca tratamentos por nome do genotipo, nome do gli e ncc do lote
   *
   *        if (options.gli) {
   *         parameters.assay_list = (JSON.parse(`{"gli": {"contains": "${options.gli}" } }`));
   *       }
   *
   *       if (options.name_genotipo) {
   *         parameters.genotipo = (JSON.parse(`{"name_genotipo": {"contains": "${options.name_genotipo}" } }`));
   *       }
   *
   *       if (options.nca) {
   *         parameters.lote = (JSON.parse(`{"ncc": ${Number(options.nca)} }`));
   *       }
   *
   * @param nameGli - nome do gli
   * @param nameGenotype - nome do genotipo
   * @param nccLote - ncc do lote
   * @returns
   *
   */
  async findByNameGenotypeAndNccLote(nameGli: string, nameGenotype: string, nccLote: number) {

    let select = {
      id: true,
      id_lote: true,
      id_genotipo: true,
      safra: {
        select: {
          id: true,
          safraName: true,
          culture: true,
        },
      },
      genotipo: {
        select: {
          id: true,
          name_genotipo: true,
          gmr: true,
          bgm: true,
          // tecnologia: {select: {cod_tec: true, name: true,},},
        },
      },
      treatments_number: true,
      status: true,
      status_experiment: true,
      lote: {
        select: {
          ncc: true,
          cod_lote: true,
          fase: true,
        },
      },
      assay_list: {
        select: {
          // foco: { select: { id: true, name: true } },
          // experiment: { select: { id: true, experimentName: true } },
          // type_assay: { select: { id: true, name: true } },
          // tecnologia: { select: { id: true, name: true, cod_tec: true } },
          gli: true,
          bgm: true,
          status: true,
          project: true,
          comments: true,
        },
      },
      comments: true,
    };
    
    const result: object | any = await this.getPrisma().genotype_treatment.findMany({
      where: {
        assay_list: {
          gli: {
            contains: nameGli,
          }
        },
        genotipo: {
          name_genotipo: {
            contains: nameGenotype,
          },
        },
        lote: {
          ncc: nccLote,
        },
      },
      select: select,
      orderBy: {},
    });

    return result;

  }

  /**
   * busca por id do tratamento, id do lote e id do genotipo
   * @param idList
   * @param idLote
   * @param idGenotype
   */
  async findReplaceGenotype(idList: any, idLote: any, idGenotype: number) {

    const result: object | any = await this.getPrisma().genotype_treatment.findMany({
      where: {
        id: {
          notIn: idList,
        },
        id_genotipo: idGenotype,
        id_lote: idLote, // for store both values
      },
      orderBy: {},
    });
    
    return result;
    /*
    const result = await this.getPrisma().genotype_treatment.updateMany({
      where: {
        id: {
          notin: idList,
        },
      },
      data: {
        id_genotipo: idGenotype,
        id_lote: idLote, // for store both values
      },
    });
    return result;*/
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
