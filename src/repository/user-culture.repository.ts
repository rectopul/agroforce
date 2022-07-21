import { prisma } from '../pages/api/db/db';

export class UserCultureRepository {
  async create(Cultures: object | any) {
    const Result = await prisma.users_cultures.createMany({ data: Cultures });
    return Result;
  }

  async update(id: number, Data: Object) {
    const userCulture = await this.findOne(id);
    if (userCulture !== null) {
      const Result = await prisma.users_cultures.updateMany({
        where: {
          id,
        },
        data: Data,
      });

      return Result;
    }
    return false;
  }

  async updateAllStatus(userId: any) {
    await prisma.$executeRaw`UPDATE users_cultures SET status = 0 WHERE userId = ${userId}`;
  }

  async queryRaw(idUser: any, cultureId: any) {
    await prisma.$executeRaw`UPDATE users_cultures SET status = 1 WHERE userId = ${idUser} AND cultureId = ${cultureId}`;
  }

  async delete(where: object) {
    const Result = await prisma.users_cultures.deleteMany({
      where,
    });
    return Result;
  }

  async findOne(id: number) {
    const Result = await prisma.users_cultures.findMany({
      where: {
        id,
      },
    });
    return Result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const count = await prisma.users_cultures.count({ where });
    const Result: object | any = await prisma.users_cultures.findMany({
      select, skip, take, where, orderBy: order,
    });
    Result.total = count;
    return Result;
  }

  async findAllByUser(userId: number | any) {
    const Result = await prisma.users_cultures.findMany({
      where: {
        userId,
        culture: <any>{
          status: 1,
        },
      },
      select: {
        id: true,
        cultureId: true,
        status: true,
        culture: { select: { name: true } },
      },
    });
    return Result;
  }
}
