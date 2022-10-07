import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import handleError from '../../shared/utils/handleError';
import { GenotypeTreatmentRepository } from '../../repository/genotype-treatment/genotype-treatment.repository';
import { countTreatmentsNumber } from '../../shared/utils/counts';

export class GenotypeTreatmentController {
  genotypeTreatmentRepository = new GenotypeTreatmentRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    parameters.AND = [];
    try {
      if (options.filterStatus) {
        parameters.OR = [];
        const statusParams = options.filterStatus.split(',');
        parameters.OR.push(JSON.parse(`{ "assay_list": {"status": {"equals": "${statusParams[0]}" } } }`));
        parameters.OR.push(JSON.parse(`{ "assay_list": {"status": {"equals": "${statusParams[1]}" } } }`));
      }
      if (options.filterBgmFrom || options.filterBgmTo) {
        if (options.filterBgmFrom && options.filterBgmTo) {
          parameters.AND.push(JSON.parse(`{ "assay_list": {"bgm": {"gte": ${Number(options.filterBgmFrom)}, "lte": ${Number(options.filterBgmTo)} } } }`));
        } else if (options.filterBgmFrom) {
          parameters.AND.push(JSON.parse(`{ "assay_list": {"bgm": {"gte": ${Number(options.filterBgmFrom)} } } }`));
        } else if (options.filterBgmTo) {
          parameters.AND.push(JSON.parse(`{ "assay_list": {"bgm": {"lte": ${Number(options.filterBgmTo)} } } }`));
        }
      }
      if (options.filterNtFrom || options.filterNtTo) {
        if (options.filterNtFrom && options.filterNtTo) {
          parameters.treatments_number = JSON.parse(`{"gte": ${Number(options.filterNtFrom)}, "lte": ${Number(options.filterNtTo)} }`);
        } else if (options.filterNtFrom) {
          parameters.treatments_number = JSON.parse(`{"gte": ${Number(options.filterNtFrom)} }`);
        } else if (options.filterNtTo) {
          parameters.treatments_number = JSON.parse(`{"lte": ${Number(options.filterNtTo)} }`);
        }
      }

      if (options.filterStatusT) {
        parameters.status = JSON.parse(`{ "contains":"${options.filterStatusT}" }`);
      }
      if (options.filterNca) {
        parameters.AND.push(JSON.parse(`{ "lote": {"ncc": "${options.filterNca}" } } `));
      }
      if (options.filterTreatmentsNumber) {
        parameters.treatments_number = Number(options.filterTreatmentsNumber);
      }
      if (options.filterFoco) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"foco": {"name": {"contains": "${options.filterFoco}" } } } }`));
      }
      if (options.filterTypeAssay) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"type_assay": {"name": {"contains": "${options.filterTypeAssay}" } } } }`));
      }
      if (options.filterGli) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"gli": {"contains": "${options.filterGli}" } } }`));
      }
      if (options.filterTechnology) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"tecnologia": { "name":  {"contains": "${options.filterTechnology}" } } } }`));
      }
      if (options.filterCodTec) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"tecnologia": { "cod_tec":  {"contains": "${options.filterCodTec}" } } } }`));
      }
      if (options.filterBgm) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"bgm":  ${Number(options.filterBgm)}  } }`));
      }
      if (options.filterStatusAssay) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"status": {"contains": "${options.filterStatusAssay}" } } }`));
      }
      if (options.filterGenotypeName) {
        parameters.AND.push(JSON.parse(`{ "genotipo": {"name_genotipo":  {"contains": "${options.filterGenotypeName}" }  } }`));
      }
      if (options.filterStatusAssay) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"status": {"contains": "${options.filterStatusAssay}" } } }`));
      }
      if (options.status_experiment) {
        parameters.status_experiment = JSON.parse(`{"contains": "${options.status_experiment}" }`);
      }
      const select = {
        id: true,
        id_lote: true,
        id_genotipo: true,
        safra: {
          select: {
            id: true,
            safraName: true,
          },
        },
        genotipo: {
          select: {
            id: true,
            name_genotipo: true,
            gmr: true,
            bgm: true,
            tecnologia: {
              select: {
                cod_tec: true,
                name: true,
              },
            },
          },
        },
        treatments_number: true,
        status: true,
        status_experiment: true,
        lote: {
          select: {
            ncc: true,
            cod_lote: true,
            fase: true,
          },
        },
        assay_list: {
          select: {
            foco: { select: { id: true, name: true } },
            experiment: { select: { id: true, experimentName: true } },
            type_assay: { select: { id: true, name: true } },
            tecnologia: { select: { id: true, name: true, cod_tec: true } },
            gli: true,
            bgm: true,
            status: true,
          },
        },
        comments: true,
      };

      if (options.id_safra) {
        parameters.id_safra = Number(options.id_safra);
      }

      if (options.id_assay_list) {
        parameters.id_assay_list = Number(options.id_assay_list);
      }

      if (options.treatments_number) {
        parameters.treatments_number = Number(options.treatments_number);
      }

      if (options.gli) {
        parameters.assay_list = (JSON.parse(`{"gli": {"contains": "${options.gli}" } }`));
      }

      if (options.name_genotipo) {
        parameters.genotipo = (JSON.parse(`{"name_genotipo": {"contains": "${options.name_genotipo}" } }`));
      }

      if (options.nca) {
        parameters.lote = (JSON.parse(`{"ncc": ${Number(options.nca)} }`));
      }

      if (options.status) {
        parameters.status = options.status;
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
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

  // async create(data: any) {
  //   try {
  //     console.log("herere   ");
  //     return false
  //     await this.genotypeTreatmentRepository.create(data);
  //     await countTreatmentsNumber(data.id_assay_list);
  //     return { status: 200, message: 'Tratamentos do genótipo cadastrada' };
  //   } catch (error: any) {
  //     handleError('Tratamentos do genótipo controller', 'Create', error.message);
  //     throw new Error('[Controller] - Create Tratamentos do genótipo erro');
  //   }
  // }


  async create(data: any) {
    try {
      // console.log("herere   ",data);
      // return false
      await this.genotypeTreatmentRepository.create(data);
      await countTreatmentsNumber(data.id_assay_list);
      return { status: 200, message: 'Tratamentos do genótipo cadastrada' };
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

  async deleteAll(idAssayList: number) {
    try {
      const response = await this.genotypeTreatmentRepository.deleteAll(Number(idAssayList));
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
