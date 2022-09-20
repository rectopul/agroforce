import { EnvelopeRepository } from '../repository/envelope.repository';
import { ReporteRepository } from '../repository/reporte.repository';
import handleError from '../shared/utils/handleError';

export class EnvelopeController {
  public readonly required = 'Campo obrigatório';

  envelopeRepository = new EnvelopeRepository();

  reporteRepository = new ReporteRepository();

  async getOne({ id }: any) {
    try {
      const response = await this.envelopeRepository.findById(id);

      if (!response) throw new Error('envelope não encontrado');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Envelope controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Envelope erro');
    }
  }

  async create(data: any) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json());

      const envelopeAlreadyExists = await this.envelopeRepository.findByData(
        data,
      );

      if (envelopeAlreadyExists) {
        return { status: 400, message: 'Envelope já cadastrado nessa safra' };
      }

      const semente: any = await this.envelopeRepository.create(data);
      await this.reporteRepository.create({
        madeBy: semente.created_by, module: 'Qtd de Sementes', operation: 'Cadastro', name: JSON.stringify(semente.id_type_assay), ip: JSON.stringify(ip), idOperation: semente.id,
      });
      return { status: 200, message: 'envelope cadastrado' };
    } catch (error: any) {
      handleError('Envelope controller', 'Create', error.message);
      throw new Error('[Controller] - Create Envelope erro');
    }
  }

  async update(data: any) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json());

      const envelope: any = await this.envelopeRepository.findById(data.id);

      if (!envelope) return { status: 400, message: 'envelope não existente' };

      const semente: any = await this.envelopeRepository.update(data.id, data);
      await this.reporteRepository.create({
        madeBy: semente.created_by, module: 'Qtd de Sementes', operation: 'Edição', name: JSON.stringify(semente.id_type_assay), ip: JSON.stringify(ip), idOperation: semente.id,
      });

      return { status: 200, message: 'envelope atualizado' };
    } catch (error: any) {
      handleError('Envelope controller', 'Update', error.message);
      throw new Error('[Controller] - Update Envelope erro');
    }
  }

  async getAll(options: any) {
    const parameters: object | any = {};

    try {
      const select = {
        id: true,
        id_safra: true,
        type_assay: { select: { name: true } },
        safra: { select: { safraName: true } },
        seeds: true,
      };

      if (options.id_safra) {
        parameters.id_safra = Number(options.id_safra);
      }

      if (options.id_type_assay) {
        parameters.id_type_assay = Number(options.id_type_assay);
      }

      if (options.id_safra) {
        parameters.id_safra = Number(options.id_safra);
      }

      const take = options.take ? Number(options.take) : undefined;

      const skip = options.skip ? Number(options.skip) : undefined;

      const orderBy = options.orderBy
        ? `{"${options.orderBy}":"${options.typeOrder}"}`
        : undefined;

      const response: object | any = await this.envelopeRepository.findAll(
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
      handleError('Envelope controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Envelope erro');
    }
  }
}
