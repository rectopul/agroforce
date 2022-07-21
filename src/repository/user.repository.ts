import { prisma } from '../pages/api/db/db';

export class UserRepository {
  async create(User: object | any) {
    const result = await prisma.user.create({ data: User });

    return result;
  }

  async update(id: number, Data: Object) {
    const result = await prisma.user.updateMany({
      where: {
        id,
      },
      data: Data,
    });

    return result;
  }

  async findById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async updateAvatar(id: number, avatar: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { avatar },
    });

    return user;
  }

  async updatePassword(id: number, password: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { password },
    });

    return user;
  }

  async findOne(id: number) {
    const result: object | any = await prisma.user.findMany({
      where: {
        id,
      },
    });
    result.cultures = await this.getAllCulturesByUserID(id);
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;
    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const count = await prisma.user.count({ where });
    const result: object | any = await prisma.user.findMany({
      select, skip, take, where, orderBy: order,
    });
    result.total = count;
    return result;
  }

  async signIn(Where: object) {
    const result = await prisma.user.findFirst({ where: Where });
    return result;
  }

  async getPermissions(userId: any) {
    const result = await prisma.profile.findMany({
      where: {
        id: userId,
      },
      select: {
        acess_permission: true,
      },
    });
    return result;
  }

  async getAllCulturesByUserID(userId: number | any) {
    const result = await prisma.users_permissions.findMany({
      where: {
        userId,
      },
      select: {
        cultureId: true,
      },
      distinct: ['cultureId'],
    });
    return result;
  }
}
