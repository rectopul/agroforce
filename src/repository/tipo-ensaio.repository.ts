import { prisma } from '../pages/api/db/db';

export class TypeAssayRepository {

  async findOne(id: number) {
    let Result = await prisma.type_assay.findUnique({
      where: {
        id: id
      }
    })
    return Result;
  }

  async findOneByName(name: string) {
    const result = await prisma.type_assay.findFirst({
      where: {
        name: name
      }
    })
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    let count = await prisma.type_assay.count({ where: where })
    let Result: object | any = await prisma.type_assay.findMany({ select: select, skip: skip, take: take, where: where, orderBy: order })
    Result.total = count;
    return Result;
  }

  async create(data: object | any) {
    const result = await prisma.type_assay.create({ data })
    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.type_assay.update({
      where: {
        id: id
      },
      data: data
    })
    return result;
  }

  async updateStatus(id: number, status: number) {
    const result = await prisma.type_assay.update({
      where: {
        id: id
      },
      data: {
        status: status
      }
    })
    return result
  }
}

