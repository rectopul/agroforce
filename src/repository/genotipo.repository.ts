import { prisma } from '../pages/api/db/db';
import {BaseRepository} from './base-repository';

export class GenotipoRepository extends BaseRepository {
  async create(data: any) {
    const result = await this.getPrisma().genotipo.create({ data });
    return result;
  }

  async findOne(id: number) {
    const result = await prisma.genotipo.findUnique({
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
        numberLotes: true,
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
        tecnologia: { select: { name: true, cod_tec: true, desc: true } },
        lote: true,
      },
    });
    return result;
  }


  async findOneByName(name: any) {
    const result = await prisma.genotipo.findMany({
      where: { name_genotipo: name },
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
        numberLotes: true,
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
        tecnologia: { select: { name: true, cod_tec: true, desc: true } },
        lote: true,
      },
    });
    return result;
  }


  async update(id: number, data: any) {
    const result = await this.getPrisma().genotipo.update({
      where: { id },
      data,
    });
    return result;
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
      orderBy: order,
    });

    result.total = count;
    return result;
  }
}
