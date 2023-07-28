import {prisma} from '../pages/api/db/db';
import {semaforoItem} from "@prisma/client";

export class SemaforoItemRepository {
  
  async create(data: object | any) {
    return await prisma.semaforoItem.create({data: data});
  }

  async updateBySemaforoId(semaforoId: number, Data: Object) {
    return await prisma.semaforoItem.updateMany({
        where: {
            semaforoId,
        },
        data: Data,
    });
  }
  
  async update(id: number, Data: Object) {
    return await prisma.semaforoItem.updateMany({
      where: {
        id,
      },
      data: Data,
    });
  }

  async find(referencia: string, codReferencia: string) : Promise<semaforoItem[]> {
    return await prisma.semaforoItem.findMany({
      where: {referencia, codReferencia, semaforo: {status: 'andamento'}},
      orderBy: {id: 'asc'}
    });
  }

  async findReferencia(referencia: string) {
    return await prisma.semaforoItem.findMany({
      where: {referencia, semaforo: {status: 'andamento'}},
      orderBy: {id: 'asc'}
    });
  }

  async findById(id: number) {
    return await prisma.semaforoItem.findUnique({
      where: {id},
    });
  }

  async findOne(id: number) {
    return await prisma.semaforoItem.findMany({
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
    const count = await prisma.semaforoItem.count({ where });
    const result: object | any = await prisma.semaforoItem.findMany({
      select, skip, take, where, orderBy: order,
    });
    result.total = count;
    return result;
  }
}
