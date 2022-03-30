import { prisma } from "../pages/api/db/db";
import { LoteRepository } from '../repository/lote.repository';

interface CreateLoteDTO {
  name: string;
  volume: number;
  created_by: number;
}

export class LoteController {
  loteRepository = new LoteRepository();

  async create(data: CreateLoteDTO) {
    try {
      const lote = await prisma.lote.findFirst({
        where: {
          name: data.name
        }
      });

      if (lote?.name === data.name) return { status: 400, message: "Lote já existente" };

      await this.loteRepository.create(data);
  
      return {status: 201, message: "Lote cadastrado"};
    } catch(err) {
      return { status: 404, message: "Lote não encontrado"};
    };
  };
};
