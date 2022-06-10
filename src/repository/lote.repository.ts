import { prisma } from "../pages/api/db/db";
import { GenotipoRepository } from "./genotipo.repository";

export class LoteRepository {

  genotipoRepository = new GenotipoRepository()

  async create(data: any) {
    const lote = await prisma.lote.create({ data });

    return lote;
  }

  async findById(id: number) {
    const lote = await prisma.lote.findUnique({
      where: { id }
    });

    return lote;
  }

  async update(id: number, data: any) {
    const lote = await this.findById(id);

    if (lote !== null) {
      const result = await prisma.lote.update({
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

    const count = await prisma.lote.count({ where: where });

    const result: object | any = await prisma.lote.findMany({
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
