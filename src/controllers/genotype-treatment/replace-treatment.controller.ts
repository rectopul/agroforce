import { GenotypeTreatmentRepository } from '../../repository/genotype-treatment/genotype-treatment.repository';
import { LoteRepository } from '../../repository/lote.repository';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import handleError from '../../shared/utils/handleError';

export class ReplaceTreatmentController {
  loteRepository = new LoteRepository();

  genotypeTratmentRepository = new GenotypeTreatmentRepository();

  async replace({ id: idLote, checkedTreatments }: any) {
    try {
      const idList: any = [];
      Object.keys(checkedTreatments).forEach((item: any) => {
        checkedTreatments[item] ? idList.push(Number(item)) : undefined;
      });
      await this.genotypeTratmentRepository.replace(idList, idLote);
    } catch (error: any) {
      handleError('Substituição do genótipo do genótipo controller', 'Replace', error.message);
      throw new Error('[Controller] - Substituição do genótipo do genótipo erro');
    }
  }

  async getAll(options: any) {
    const parameters: object | any = {};
    let orderBy: object | any;
    parameters.OR = [];
    parameters.AND = [];
    try {
      if (options.filterYear) {
        parameters.year = Number(options.filterYear);
      }
      if (options.filterCodLote) {
        parameters.cod_lote = JSON.parse(`{ "contains":"${options.filterCodLote}" }`);
      }
      if (options.filterNcc) {
        parameters.ncc = Number(options.filterNcc);
      }
      if (options.filterPeso) {
        parameters.peso = Number(options.filterPeso);
      }
      if (options.filterFase) {
        parameters.fase = JSON.parse(`{ "contains":"${options.filterFase}" }`);
      }
      if (options.filterSeeds) {
        parameters.quant_sementes = Number(options.filterSeeds);
      }
      if (options.filterGenotipo) {
        parameters.AND.push(JSON.parse(`{ "genotipo": {"name_genotipo": {"contains": "${options.filterGenotipo}" } } }`));
      }
      if (options.filterMainName) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "name_main": {"contains": "${options.filterMainName}" } } }`));
      }
      if (options.filterGmr) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "gmr":  ${Number(options.filterGmr)}  } }`));
      }
      if (options.filterBgm) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "bgm":  ${Number(options.filterBgm)}  } }`));
      }
      if (options.filterTecnologia) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "name": {"contains": "${options.filterTecnologia}" } } }`));
      }

      const select = {
        id: true,
        id_genotipo: true,
        id_safra: true,
        cod_lote: true,
        id_s2: true,
        id_dados: true,
        year: true,
        ncc: true,
        fase: true,
        peso: true,
        quant_sementes: true,
        status: true,
        genotipo: {
          select: {
            name_genotipo: true,
            name_main: true,
            gmr: true,
            bgm: true,
            tecnologia: { select: { name: true } },
          },
        },
      };

      if (options.checkedTreatments) {
        const checkedParams = options.checkedTreatments.split(',');
        parameters.OR = checkedParams.map((item: any) => (item ? (JSON.parse(`{ "genotipo": {"name_genotipo":  {"contains": "${item}" }  } }`)) : undefined));
      }

      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.loteRepository.findAll(
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
}
