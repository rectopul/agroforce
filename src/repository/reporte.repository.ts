import { prisma } from '../pages/api/db/db';

export class ReporteRepository {
  async findOne(id: number) {
    const result = await prisma.reportes.findUnique({
      where: { id },

    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.reportes.count({ where });

    const result: object | any = await prisma.reportes.findMany({
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

  async update(id: number, data: any) {
    const result = await prisma.reportes.update({
      where: { id },
      data,
    });
    return result;
  }

  async queryRaw() {
    console.log('queryRaw');
  }
}
