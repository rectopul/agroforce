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
  ISequenciaDelineamento, "id" | "status"
>;

type IUpdateSequenciaDelineamento = Omit<
  ISequenciaDelineamento, "id_delineamento" | "status" | "created_by"
>;

export class SequenciaDelineamentoRepository {   
  async findById(id: number) {
      const result = await prisma.sequencia_delineamento.findUnique({
        where: { id }
      });
      return result;
  }

  async findAll (where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy){
      order = JSON.parse(orderBy);
    }

    const count = await prisma.sequencia_delineamento.count({ where: where });

    const result: object | any = await prisma.sequencia_delineamento.findMany({
      select: select, 
      skip: skip, 
      take: take, 
      where: where,
      orderBy: order
    });
    
    result.total = count;
    return result;
  }

  async create(data: ICreateSequenciaDelineamento) {
    const culture = await prisma.sequencia_delineamento.create({ data });
    return culture;
  }

  async update(id: number, data: IUpdateSequenciaDelineamento) {
    const result = await prisma.culture.update({
      where: { id },
      data
    });
    return result;
  }

  async list(id_delineamento: number) {
    const result = await prisma.sequencia_delineamento.findMany({
      where: { id_delineamento },
      include: {
        delineamento: {
          select: {
            name: true,
          }
        }
      }
    });

    return result;
  }
}
