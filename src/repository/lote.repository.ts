import { prisma } from "../pages/api/db/db";
import { GenotipoRepository } from "./genotipo.repository";

interface CreateLoteDTO {
  id_genotipo: number;
  name: string;
  volume: number;
  created_by: number;
}

interface UpdateLoteDTO {
  id: number;
  name: string;
  volume: number;
}

export class LoteRepository {

  genotipoRepository = new GenotipoRepository()

  async create(data: CreateLoteDTO) {
    const lote = await prisma.lote.create({
      data: {
        id_genotipo: data.id_genotipo,
        name: data.name,
        volume: data.volume,
        created_by: data.created_by,
      }
    });

    return lote;
  }

  async findById(id: number) {
    const lote = await prisma.lote.findUnique({
      where: { id }
    });

    return lote;
  }

  async update(id: number, data: UpdateLoteDTO) {
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

  async findByName(name: string) {
    const lote = await prisma.lote.findFirst({
      where: {
        name
      }
    });

    return lote;
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
