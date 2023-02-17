import { prisma } from '../pages/api/db/db';
import { BaseRepository } from './base-repository';

export class PermissionRepository extends BaseRepository {
  async findOne(id: number) {
    const result = await prisma.permissions.findUnique({
      where: { id },
    });
    return result;
  }

  async findAll(where: any) {
    const result: object | any = await prisma.permissions.findMany({
      where,
    });

    return result;
  }

  async create(data: any) {
    const result = await this.getPrisma().permissions.create({ data });
    return result;
  }

  async update(id: number, data: any) {
    const result = await this.getPrisma().permissions.update({
      where: { id },
      data,
    });
    return result;
  }
}
