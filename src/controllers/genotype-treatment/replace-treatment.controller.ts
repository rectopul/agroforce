import { GenotypeTreatmentRepository } from '../../repository/genotype-treatment/genotype-treatment.repository';
import { ExperimentGenotipeRepository } from '../../repository/experiment-genotipe.repository';
import { LoteRepository } from '../../repository/lote.repository';
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import handleError from '../../shared/utils/handleError';
import { IReturnObject } from '../../interfaces/shared/Import.interface';
import { LoteController } from '../lote.controller';
import { GenotipoController } from '../genotype/genotipo.controller';

export class ReplaceTreatmentController {
  loteRepository = new LoteRepository();

  genotypeTreatmentRepository = new GenotypeTreatmentRepository();

  experimentGenotipeRepository = new ExperimentGenotipeRepository();

  genotipoController = new GenotipoController();

  loteController = new LoteController();

  async replace({ id, checkedTreatments, value }: any) {
    try {
      const idList: any = checkedTreatments.map(
        (row: any) => (row.id ? Number(row.id) : undefined),
      );

      const { response: lote }: IReturnObject = await this.loteController.getOne(id);

      const ncc = (lote.ncc).toString(); // Ncc value
      const lote_id = lote.id; // Lote Id value
      const geneticName_id = lote.id_genotipo; // Genetic Id value
      let geneticName;

      const { response: genraticName }: IReturnObject = await this.genotipoController.getOne(lote.id_genotipo);
      geneticName = genraticName.name_genotipo; // Genetic value

      if (checkedTreatments[0]?.genotipo) {
        let response;
        if (value == 'ensaios') {
          response = await this.genotypeTreatment(idList, lote_id, geneticName_id); // third argument for chnage genetic value also
        } else if (value == 'experiment') {
          response = await this.experiment(idList, ncc, lote_id, geneticName_id); // third argument for chnage genetic value also
        }

        if (response) {
          return { status: 200, response, message: 'NCA Substituído com sucesso' };
        }
        return { status: 400, response, message: 'Erro ao substituir NCA' };
      }

      let response;
      if (value == 'ensaios') {
        response = await this.genotypeTreatment(idList, lote_id, geneticName_id); // third argument for chnage genetic value also
      } else if (value == 'experiment') {
        response = await this.experiment(idList, ncc, lote_id, geneticName_id);
      }
      if (response) {
        return { status: 200, response, message: 'Genótipo Substituído com sucesso' };
      }
      return { status: 400, response, message: 'Erro ao substituir Genótipo' };

      // Old code based on radio button selection
      /* if (checkedTreatments[0]?.genotipo) {
        let response;
        if(value == 'ensaios'){
          response = await this.genotypeTreatmentRepository.replaceLote(idList, id);
        }
        else if(value == 'experiment'){
          response = await this.experimentGenotipeRepository.replaceLote(idList, ncc)
        }

        if (response) {
          return { status: 200, response, message: 'NCA Substituído com sucesso' };
        }
        return { status: 400, response, message: 'Erro ao substituir NCA' };
      }

      let NameOrId;

      if(value == 'experiment'){
        const { response: genraticName }: IReturnObject = await this.genotipoController.getOne(lote.id_genotipo);
        NameOrId = genraticName.name_genotipo;

      }

      let response;
      if(value == 'ensaios'){
       response = await this.genotypeTreatmentRepository.replaceGenotype(
        idList,

        lote.id_genotipo,
      );
      }
      else if(value == 'experiment'){
        response = await this.experimentGenotipeRepository.replaceGenotype(
          idList,
          NameOrId,
        );
      }
      if (response) {
        return { status: 200, response, message: 'Genótipo Substituído com sucesso' };
      }
      return { status: 400, response, message: 'Erro ao substituir Genótipo' }; */
    } catch (error: any) {
      handleError('Substituição do genótipo do genótipo controller', 'Replace', error.message);
      throw new Error('[Controller] - Substituição do genótipo do genótipo erro');
    }
  }

  async genotypeTreatment(idList:any, lote_id :any, geneticName_id :any) {
    const response = await this.genotypeTreatmentRepository.replaceGenotype(
      idList,
      lote_id,
      geneticName_id,
    );

    return response;
  }

  async experiment(idList:any, ncc :any, lote_id: any, genetic_id :any) {
    const response = await this.experimentGenotipeRepository.replaceLote(
      idList,
      ncc,
      lote_id,
      genetic_id,
    );

    return response;
  }

  async getAll(options: any) {
    console.log('🚀 ~ file: replace-treatment.controller.ts ~ line 132 ~ ReplaceTreatmentController ~ getAll ~ options', options);
    const parameters: object | any = {};
    let orderBy: object | any;
    parameters.OR = [];
    parameters.AND = [];
    try {
      if (options.filterYear) {
        parameters.year = Number(options.filterYear);
      }
      if (options.filterYearFrom || options.filterYearTo) {
        if (options.filterYearFrom && options.filterYearTo) {
          parameters.year = JSON.parse(`{"gte": ${Number(options.filterYearFrom)}, "lte": ${Number(options.filterYearTo)} }`);
        } else if (options.filterYearFrom) {
          parameters.year = JSON.parse(`{"gte": ${Number(options.filterYearFrom)} }`);
        } else if (options.filterYearTo) {
          parameters.year = JSON.parse(`{"lte": ${Number(options.filterYearTo)} }`);
        }
      }
      if (options.filterCodLoteFrom || options.filterCodLoteTo) {
        if (options.filterCodLoteFrom && options.filterCodLoteTo) {
          parameters.cod_lote = JSON.parse(`{"gte": ${Number(options.filterCodLoteFrom)}, "lte": ${Number(options.filterCodLoteTo)} }`);
        } else if (options.filterCodLoteFrom) {
          parameters.cod_lote = JSON.parse(`{"gte": ${Number(options.filterCodLoteFrom)} }`);
        } else if (options.filterCodLoteTo) {
          parameters.cod_lote = JSON.parse(`{"lte": ${Number(options.filterCodLoteTo)} }`);
        }
      }
      if (options.filterNcaFrom || options.filterNcaTo) {
        if (options.filterNcaFrom === 'vazio' || options.filterNcaTo === 'vazio') {
          parameters.ncc = null;
        } else if (options.filterNcaFrom && options.filterNcaTo) {
          parameters.ncc = JSON.parse(
            `{"gte": ${Number(options.filterNcaFrom)}, "lte": ${Number(
              options.filterNcaTo,
            )} }`,
          );
        } else if (options.filterNcaFrom) {
          parameters.ncc = JSON.parse(
            `{"gte": ${Number(options.filterNcaFrom)} }`,
          );
        } else if (options.filterNcaTo) {
          parameters.ncc = JSON.parse(
            `{"lte": ${Number(options.filterNcaTo)} }`,
          );
        }
      }
      if (options.filterPeso) {
        parameters.peso = Number(options.filterPeso);
      }
      if (options.filterPesoFrom || options.filterPesoTo) {
        if (options.filterPesoFrom && options.filterPesoTo) {
          parameters.peso = JSON.parse(`{"gte": ${Number(options.filterPesoFrom)}, "lte": ${Number(options.filterPesoTo)} }`);
        } else if (options.filterPesoFrom) {
          parameters.peso = JSON.parse(`{"gte": ${Number(options.filterPesoFrom)} }`);
        } else if (options.filterPesoTo) {
          parameters.peso = JSON.parse(`{"lte": ${Number(options.filterPesoTo)} }`);
        }
      }
      if (options.filterFase) {
        parameters.fase = JSON.parse(`{ "contains":"${options.filterFase}" }`);
      }
      if (options.filterSeeds) {
        parameters.quant_sementes = Number(options.filterSeeds);
      }
      if (options.filterSeedsFrom || options.filterSeedsTo) {
        if (options.filterSeedsFrom && options.filterSeedsTo) {
          parameters.quant_sementes = JSON.parse(`{"gte": ${Number(options.filterSeedsFrom)}, "lte": ${Number(options.filterSeedsTo)} }`);
        } else if (options.filterSeedsFrom) {
          parameters.quant_sementes = JSON.parse(`{"gte": ${Number(options.filterSeedsFrom)} }`);
        } else if (options.filterSeedsTo) {
          parameters.quant_sementes = JSON.parse(`{"lte": ${Number(options.filterSeedsTo)} }`);
        }
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
      if (options.filterGmrFrom || options.filterGmrTo) {
        if (options.filterGmrFrom && options.filterGmrTo) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"gmr": {"gte": ${Number(options.filterGmrFrom)}, "lte": ${Number(options.filterGmrTo)} }}}`));
        } else if (options.filterGmrFrom) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"gmr": {"gte": ${Number(options.filterGmrFrom)} }}}`));
        } else if (options.filterGmrTo) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"gmr": {"lte": ${Number(options.filterGmrTo)} }}}`));
        }
      }
      if (options.filterBgm) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "bgm":  ${Number(options.filterBgm)}  } }`));
      }
      if (options.filterBgmFrom || options.filterBgmTo) {
        if (options.filterBgmFrom && options.filterBgmTo) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"bgm": {"gte": ${Number(options.filterBgmFrom)}, "lte": ${Number(options.filterBgmTo)} }}}`));
        } else if (options.filterBgmFrom) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"bgm": {"gte": ${Number(options.filterBgmFrom)} }}}`));
        } else if (options.filterBgmTo) {
          parameters.AND.push(JSON.parse(`{ "genotipo": {"bgm": {"lte": ${Number(options.filterBgmTo)} }}}`));
        }
      }
      if (options.filterCodTec) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "tecnologia": { "cod_tec": {"contains": "${options.filterCodTec}" } } } }`));
      }

      if (options.filterNameTec) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "tecnologia": { "desc": {"contains": "${options.filterNameTec}" } } } }`));
      }

      if (options.idCulture) {
        parameters.AND.push(JSON.parse(`{ "genotipo": { "id_culture": ${Number(options.idCulture)} } } `));
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
        safra: true,
        quant_sementes: true,
        genotipo: {
          select: {
            id: true,
            name_genotipo: true,
            name_main: true,
            gmr: true,
            bgm: true,
            tecnologia: { select: { name: true, cod_tec: true } },
          },
        },
      };

      if (options.checkedTreatments) {
        // const checkedParams = options.checkedTreatments.split(',');
        // parameters.OR = checkedParams.map((item: any) => (item ? (JSON.parse(`{ "genotipo": {"name_genotipo":  {"contains": "${item}" }  } }`)) : undefined));
        const id = options.checkedTreatments.split(',');
        parameters.id_genotipo = Number(id[0]);
      }
      const take = (options.take) ? Number(options.take) : undefined;

      const skip = (options.skip) ? Number(options.skip) : undefined;

      if (options.orderBy) {
        orderBy = handleOrderForeign(options.orderBy, options.typeOrder);
        orderBy = orderBy || `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      if (parameters.OR.length === 0) {
        delete parameters.OR;
      }

      if (parameters.AND.length === 0) {
        delete parameters.AND;
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
