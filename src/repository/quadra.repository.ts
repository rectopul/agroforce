import { prisma } from '../pages/api/db/db';

export class QuadraRepository {
  async create(data: any) {
    const quadra = await prisma.quadra.create({ data });
    return quadra;
  }

  async findOne(id: number) {
    const quadra = await prisma.quadra.findUnique({
      where: { id },
      select: {
        id: true,
        cod_quadra: true,
        local_plantio: true,
        larg_q: true,
        comp_p: true,
        linha_p: true,
        comp_c: true,
        esquema: true,
        tiro_fixo: true,
        disparo_fixo: true,
        q: true,
        dividers: true,
        local: { select: { name_local_culture: true } },
        safra: { select: { safraName: true } },
        status: true,
      },
    });
    return quadra;
  }

  async update(id: number, data: any) {
    const quadra = await this.findOne(id);

    if (quadra !== null) {
      const result = await prisma.quadra.update({
        where: { id },
        data,
      });
      return result;
    }
    return false;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.quadra.count({ where });

    const result: object | any = await prisma.quadra.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order,
    });

    result.total = count;
    return result;
  }
}
