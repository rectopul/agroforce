import { prisma } from "../pages/api/db/db";

export class GrupoRepository {

  async create(data: any) {
    const foco_children = await prisma.foco_children.create({
      data: {
        id_foco: data.id_foco,
        grupo: data.grupo,
        id_safra: data.id_safra,
        created_by: data.created_by,
      }
    });

    return foco_children;
  }

  async findById(id: number) {
    const foco_children = await prisma.foco_children.findUnique({
      where: { id },
      select: { id: true, safra: { select: { safraName: true, id: true } }, foco: { select: { name: true, id: true } }, grupo: true, status: true }
    });

    return foco_children;
  }

  async update(id: number, data: any) {
    const foco_children = await this.findById(id);

    if (foco_children !== null) {
      const result = await prisma.foco_children.update({
        where: { id },
        data
      });
      return result;
    } else {
      return false;
    }
  }

  async findByData(data: any) {
    const foco_children = await prisma.foco_children.findFirst({
      where: {
        id_safra: data.id_safra,
        id_foco: data.id_foco
      }
    });

    return foco_children;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.foco_children.count({ where: where });

    const result: object | any = await prisma.foco_children.findMany({
      select: select,
      skip: skip,
      take: take,
      where: where,
      orderBy: order
    });

    result.total = count;
    return result;
  }
}
