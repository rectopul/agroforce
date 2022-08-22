import { prisma } from '../pages/api/db/db';

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

export class SequenciaDelineamentoRepository {
  async findById(id: number) {
    const result = await prisma.sequencia_delineamento.findUnique({
      where: { id },
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const count = await prisma.sequencia_delineamento.count({ where });
    const result: object | any = await prisma.sequencia_delineamento.findMany({
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
    const result = await prisma.sequencia_delineamento.create({ data });
    return result;
  }

  async update(id: number, data: IUpdateSequenciaDelineamento) {
    const result = await prisma.sequencia_delineamento.update({
      where: { id },
      data,
    });
    return result;
  }
}
