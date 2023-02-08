import { prisma } from '../pages/api/db/db';

export class UserPreferenceRepository {
  async create(data: object | any) {
    const result = await prisma.users_preferences.create(
      {
        data,
        select: { id: true },
      },
    );
    return result;
  }

  async update(id: number, data: Object | any) {
    const result = await prisma.users_preferences.update({
      where: {
        id,
      },
      data,
    });

    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const count = await prisma.users_preferences.count({ where });
    const Result: object | any = await prisma.users_preferences.findMany({
      select, skip, take, where, orderBy: order,
    });
    Result.total = count;
    return Result;
  }

  async findAllConfigGerais(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const Result: object | any = await prisma.config_gerais.findMany({
      select, skip, take, where, orderBy: order,
    });
    return Result;
  }

  async delete(id: number) {
    const result = await prisma.users_preferences.delete({ where: { id } });
    return result;
  }
  
}
