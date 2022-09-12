import { ExperimentGenotipeRepository } from 'src/repository/experiment_genotipe.repository';
import handleError from '../shared/utils/handleError';

export class ExperimentGenotipeController {
  private ExperimentGenotipeRepository = new ExperimentGenotipeRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    parameters.AND = [];
    try {
      const select = {
        id: true,
        safra: { select: { safraName: true } },
        foco: { select: { name: true } },
        type_assay: { select: { name: true } },
        tecnologia: { select: { name: true, cod_tec: true } },
        gli: true,
        experiment: { select: { experimentName: true, status: true, local: { select: { name_local_culture: true } } } },
        rep: true,
        nt: true,
        npe: true,
        name_genotipo: true,
        nca: true,
      };

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const response: object | any = await this.ExperimentGenotipeRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: 0 };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Tratamentos do genótipo controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Tratamentos do genótipo erro');
    }
  }

  async create(data: object | any) {
    try {
      // console.log(data)
      const response = await this.ExperimentGenotipeRepository.createMany(data);
      if (response) {
        return { status: 200, message: 'Tratamento experimental registrado' };
      }
      return { status: 400, message: 'Tratamento do experimento não registrado' };
    } catch (error: any) {
      handleError('Tratamento do experimento do controlador', 'Create', error.message);
      throw new Error('[Controller] - Erro ao criar esboço de tratamento do experimento');
    }
  }
}
