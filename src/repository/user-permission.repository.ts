import { prisma } from '../pages/api/db/db';

export class UsersPermissionsRepository {
  async create(Permission: object | any) {
    const result = await prisma.users_permissions.createMany({ data: Permission });
    return result;
  }

  async update(id: number, Data: Object) {
    const result = await prisma.users_permissions.update({
      where: {
        id,
      },
      data: Data,
    });

    return result;
  }

  // parametro select opcional passando para o prisma
  async findAll(where: any) {
    // const select = {
    //   id: true, name: true, cpf: true, login: true, telefone: true, avatar: true, status: true,
    // };
    
    const select = {
      id: true,
      cultureId: true,
      profileId: true,
      userId: true,
      status: true,
      user: {
        select: { id: true, name: true, cpf: true, login: true, avatar: true, status: true }
      }
    }
    
    // const result = await prisma.users_permissions.findMany({ where, select });
    const result = await prisma.users_permissions.findMany({ where, select });
    return result;
  }

  async findAllByUser(userId: number | any) {
    const result = await prisma.users_permissions.findMany({
      where: {
        userId,
        culture: { status: 1 },
      },
      select: {
        id: true,
        cultureId: true,
        profileId: true,
        status: true,
        culture: { select: { name: true, desc: true } },
        profile: true,
      },
      distinct: ['cultureId'],
      //distinct: ['id'],
    });
    return result;
  }

  async findPermissions(userId: number | any) {
    const result = await prisma.users_permissions.findMany({
      where: {
        userId,
        culture: { status: 1 },
      },
      select: {
        id: true,
        cultureId: true,
        profileId: true,
        status: true,
        culture: { select: { name: true, desc: true } },
        profile: true,
      },
    });
    return result;
  }

  async delete(where: object) {
    const result = await prisma.users_permissions.deleteMany({
      where,
    });
    return result;
  }

  async updateAllStatus(userId: any) {
    await prisma.$executeRaw`UPDATE users_permissions SET status = 0 WHERE userId = ${userId}`;
  }

  async queryRaw(idUser: any, cultureId: any) {
    await prisma.$executeRaw`UPDATE users_permissions SET status = 1 WHERE userId = ${idUser} AND cultureId = ${cultureId}`;
  }
}
