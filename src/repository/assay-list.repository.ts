import { prisma } from '../pages/api/db/db';

export class AssayListRepository {
  async create(data: any) {
    const result = await prisma.assay_list.create({
      data,
    });

    return result;
  }

  async findById(id: number) {
    const result = await prisma.assay_list.findUnique({
      where: { id },
      select: {
        id: true,
        id_safra: true,
        foco: { select: { name: true } },
        type_assay: { select: { name: true } },
        tecnologia: { select: { name: true, cod_tec: true } },
        genotype_treatment: true,
        gli: true,
        bgm: true,
        treatmentsNumber: true,
        status: true,
        project: true,
        comments: true,
        experiment: true,
      },
    });

    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.assay_list.update({
      where: { id },
      data,
    });
    return result;
  }

  async findByName({ gli, id_safra }: any) {
    const result = await prisma.assay_list.findFirst({
      where: {
        gli,
        id_safra,
      },
    });

    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    if (orderBy) {
      orderBy = JSON.parse(orderBy);
    }
    const count = await prisma.assay_list.count({ where });

    const result: object | any = await prisma.assay_list.findMany({
      select,
      skip,
      take,
      where,
      orderBy,
    });

    result.total = count;
    return result;
  }

  async delete(id: number) {
    const result = await prisma.assay_list.delete({ where: { id } });
    return result;
  }
}
