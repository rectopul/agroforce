import { prisma } from '../pages/api/db/db';
import { BaseRepository } from './base-repository';

export class SafraRepository extends BaseRepository {
  async create(data: any) {
    const result = await this.getPrisma().safra.create({ data });
    return result;
  }

  async update(id: number, data: any) {
    const result = await this.getPrisma().safra.update({
      where: { id },
      data,
    });
    return result;
  }

  async findOne(id: number, selectReplace: any=null) {
    
    let select = {
      id: true,
      id_culture: true,
      year: true,
      plantingStartTime: true,
      plantingEndTime: true,
      main_safra: true,
      status: true,
      created_by: true,
      created_at: true,
      safraName: true,
      culture: true,
      assay_list: true,
      envelope: true,
      experiment: true,
      genotipo: true,
      genotype_treatment: true,
      group: true,
      lote: true,
      npe: true,
      quadra: true,
      experiment_genotipe: true,
      ExperimentGroup: true,
      log_import: true,
    };
    
    if(selectReplace !== null){
      select = selectReplace;
    }
    
    const result = await prisma.safra.findUnique({
      where: { id },
      select: select,
    });
    return result;
  }

  async findBySafraName(data: any) {
    const result = await prisma.safra.findFirst({
      where: {
        safraName: data.safraName,
        id_culture: data.id_culture,
      },
    });

    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.safra.count({ where });

    const result: object | any = await prisma.safra.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    result.total = count;
    return result;
  }
}
