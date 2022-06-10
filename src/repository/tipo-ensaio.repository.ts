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
    //console.log("Data: ", data);
    const result = await prisma.type_assay.create({ data })
    return result;
  }

  async update(id: number, Data: Object) {
    const Exist = await this.findOne(id);
    if (Exist !== null) {
      const result = await prisma.type_assay.update({
        where: {
          id: id
        },
        data: Data
      })

      return result;
    } else {
      return false;
    }
  }
}

