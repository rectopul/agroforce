import { prisma } from "../pages/api/db/db";

interface ILoteGenotipoDTO {
  id: number;
  id_genotipo: number;
  name: string;
  volume: number;
  status: number;
  created_by: number;
};

type ICreateLoteGenotipo = Omit<ILoteGenotipoDTO, "id" | "status">;
type IUpdateLoteGenotipo = Omit<ILoteGenotipoDTO, "created_by" | "status">;

export class LoteGenotipoRepository {
  async findAll() {
    const lote = await prisma.lote.findMany();

    return lote;
  }

  async findByNameRelated(name: string, id_genotipo: number) {
    const lote = await prisma.lote.findFirst({
      where: {
        name: name,
        id_portfolio: id_genotipo,
      }
    });

    return lote;
  }

  async create(data: ICreateLoteGenotipo) {
    const lote = await prisma.lote.create({
      data: {
        id_portfolio: data.id_genotipo,
        name: data.name,
        volume: data.volume,
        created_by: data.created_by,
      }
    });

    return lote;
  }

  async findById(id: number) {
    const lote = await prisma.lote.findUnique({
      where: { id },
    });

    return lote;
  }

  async update(data: IUpdateLoteGenotipo) {
    const lote = await prisma.lote.update({
      where: { id: data.id },
      data: {
        id: data.id,
        id_portfolio: data.id_genotipo,
        name: data.name,
        volume: data.volume,
      },
    });

    return lote;
  }
}
