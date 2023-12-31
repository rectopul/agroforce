import { TransactionConfig } from 'src/shared/prisma/transactionConfig';
import createXls from 'src/helpers/api/xlsx-global-download';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import handleError from '../../shared/utils/handleError';
import { GenotypeTreatmentRepository } from '../../repository/genotype-treatment/genotype-treatment.repository';
import { countTreatmentsNumber } from '../../shared/utils/counts';
import { removeEspecialAndSpace } from '../../shared/utils/removeEspecialAndSpace';

export class GenotypeTreatmentController {
  genotypeTreatmentRepository = new GenotypeTreatmentRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    parameters.AND = [];
    const equalsOrContains = options.importValidate ? 'equals' : 'contains';
    parameters.OR = [];
    try {
      options = await removeEspecialAndSpace(options);
      if (options.createFile) {
        const sheet = await createXls(options, 'ENSAIO-GENOTIPE');
        return { status: 200, response: sheet };
      }
      if (options.filterStatus) {
        const statusParams = options.filterStatus?.split(',');
        parameters.OR.push(JSON.parse(`{ "assay_list": {"status": {"equals": "${statusParams[0]}" } } }`));
        parameters.OR.push(JSON.parse(`{ "assay_list": {"status": {"equals": "${statusParams[1]}" } } }`));
      }
      if (options.filterBgmFrom || options.filterBgmTo) {
        if (options.filterBgmFrom && options.filterBgmTo) {
          if (options.filterNcaFrom.toUpperCase() === 'VAZIO' || options.filterNcaTo.toUpperCase() === 'VAZIO') {
            parameters.nca = null;
          } else {
            parameters.AND.push(JSON.parse(`{ "assay_list": {"bgm": {"gte": ${Number(options.filterBgmFrom)}, "lte": ${Number(options.filterBgmTo)} } } }`));
          }
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

      if (options.filterGmrFrom || options.filterGmrTo) {
        if (options.filterGmrFrom && options.filterGmrTo) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"gmr": {"gte": ${Number(options.filterGmrFrom)}, "lte": ${Number(options.filterGmrTo)} } } }`));
        } else if (options.filterGmrFrom) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"gmr": {"gte": ${Number(options.filterGmrFrom)} } } }`));
        } else if (options.filterGmrTo) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"gmr": {"lte": ${Number(options.filterGmrTo)} } } }`));
        }
      }

      if (options.filterBgmGenotypeFrom || options.filterBgmGenotypeTo) {
        if (options.filterBgmGenotypeFrom && options.filterBgmGenotypeTo) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"bgm": {"gte": ${Number(options.filterBgmGenotypeFrom)}, "lte": ${Number(options.filterBgmGenotypeTo)} } } }`));
        } else if (options.filterBgmGenotypeFrom) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"bgm": {"gte": ${Number(options.filterBgmGenotypeFrom)} } } }`));
        } else if (options.filterBgmGenotypeTo) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"bgm": {"lte": ${Number(options.filterBgmGenotypeTo)} } } }`));
        }
      }

      if (options.filterStatusT) {
        parameters.status = JSON.parse(`{ "contains":"${options.filterStatusT}" }`);
      }
      // if (options.filterNca) {
      //   if (options.filterNca === 'vazio') {
      //     parameters.AND.push(JSON.parse(`{"id_lote": ${null} }`));
      //   } else {
      //     parameters.AND.push(JSON.parse(`{ "lote": {"ncc": "${options.filterNca}" } } `));
      //   }
      // }
      if (options.filterNcaFrom || options.filterNcaTo) {
        if (options.filterNcaFrom.toUpperCase() === 'VAZIO' || options.filterNcaTo.toUpperCase() === 'VAZIO') {
          parameters.id_lote = null;
        } else if (options.filterNcaFrom && options.filterNcaTo) {
          parameters.lote = JSON.parse(
            `{ "ncc": {"gte": "${Number(options.filterNcaFrom)}", "lte": "${Number(
              options.filterNcaTo,
            )}" } }`,
          );
        } else if (options.filterNcaFrom) {
          parameters.lote = JSON.parse(
            `{ "ncc": {"gte": "${Number(options.filterNcaFrom)}" } }`,
          );
        } else if (options.filterNcaTo) {
          parameters.lote = JSON.parse(
            `{ "ncc": {"lte": "${Number(options.filterNcaTo)}" } }`,
          );
        }
      }
      if (options.filterTreatmentsNumber) {
        if (typeof options.filterTreatmentsNumber === 'number') {
          parameters.treatments_number = Number(options.filterTreatmentsNumber);
        }
      }
      if (options.filterFoco) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"foco": {"name": {"${equalsOrContains}": "${options.filterFoco}" } } } }`));
      }
      if (options.filterTypeAssay) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"type_assay": {"name": {"${equalsOrContains}": "${options.filterTypeAssay}" } } } }`));
      }
      if (options.filterGli) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"gli": {"${equalsOrContains}": "${options.filterGli}" } } }`));
      }
      if (options.filterTechnology) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"tecnologia": { "name":  {"${equalsOrContains}": "${options.filterTechnology}" } } } }`));
      }
      if (options.filterCodTec) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"tecnologia": { "cod_tec":  {"${equalsOrContains}": "${options.filterCodTec}" } } } }`));
      }
      if (options.filterGgenName) {
        parameters.AND.push(JSON.parse(`{ "genotipo": {"tecnologia": { "name":  {"${equalsOrContains}": "${options.filterGgenName}" } } } }`));
      }
      if (options.filterGgenCod) {
        parameters.AND.push(JSON.parse(`{ "genotipo": {"tecnologia": { "cod_tec":  {"${equalsOrContains}": "${options.filterGgenCod}" } } } }`));
      }
      if (options.filterBgm) {
        if (typeof options.filterBgm === 'number') {
          parameters.AND.push(JSON.parse(`{ "assay_list": {"bgm":  ${Number(options.filterBgm)}  } }`));
        }
      }
      if (options.filterStatusAssay) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"status": {"${equalsOrContains}": "${options.filterStatusAssay}" } } }`));
      }
      if (options.filterGenotypeName) {
        parameters.AND.push(JSON.parse(`{ "genotipo": {"name_genotipo":  {"${equalsOrContains}": "${options.filterGenotypeName}" }  } }`));
      }
      if (options.filterStatusAssay) {
        parameters.AND.push(JSON.parse(`{ "assay_list": {"status": {"${equalsOrContains}": "${options.filterStatusAssay}" } } }`));
      }
      if (options.status_experiment) {
        if (options.status_experiment.includes(',')) {
          const filter = options.status_experiment.split(',');
          parameters.OR.push(JSON.parse(`{"assay_list": { "status": {"${equalsOrContains}": "${filter[0]}" } } }`));
          parameters.OR.push(JSON.parse(`{"assay_list": { "status": {"${equalsOrContains}": "${filter[1]}" } } }`));
        } else {
          parameters.AND.push(JSON.parse(`{"assay_list": { "status": {"${equalsOrContains}": "${options.status_experiment}" } } }`));
        }
      }
      const select = {
        id: true,
        id_lote: true,
        id_genotipo: true,
        safra: {
          select: {
            id: true,
            safraName: true,
            culture: true,
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
            project: true,
            comments: true,
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
      
      if(options.filterIdList){
        //parameters.id = JSON.parse(`{"in": ${options.idList} }`);
        //parameters.id = JSON.parse(`{"in": ${options.filterIdList} }`);
        parameters.id = {in: options.filterIdList};
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        if (!options.excel) {
          if (typeof options.orderBy !== 'string') {
            if (options.orderBy[2] == '' || !options.orderBy[2]) {
              orderBy = [`{"${options.orderBy[0]}":"${options.typeOrder[0]}"}`, `{"${options.orderBy[1]}":"${options.typeOrder[1]}"}`];
            } else {
              orderBy = handleOrderForeign(options.orderBy[2], options.typeOrder[2]);
              orderBy = orderBy || `{"${options.orderBy[2]}":"${options.typeOrder[2]}"}`;
            }
          } else {
            orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
            orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
          }
        }
      }

      if (parameters.OR.length === 0) {
        delete parameters.OR;
      }

      if (parameters.AND.length === 0) {
        delete parameters.AND;
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
      throw new Error('[Controller] - GetAll Tratamentos do genótipo erro: '+ error.message);
    }
  }

  /**
   * Busca tratamentos do genótipo pelo nome do gli e nome do genótipo e ncc do lote
   * @param nameGli
   * @param nameGenotype
   * @param nccLote
   * @returns
   */
  async findByNameGenotypeAndNccLote(nameGli: string, nameGenotype: string, nccLote: number) {
    try {
      
      const response = await this.genotypeTreatmentRepository.findByNameGenotypeAndNccLote(nameGli, nameGenotype, nccLote);
      
      if (!response) throw new Error('Tratamentos do genótipo não encontrada');

      return {status: 200, response};
      
    } catch (error: any) {
      handleError('Tratamentos do genótipo controller', 'findByNameGenotypeAndNccLote', error.message);
      throw new Error('[Controller] - findByNameGenotypeAndNccLote Tratamentos do genótipo erro: '+error.message);
    }
  }
  
  async getOne(id: number) {
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
      if (data.id) {
        const response: any = await this.genotypeTreatmentRepository.findById(data.id);

        if (!response) return { status: 404, response, message: 'Tratamentos do genótipo não existente' };

        await this.genotypeTreatmentRepository.update(data.id, data);
      } else {
        const transactionConfig = new TransactionConfig();
        const genotypeTreatmentRepositoryTransaction = new GenotypeTreatmentRepository();
        genotypeTreatmentRepositoryTransaction.setTransaction(transactionConfig.clientManager, transactionConfig.transactionScope);
        try {
          await transactionConfig.transactionScope.run(async () => {
            for (const row in data) {
              await genotypeTreatmentRepositoryTransaction.updateTransaction(data[row].id, data[row]);
            }
          });
          return { status: 200, message: 'Tratamentos do genótipo atualizado' };
        } catch (error: any) {
          handleError('Tratamentos do genótipo controller', 'Update', error.message);
          throw new Error('[Controller] - Update Tratamentos do genótipo erro');
        }
      }
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
