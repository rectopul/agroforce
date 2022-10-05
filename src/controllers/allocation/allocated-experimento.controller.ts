import { AllocatedExperimentRepository } from '../../repository/allocated-experimento.repository';
import { ReporteRepository } from '../../repository/reporte.repository';
import handleError from '../../shared/utils/handleError';

export class AllocatedExperimentController {
  allocatedExperimentRepository = new AllocatedExperimentRepository();

  reporteRepository = new ReporteRepository();

  async getOne({ id }: any) {
    try {
      const response = await this.allocatedExperimentRepository.findById(id);

      if (!response) throw new Error('Alocação não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Alocação controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Alocação erro');
    }
  }

  async create(data: any) {
    try {
      const response = await this.allocatedExperimentRepository.create(data);
      if (response) {
        return { status: 200, message: 'Alocação cadastrado' };
      }
      return { status: 400, message: 'Experimento não cadastrado' };
    } catch (error: any) {
      handleError('Alocação controller', 'Create', error.message);
      throw new Error('[Controller] - Create Alocação erro');
    }
  }

  async update(data: any) {
    try {
      const group: any = await this.allocatedExperimentRepository.findById(data.id);

      if (!group) return { status: 400, message: 'Alocação não existente' };

      const response = await this.allocatedExperimentRepository.update(data.id, data);

      if (response) {
        return { status: 200, message: 'Alocação não cadastrado' };
      }
      return { status: 400, message: 'Alocação não cadastrado' };
    } catch (error: any) {
      handleError('Alocação controller', 'Update', error.message);
      throw new Error('[Controller] - Update Alocação erro');
    }
  }

  async getAll(options: any) {
    const parameters: object | any = {};
    try {
      const select = {
        seq: true,
        experimentName: true,
        npei: true,
        npef: true,
        parcelas: true,
      };

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

      const response: object | any = await this.allocatedExperimentRepository.findAll(
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
      handleError('Alocação controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Alocação erro');
    }
  }
}
