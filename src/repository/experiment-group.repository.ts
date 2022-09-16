import { prisma } from '../pages/api/db/db';

export class ExperimentGroupRepository {
  async create(data: any) {
    const result = await prisma.experimentGroup.create({
      data,
    });

    return result;
  }

  async findById(id: number) {
    const result = await prisma.experimentGroup.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        experimentAmount: true,
        tagsToPrint: true,
        tagsPrinted: true,
        totalTags: true,
        status: true,
        experiment: {
          select: {
            id: true,
            status: true,
            created_by: true,
            created_at: true,
            clp: true,
            comments: true,
            density: true,
            eel: true,
            experimentName: true,
            idAssayList: true,
            idDelineamento: true,
            experimentGroupId: true,
            idLocal: true,
            idSafra: true,
            nlp: true,
            orderDraw: true,
            period: true,
            repetitionsNumber: true,
            experiment_genotipe: true,
          },
        },
      },
    });

    return result;
  }

  async update(id: number, data: any) {
    const result = await prisma.experimentGroup.update({
      where: { id },
      data,
    });
    return result;
  }

  async findByName({ name, safraId }: any) {
    const result = await prisma.experimentGroup.findFirst({
      where: {
        name,
        safraId,
      },
    });

    return result;
  }

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    if (orderBy) {
      // eslint-disable-next-line no-param-reassign
      orderBy = JSON.parse(orderBy);
    }
    const count = await prisma.experimentGroup.count({ where });

    const result: object | any = await prisma.experimentGroup.findMany({
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
    const result = await prisma.experimentGroup.delete({ where: { id } });
    return result;
  }
}
