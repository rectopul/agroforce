import { prisma } from '../pages/api/db/db';

export class ExperimentoRepository {
  async create(data: any) {
    const experimento = await prisma.experimento.create({ data });
    return experimento;
  }
  async findOne(id: number) {
    const experimento = await prisma.experimento.findUnique({
      where: { id },
      select: {
        id: true,
        protocolo_name: true,
        id_experimento: true,
        experimento_name: true,
        safra: { select: { safraName: true } },
        culture: { select: { name: true } },
        foco: { select: { name: true } },
        tecnologia: { select: { cod_tec: true } },
        ensaio: { select: { name: true } },
        epoca: true,
        pjr: true,
        id_un_cultura: true,
        unidade_cultura_name: true,
        name_uni_cultura: true,
        rotulo: true,
        year: true,
        status: true,
      }
    });
    return experimento;
  }

  async update(id: number, data: any) {
    const experimento = await this.findOne(id);

    if (experimento !== null) {
      const result = await prisma.experimento.update({
        where: { id },
        data
      });
      return result;
    } else {
      return false;
    }
  }  

  async findAll(where: any, select: any, take: any, skip: any, orderBy: string | any) {
    let order: object | any;

    if (orderBy) {
      order = JSON.parse(orderBy);
    }

    const count = await prisma.experimento.count({ where });

    const result: object | any = await prisma.experimento.findMany({
      select,
      skip,
      take,
      where,
      orderBy: order
    });

    result.total = count;
    return result;
  }
}
