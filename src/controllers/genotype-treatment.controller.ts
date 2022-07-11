import handleError from '../shared/utils/handleError';
import { GenotypeTreatmentRepository } from '../repository/genotype-treatment.repository';

export class GenotypeTreatmentController {
  genotypeTreatmentRepository = new GenotypeTreatmentRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    let select: any = [];
    try {
      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          if (objSelect[item] !== 'genotipoName'
            && objSelect[item] !== 'genotipoGmr'
            && objSelect[item] !== 'genotipoBgm'
            && objSelect[item] !== 'genotipoName'
            && objSelect[item] !== 'fase'
            && objSelect[item] !== 'cod_tec'
            && objSelect[item] !== 'cod_lote') {
            select[objSelect[item]] = true;
          }
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          id_safra: true,
          genotipo: {
            select: {
              name_genotipo: true,
              gmr: true,
              bgm: true,
              lote: {
                select: {
                  cod_lote: true,
                  fase: true,
                },
              },
              tecnologia: {
                select: {
                  cod_tec: true,
                },
              },
            },
          },
          treatments_number: true,
          status: true,
          nca: true,
          comments: true,
        };
      }

      if (options.id_safra) {
        parameters.id_safra = Number(options.id_safra);
      }

      if (options.id_assay_list) {
        parameters.id_assay_list = Number(options.id_assay_list);
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

     
      const response: object | any = await this.genotypeTreatmentRepository.findAll(
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

  async getOne({ id }: any) {
    try {
      const response = await this.genotypeTreatmentRepository.findById(id);

      if (!response) throw new Error('Tratamentos do genótipo não encontrada');

      return { status: 200, response };
    } catch (error: any) {
      handleError('Tratamentos do genótipo controller', 'getOne', error.message);
      throw new Error('[Controller] - getOne Tratamentos do genótipo erro');
    }
  }

  async create(data: any) {
    try {
      await this.genotypeTreatmentRepository.create(data);

      return { status: 201, message: 'Tratamentos do genótipo cadastrada' };
    } catch (error: any) {
      handleError('Tratamentos do genótipo controller', 'Create', error.message);
      throw new Error('[Controller] - Create Tratamentos do genótipo erro');
    }
  }

  async update(data: any) {
    try {
      const response: any = await this.genotypeTreatmentRepository.findById(data.id);

      if (!response) return { status: 404, response, message: 'Tratamentos do genótipo não existente' };

      await this.genotypeTreatmentRepository.update(data.id, data);

      return { status: 200, message: 'Tratamentos do genótipo atualizado' };
    } catch (error: any) {
      handleError('Tratamentos do genótipo controller', 'Update', error.message);
      throw new Error('[Controller] - Update Tratamentos do genótipo erro');
    }
  }

  async deleteAll() {
    try {
      const response = await this.genotypeTreatmentRepository.deleteAll();
      if (response) {
        return { status: 200, message: 'Tratamentos do genótipo excluídos' };
      }
      return { status: 400, message: 'Tratamentos do genótipo não excluídos' };
    } catch (error: any) {
      handleError('Tratamentos do genótipo controller', 'DeleteAll', error.message);
      throw new Error('[Controller] - DeleteAll Tratamentos do genótipo erro');
    }
  }
}
