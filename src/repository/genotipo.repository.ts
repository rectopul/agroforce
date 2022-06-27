import { prisma } from '../pages/api/db/db';

export class GenotipoRepository {
  async create(data: any) {
    const genotipo = await prisma.genotipo.create({ data });
    return genotipo;
  }
  async findOne(id: number) {
    const genotipo = await prisma.genotipo.findUnique({
      where: { id },
			select: { 
				id: true,
				id_s1: true,
				id_dados: true,
				id_tecnologia: true,
				name_genotipo: true,
				name_main: true,
				name_public: true,
				name_experiment: true,
				name_alter: true,
				elit_name: true,
				type: true,
				gmr: true,
				bgm: true,
				cruza: true,
				progenitor_f_direto: true,
				progenitor_m_direto: true,
				progenitor_f_origem: true,
				progenitor_m_origem: true,
				progenitores_origem: true,
				parentesco_completo: true,
				status: true,
				tecnologia: { select: { name: true, cod_tec: true } },
				lote: true
			}
    });
    return genotipo;
  }

  async update(id: number, data: any) {
    const genotipo = await this.findOne(id);

    if (genotipo !== null) {
      const result = await prisma.genotipo.update({
        where: { id },
        data
      });
      return result;
    } else {
      return false;
    }
  }

  async list(id_culture: number) {
    const genotipo = await prisma.genotipo.findMany({
      where: { id_culture },
      select: {
        id: true,
        id_culture: true,
        cruza: true,
        status: true
      }
    });

    return genotipo;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.genotipo.count({ where });

    const result: object | any = await prisma.genotipo.findMany({
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
