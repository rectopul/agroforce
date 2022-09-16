import { prisma } from '../pages/api/db/db';

export class ReporteRepository {
  async findOne() {
    console.log('findOne');
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.culture.count({ where });

    const result: object | any = await prisma.culture.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    result.total = count;
    return result;
  }

  async create(data: any) {
    const reporte = await prisma.reportes.create({ data });
    return reporte;
  }

  async update() {
    console.log('update');
  }

  async queryRaw() {
    console.log('queryRaw');
  }
}
