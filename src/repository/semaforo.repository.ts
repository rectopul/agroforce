import {prisma} from '../pages/api/db/db';

export class SemaforoRepository {
  async create(data: object | any) {
    return await prisma.semaforo.create({data: data});
  }

  async update(id: number, Data: Object) {
    return await prisma.semaforo.updateMany({
      where: {
        id,
      },
      data: Data,
    });
  }

  async find(sessao: string, acao: string) {
    return await prisma.semaforo.findMany({
      where: {sessao, acao, status: 'andamento'},
      orderBy: {id: 'asc'}
    });
  }
  
  async findAcao(acao: string) {
    return await prisma.semaforo.findMany({
      where: {acao, status: 'andamento'},
      orderBy: {id: 'asc'}
    });
  }

  async findById(id: number) {
    return await prisma.semaforo.findUnique({
      where: {id},
    });
  }

  async findOne(id: number) {
    return await prisma.semaforo.findMany({
      where: {
        id,
      },
    });
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const count = await prisma.semaforo.count({ where });
    const result: object | any = await prisma.semaforo.findMany({
      select, skip, take, where, orderBy: order,
    });
    result.total = count;
    return result;
  }
}
