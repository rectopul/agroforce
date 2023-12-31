import { prisma } from '../pages/api/db/db';

export class DepartamentRepository {
  async findOne(id: number) {
    const result = await prisma.department.findUnique({
      where: { id },
    });
    return result;
  }

  async findByName(name: string) {
    const result = await prisma.department.findFirst({
      where: { name },
    });

    return result;
  }

  async findAll() {
    const result = await prisma.department.findMany({ where: { status: 1 } });
    return result;
  }

  async create(data: any) {
    const result = await prisma.department.create({ data });
    return result;
  }

  async update(id: number, data: Object) {
    const departament = await this.findOne(id);

    if (departament !== null) {
      const result = await prisma.department.update({
        where: { id },
        data,
      });
      return result;
    }
    return false;
  }

  async listAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.department.count({ where });

    const result: object | any = await prisma.department.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    result.total = count;
    return result;
  }
}
