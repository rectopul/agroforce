import { prisma } from '../../pages/api/db/db';

export class HistoryGenotypeTreatmentRepository {
  async create(data: any) {
    const result = await prisma.history_genotype_treatment.create({
      data,
    });

    return result;
  }
}
