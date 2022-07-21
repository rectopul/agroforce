import { prisma } from '../pages/api/db/db';

export class ProfileRepository {
  async findOne(id: number) {
    const Result = await prisma.profile.findUnique({
      where: {
        id,
      },
    });
    return Result;
  }

  async findAll() {
    const Result = await prisma.profile.findMany();
    return Result;
  }

  async create(Profile: object | any) {
    const Result = await prisma.profile.create({ data: Profile });
    return Result;
  }

  async update(id: number, Profile: Object) {
    const profile = await this.findOne(id);
    if (profile !== null) {
      const Result = await prisma.profile.update({
        where: {
          id,
        },
        data: Profile,
      });

      return Result;
    }
    return false;
  }
}
