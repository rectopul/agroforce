import { prisma } from '../pages/api/db/db';

export class SafraRepository {
  async create(data: any) {
    const safra = await prisma.safra.create({ data });
    return safra;
  }

  async update(id: number, data: any) {
    let safra = await this.findOne(id);
    if (safra !== null) {
      let Result = await prisma.safra.update({
        where: { id },
        data
      })
      return Result;
    } else {
      return false;
    }
  }

  async findOne(id: number) {
    const safra = await prisma.safra.findUnique({
      where: { id }
    });
    return safra;
  }

  async findBySafraName(data: any) {
    const safra = await prisma.safra.findFirst({
      where: {
        safraName: data.safraName,
        id_culture: data.id_culture,
      }
    });

    return safra;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    let count = await prisma.safra.count({ where: where });

    // console.log("Where repository", where);
    // const splitStartDate = where.plantingStartTime.lte.split('-')
    // const splitEndDate = where.plantingEndTime.gte.split('-')


    // const startDate = new Date(splitStartDate[0], splitStartDate[1], splitStartDate[2])
    // const endDate = new Date(splitEndDate[0], splitEndDate[1], splitEndDate[2])

    // console.log("Start Date: ", startDate)
    // console.log("End Date: ", endDate)

    // try {
    //   const teste = await prisma.safra.findMany({
    //     select: select,
    //     skip: skip,
    //     take: take,
    //     where: where,
    //     orderBy: order,
    //   });

    //   console.log("Teste", teste)
    // } catch (e) {
    //   console.error(e)
    // }

    const response: object | any = await prisma.safra.findMany({
      select: select,
      skip: skip,
      take: take,
      where: where,
      orderBy: order,
    });

    response.total = count;
    return response;
  }
}
