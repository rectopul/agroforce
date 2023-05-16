import { prisma } from '../pages/api/db/db';
import { BaseRepository } from './base-repository';

export class ProfileRepository extends BaseRepository {
  createProfilePermission(data: any) {
    throw new Error('Method not implemented.');
  }

  async findOne(id: number) {
    const result = await prisma.profile.findUnique({
      where: { id },
    });
    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    
    const count = await prisma.profile.count({ where });
    
    const result: object | any = await prisma.profile.findMany({
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
    const result = await prisma.profile.create({ data });
    return result;
  }

  async findByName(name: string) {
    const result = await prisma.profile.findFirst({
      where: { name },
    });

    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.profile.update({
      where: { id },
      data,
    });
    return result;
  }

  async delete(id: number) {
    const result = await prisma.profile.delete({ where: { id } });
    return result;
  }
  
}
