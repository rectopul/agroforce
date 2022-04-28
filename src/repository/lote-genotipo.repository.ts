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
}
