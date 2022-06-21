import { prisma } from '../pages/api/db/db';

export class LocalRepository {
  async findOne(id: number) {
    try {
      const result = await prisma.local.findUnique({
        where: {
          id: id
        }
      })
      return result;
    } catch (error) {
      console.log("[Repository] - FindOne local error");
      console.log(error);
      throw new Error("[Repository] - FindOne local error")
    }
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    try {
      let order: object | any;
      if (orderBy) {
        order = JSON.parse(orderBy);
      }
      const count = await prisma.local.count({ where: where })
      const result: object | any = await prisma.local.findMany({ select: select, skip: skip, take: take, where: where, orderBy: order })
      result.total = count;
      return result;
    } catch (error) {
      console.log("[Repository] - FindAll local erro");
      console.log(error);
      throw new Error("[Repository] - FindAll local erro")
    }
  }

  async findUFs(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const result: object | any = await prisma.uf.findMany({ select: select, skip: skip, take: take, where: where, orderBy: order })
    return result;
  }

  async findOneUFs(id: number) {
    let result = await prisma.uf.findUnique({
      where: {
        id: id
      }
    })
    return result;
  }

  async findCitys(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    let result: object | any = await prisma.city.findMany({ select: select, skip: skip, take: take, where: where, orderBy: order })
    return result;
  }

  async create(local: object | any) {
    try {
      local.created_at = new Date();
      const result = await prisma.local.create({ data: local })
      return result;
    } catch (error) {
      console.log("[Repository] - Create local erro");
      console.log(error);
      throw new Error("[Repository] - Create local erro")
    }
  }

  async update(id: number, data: Object) {
    try {
      const result = await prisma.local.update({
        where: { id: id },
        data: data
      })

      return result;
    } catch (error) {
      console.log("[Repository] - Update local erro");
      console.log(error);
      throw new Error("[Repository] - Update local erro")
    }
  }
}

