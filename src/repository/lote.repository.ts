import { prisma } from "../pages/api/db/db";

 interface CreateLoteDTO {
   name: string;
   volume: number;
   created_by: number;
 }

export class LoteRepository {
  async create(data: CreateLoteDTO) {
    const lote = await prisma.lote.create({
      data
    });

    return lote;
  }
}
