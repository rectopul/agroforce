import { prisma } from '../pages/api/db/db';

export class SafraRepository {
  async create(data: any) {
    const safra = await prisma.safra.create({ data });
    return safra;
  }

  async update(id: number, data: any) {
    const safra = await this.findOne(id);
    if (safra !== null) {
      const Result = await prisma.safra.update({
        where: { id },
        data,
      });
      return Result;
    }
    return false;
  }

  async findOne(id: number) {
    const safra = await prisma.safra.findUnique({
      where: { id },
    });
    return safra;
  }

  async findBySafraName(data: any) {
    const safra = await prisma.safra.findFirst({
      where: {
        safraName: data.safraName,
        id_culture: data.id_culture,
      },
    });

    return safra;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.safra.count({ where });

    // const splitStartDate = where.plantingStartTime.lte.split('-')
    // const splitEndDate = where.plantingEndTime.gte.split('-')

    // const startDate = new Date(splitStartDate[0], splitStartDate[1], splitStartDate[2])
    // const endDate = new Date(splitEndDate[0], splitEndDate[1], splitEndDate[2])

    // try {
    //   const teste = await prisma.safra.findMany({
    //     select: select,
    //     skip: skip,
    //     take: take,
    //     where: where,
    //     orderBy: order,
    //   });

    // } catch (e) {
    //   console.error(e)
    // }

    const response: object | any = await prisma.safra.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    response.total = count;
    return response;
  }
}
