/* eslint-disable camelcase */
import { prisma } from '../pages/api/db/db';

export class TypeAssayRepository {
  async findOne(id: number) {
    const result = await prisma.type_assay.findUnique({
      where: {
        id,
      },
    });
    return result;
  }

  async findOneByData({ name, protocol_name, id_culture }: any) {
    const result = await prisma.type_assay.findFirst({
      where: {
        name,
        protocol_name,
        id_culture,
      },
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const count = await prisma.type_assay.count({ where });
    const result: object | any = await prisma.type_assay.findMany({
      select, skip, take, where, orderBy: order,
    });
    result.total = count;
    return result;
  }

  async create(data: object | any) {
    const result = await prisma.type_assay.create({ data });
    return result;
  }

  async update(id: number, data: any) {
    console.log('🚀 ~ file: tipo-ensaio.repository.ts:44 ~ TypeAssayRepository ~ update ~ id', id);
    console.log('🚀 ~ file: tipo-ensaio.repository.ts:44 ~ TypeAssayRepository ~ update ~ data', data);
    const result = await prisma.type_assay.update({
      where: {
        id,
      },
      data,
    });
    return result;
  }
}
