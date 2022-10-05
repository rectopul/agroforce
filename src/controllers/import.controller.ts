/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
import { SafraController } from './safra.controller';
import { LocalController } from './local/local.controller';
import { FocoController } from './foco.controller';
import { TypeAssayController } from './tipo-ensaio.controller';
import { AssayListController } from './assay-list/assay-list.controller';
import { TecnologiaController } from './technology/tecnologia.controller';
import { NpeController } from './npe/npe.controller';
import { DelineamentoController } from './delimitation/delineamento.controller';
import { SequenciaDelineamentoController } from './sequencia-delineamento.controller';
import { GenotipoController } from './genotype/genotipo.controller';
import { LoteController } from './lote.controller';
import { QuadraController } from './block/quadra.controller';
import { DividersController } from './dividers.controller';
import { CulturaController } from './cultura.controller';
import { LayoutQuadraController } from './block-layout/layout-quadra.controller';
import { LayoutChildrenController } from './layout-children.controller';
import { GroupController } from './group.controller';
import { UnidadeCulturaController } from './local/unidade-cultura.controller';
import { ExperimentController } from './experiment/experiment.controller';
import { LogImportController } from './log-import.controller';
import { FocoRepository } from '../repository/foco.repository';
import { TecnologiaRepository } from '../repository/tecnologia.repository';
import { ImportExperimentController } from './experiment/import-experiment.controller';
import { ImportTechnologyController } from './technology/import-technology.controller';

import { ImportGenotypeTreatmentController } from './genotype-treatment/import-genotype-treatment.controller';
import { ImportRepository } from '../repository/import.repository';
// eslint-disable-next-line import/no-cycle
import { ImportGenotypeController } from './genotype/import-genotype.controller';
import { removeProtocolLevel } from '../shared/utils/removeProtocolLevel';
// eslint-disable-next-line import/no-cycle
import { ImportLocalController } from './local/import-local.controller';
import { ImportAssayListController } from './assay-list/import-assay-list.controller';
import handleError from '../shared/utils/handleError';
import { ImportBlockController } from './block/import-block.controller';
import calculatingExecutionTime from '../shared/utils/calculatingExecutionTime';
import { ImportLayoutBlockController } from './block-layout/block-layout-import.controller';
import { ImportDelimitationController } from './delimitation/delimitation-import.controller';
import { ImportNpeController } from './npe/import-npe.controller';
import { ImportAllocationController } from './allocation/import-allocation.controller';

export class ImportController {
  importRepository = new ImportRepository();

  safraController = new SafraController();

  localController = new LocalController();

  focoController = new FocoController();

  typeAssayController = new TypeAssayController();

  assayListController = new AssayListController();

  ogmController = new TecnologiaController();

  npeController = new NpeController();

  delineamentoController = new DelineamentoController();

  sequenciaDelineamentoController = new SequenciaDelineamentoController();

  genotipoController = new GenotipoController();

  loteController = new LoteController();

  quadraController = new QuadraController();

  dividersController = new DividersController();

  culturaController = new CulturaController();

  layoutQuadraController = new LayoutQuadraController();

  layoutChildrenController = new LayoutChildrenController();

  groupController = new GroupController();

  tecnologiaController = new TecnologiaController();

  unidadeCulturaController = new UnidadeCulturaController();

  experimentController = new ExperimentController();

  logImportController = new LogImportController();

  focoRepository = new FocoRepository();

  tecnologiaRepository = new TecnologiaRepository();

  aux: object | any = {};

  async getAll(moduleId: number) {
    try {
      const response = await this.importRepository.findAll({ moduleId });
      if (response) {
        return { response, status: 200 };
      }
      return { status: 200, message: 'ainda não há configuração de planilha para esse modulo!' };
    } catch (error: any) {
      handleError('GetAll controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll erro');
    }
  }

  async post(data: object | any) {
    try {
      const parameters: object | any = {};
      await this.delete(Number(data.moduleId));
      parameters.moduleId = Number(data.moduleId);
      parameters.fields = data.fields;
      const response = await this.importRepository.create(parameters);
      if (response.count > 0) {
        return { status: 200, message: 'Configuração da planilha foi salva' };
      }
      return { status: 400, message: 'erro' };
    } catch (error: any) {
      handleError('Post controller', 'Post', error.message);
      throw new Error('[Controller] - Post erro');
    }
  }

  async delete(moduleId: number) {
    try {
      if (moduleId) {
        const response: object | any = await this.importRepository.delete({ moduleId });
        return { status: 200, response };
      }
      return { status: 400, message: 'id não informado' };
    } catch (error: any) {
      handleError('delete controller', 'delete', error.message);
      throw new Error('[Controller] - delete erro');
    }
  }

  async validateProtocol(data: object | any) {
    const {
      status,
      response: responseLog,
      message,
    }: any = await this.logImportController.create({
      user_id: data.created_by,
      status: 2,
      table: String(data.spreadSheet[1][0]),
      totalRecords: (data.spreadSheet.length - 1),
      state: 'EM ANDAMENTO',
    });
    try {
      if (status === 400) {
        return {
          status: 400, message,
        };
      }

      const protocolLevel = String(data.spreadSheet[1][0]);
      const newData = removeProtocolLevel(data);
      switch (protocolLevel) {
        case 'TECHNOLOGY_S2':
          return await ImportTechnologyController.validate(responseLog?.id, newData);
        case 'CULTURE_UNIT':
          return await ImportLocalController.validate(responseLog?.id, newData);
        case 'GENOTYPE_S2':
          return await ImportGenotypeController.validate(responseLog?.id, newData);
        default:
          await this.logImportController.update({ id: responseLog?.id, status: 1, state: 'FALHA' });
          return { status: 400, response: [], message: 'Nenhum protocol_level configurado ' };
      }
    } catch (error: any) {
      handleError('Validate protocol controller', 'Validate protocol', error.message);
      throw new Error('[Controller] - Validate protocol erro');
    } finally {
      const executeTime = await calculatingExecutionTime(responseLog?.id);
      await this.logImportController.update({ id: responseLog?.id, status: 1, executeTime });
    }
  }

  async validateGeneral(data: object | any) {
    const { status: validateTraffic }: any = await this.logImportController.getAll({
      status: 2,
    });
    if (validateTraffic === 200) {
      return { status: 400, message: 'Uma importação ja esta sendo executada' };
    }
    const {
      status,
      response: responseLog,
      message,
    }: any = await this.logImportController.create({
      user_id: data.created_by,
      status: 2,
      table: data.table,
      totalRecords: (data.spreadSheet.length - 1),
      state: 'EM ANDAMENTO',
    });
    try {
      if (!data.moduleId) return { status: 400, message: 'precisa ser informado o modulo que está sendo acessado!' };

      if (status === 400) {
        return {
          status: 200, message, error: true,
        };
      }

      let response: any;
      const erro: any = false;
      const configModule: object | any = await this.getAll(Number(data.moduleId));

      if (data.moduleId !== 22
          && data.moduleId !== 31
          && data.moduleId !== 23
          && data.moduleId !== 27
          && data.moduleId !== 26) {
        if (configModule.response == '') return { status: 200, message: 'Primeiro é preciso configurar o modelo de planilha para esse modulo!' };
      }

      if (data.moduleId === 27) {
        return await ImportGenotypeTreatmentController.validate(responseLog?.id, data);
      }

      if (data.moduleId === 22) {
        return await ImportExperimentController.validate(responseLog?.id, data);
      }

      // Validação Lista de Ensaio
      if (data.moduleId === 26) {
        return await ImportAssayListController.validate(responseLog?.id, data);
      }

      // Validação do modulo Local
      if (data.moduleId === 4) {
        return await ImportLocalController.validate(responseLog?.id, data);
      }
      // Validação do modulo Layout Quadra
      if (data.moduleId === 5) {
        return await ImportLayoutBlockController.validate(responseLog?.id, data);
      }

      // Validação do modulo Delineamento
      if (data.moduleId === 7) {
        return await ImportDelimitationController.validate(responseLog?.id, data);
      }

      // Validação do modulo Genotipo
      if (data.moduleId === 10) {
        return await ImportGenotypeController.validate(responseLog?.id, data);
      }

      // Validação do modulo NPE
      if (data.moduleId === 14) {
        return await ImportNpeController.validate(responseLog?.id, data);
      }

      // Validação do modulo quadra
      if (data.moduleId === 17) {
        return await ImportBlockController.validate(responseLog?.id, data);
      }

      // Validação do modulo tecnologia
      if (data.moduleId === 8) {
        return await ImportTechnologyController.validate(responseLog?.id, data);
      }

      // Validação do modulo alocação
      if (data.moduleId === 31) {
        return await ImportAllocationController.validate(responseLog?.id, data);
      }

      return { status: 200, message: response, error: erro };
    } catch (error: any) {
      handleError('Validate general controller', 'Validate general', error.message);
      throw new Error('[Controller] - Validate general erro');
    } finally {
      const executeTime = await calculatingExecutionTime(responseLog?.id);
      await this.logImportController.update({ id: responseLog?.id, status: 1, executeTime });
    }
  }
}
