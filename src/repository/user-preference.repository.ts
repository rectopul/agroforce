import { prisma } from '../pages/api/db/db';

export class UserPreferenceRepository {
  async create(Permission: object | any) {
    const Result = await prisma.users_preferences.create({ data: Permission, select: { id: true } });
    return Result;
  }

  async update(id: number, Data: Object | any) {
    const preference: any = this.findAll({ id }, { id: true }, 1, 0, '');
    let Result: undefined | any;
    if (preference) {
      Result = await prisma.users_preferences.update({
        where: {
          id,
        },
        data: { table_preferences: Data.table_preferences },
      });
    } else {
      Result = await prisma.users_preferences.upsert({
        update: {
          table_preferences: Data.table_preferences,
        },
        where: {
          id,
        },
        create: {
          table_preferences: Data.table_preferences,
          userId: Data.userId,
          module_id: Data.module_id,
        },
      });
    }
    return Result;
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

  async findAllconfigGerais(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const Result: object | any = await prisma.config_gerais.findMany({
      select, skip, take, where, orderBy: order,
    });
    return Result;
  }
}
