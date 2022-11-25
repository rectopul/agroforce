import { prisma } from '../pages/api/db/db';
import { BaseRepository } from './base-repository';

interface ISequenciaDelineamento {
  id: number;
  id_delineamento: number;
  repeticao: number;
  sorteio: number;
  nt: number;
  bloco: number;
  status?: number;
  created_by: number;
}

type ICreateSequenciaDelineamento = Omit<
  ISequenciaDelineamento, 'id' | 'status'
>;

type IUpdateSequenciaDelineamento = Omit<
  ISequenciaDelineamento, 'id_delineamento' | 'status' | 'created_by'
>;

export class SequenciaDelineamentoRepository extends BaseRepository {
  async findById(id: number) {
    const result = await this.getPrisma().sequencia_delineamento.findUnique({
      where: { id },
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const count = await this.getPrisma().sequencia_delineamento.count({ where });
    const result: object | any = await this.getPrisma().sequencia_delineamento.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    result.total = count;
    return result;
  }

  async create(data: ICreateSequenciaDelineamento) {
    const result = await this.getPrisma().sequencia_delineamento.create({ data });
    return result;
  }

  async update(id: number, data: IUpdateSequenciaDelineamento) {
    const result = await this.getPrisma().sequencia_delineamento.update({
      where: { id },
      data,
    });
    return result;
  }
}
