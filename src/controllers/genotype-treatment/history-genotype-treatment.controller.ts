import { HistoryGenotypeTreatmentRepository } from '../../repository/genotype-treatment/history-genotype-tratment.repository';
import handleError from '../../shared/utils/handleError';

export class HistoryGenotypeTreatmentController {
  historyGenotypeTreatmentRepository = new HistoryGenotypeTreatmentRepository();

  async create(data: any) {
    try {
      await this.historyGenotypeTreatmentRepository.create(data);

      return { status: 200, message: 'Tratamentos do genótipo cadastrada' };
    } catch (error: any) {
      handleError('Historico tratamentos do genótipo controller', 'Create', error.message);
      throw new Error('[Controller] - Create Historico tratamentos do genótipo erro');
    }
  }
}
