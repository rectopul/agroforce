import { prisma } from '../pages/api/db/db';
import { BaseRepository } from './base-repository';

export class ProfilePermissionsRepository extends BaseRepository {
  async deleteAll(data: any) {
    const result = await prisma.profile_permissions.deleteMany({
      where: data,
    });
    return result;
  }

  async findOne(id: number) {
    const result = await prisma.profile_permissions.findUnique({
      where: { id },
    });
    return result;
  }

  async findAll(where: any) {
    const result: object | any = await prisma.profile_permissions.findMany({
      where,
    });

    return result;
  }

  async create(data: any) {
    const result = await this.getPrisma().profile_permissions.create({ data });
    return result;
  }

  async update(id: number, data: any) {
    const result = await this.getPrisma().profile_permissions.update({
      where: { id },
      data,
    });
    return result;
  }
}
