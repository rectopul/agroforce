import { prisma } from '../../pages/api/db/db';
import { BaseRepository } from '../base-repository';

export class HistoryGenotypeTreatmentRepository extends BaseRepository {
  async create(data: any) {
    const result = await this.getPrisma().history_genotype_treatment.create({
      data,
    });

    return result;
  }
}
