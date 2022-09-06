import { prisma } from "../pages/api/db/db";

export class EnvelopeRepository {
  async create(data: any) {
    const envelope = await prisma.envelope.create({
      data: {
        id_type_assay: data.id_type_assay,
        seeds: data.seeds,
        id_safra: data.id_safra,
        created_by: data.created_by,
      },
    });

    return envelope;
  }

  async findById(id: number) {
    const envelope = await prisma.envelope.findUnique({
      where: { id },
      select: {
        id: true,
        safra: {
          select: {
            safraName: true,
            id: true,
          },
        },
        type_assay: {
          select: {
            name: true,
            id: true,
          },
        },
        seeds: true,
      },
    });
    return envelope;
  }

  async update(id: number, data: any) {
    const envelope = await this.findById(id);

    if (envelope !== null) {
      const result = await prisma.envelope.update({
        where: { id },
        data,
      });
      return result;
    }
    return false;
  }

  async findByData(data: any) {
    const envelope = await prisma.envelope.findFirst({
      where: {
        id_safra: data.id_safra,
        id_type_assay: data.id_type_assay,
      },
    });

    return envelope;
  }

  async findAll(
    where: any,
    select: any,
    take: any,
    skip: any,
    orderBy: string | any
  ) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }
    const count = await prisma.envelope.count({ where });
    const result: object | any = await prisma.envelope.findMany({
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
