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
import { NpeController } from './npe.controller';
import { DelineamentoController } from './delineamento.controller';
import { SequenciaDelineamentoController } from './sequencia-delineamento.controller';
import { GenotipoController } from './genotype/genotipo.controller';
import { LoteController } from './lote.controller';
import { QuadraController } from './block/quadra.controller';
import { DividersController } from './dividers.controller';
import { CulturaController } from './cultura.controller';
import { LayoutQuadraController } from './layout-quadra.controller';
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
    } catch (err) {
      console.log(err);
      return 'Houve um erro, tente novamente mais tarde!1';
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
    } catch (err) {
      console.log(err);
      return 'Houve um erro, tente novamente mais tarde!2';
    }
  }

  async delete(moduleId: number) {
    try {
      if (moduleId) {
        const response: object | any = await this.importRepository.delete({ moduleId });
        return { status: 200, response };
      }
      return { status: 400, message: 'id não informado' };
    } catch (err) {
      return { status: 400, message: err };
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
    } catch (error) {
      return { status: 400, message: error };
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
    });
    try {
      if (!data.moduleId) return { status: 400, message: 'precisa ser informado o modulo que está sendo acessado!' };

      if (data.moduleId === 27) {
        return await ImportGenotypeTreatmentController.validate(responseLog?.id, data);
      }

      if (status === 400) {
        return {
          status: 200, message, error: true,
        };
      }

      let response: any;
      let erro: any = false;
      const configModule: object | any = await this.getAll(Number(data.moduleId));

      if (data.moduleId !== 22
          && data.moduleId !== 23
          && data.moduleId !== 27
          && data.moduleId !== 26) {
        if (configModule.response == '') return { status: 200, message: 'Primeiro é preciso configurar o modelo de planilha para esse modulo!' };
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
        response = await this.validateLayoutQuadra(data);
        if (response == 'save') {
          response = 'Itens cadastrados com sucesso!';
        } else {
          erro = true;
        }
      }

      // Validação do modulo Delineamento
      if (data.moduleId == 7) {
        response = await this.validateDelineamentoNew(data);
        if (response == 'save') {
          response = 'Itens cadastrados com sucesso!';
        } else {
          erro = true;
        }
      }

      // Validação do modulo Genotipo
      if (data.moduleId == 10) {
        return await ImportGenotypeController.validate(responseLog?.id, data);
      }

      // Validação do modulo Lote
      if (data.moduleId == 12) {
        response = await this.validateLote(data);
        if (response == 'save') {
          response = 'Itens cadastrados com sucesso!';
        } else {
          erro = true;
        }
      }

      // Validação do modulo NPE
      if (data.moduleId == 14) {
        response = await this.validateNPE(data);
        if (response == 'save') {
          response = 'Itens cadastrados com sucesso!';
        } else {
          erro = true;
        }
      }

      // Validação do modulo quadra
      if (data.moduleId == 17) {
        return await ImportBlockController.validate(responseLog?.id, data);
      }

      // Validação do modulo tecnologia
      if (data.moduleId === 8) {
        return await ImportTechnologyController.validate(responseLog?.id, data);
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

  async validateNPE(data: object | any) {
    const responseIfError: any = [];
    let Column: number;
    try {
      const configModule: object | any = await this.getAll(Number(data.moduleId));

      // console.log("ini npe");
      // console.log(data);
      if (data != null && data != undefined) {
        let Line: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              this.aux.status = 1;
              this.aux.created_by = data.created_by;
              this.aux.npef = 0;
              this.aux.prox_npe = 0;
              if (configModule.response[0]?.fields[sheet] == 'Local') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) === 'string') {
                    const local: any = await this.localController.getAll({ name_local_culture: data.spreadSheet[keySheet][sheet] });
                    if (local.total == 0) {
                      // console.log('aqui Local');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o local não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_local = local.response[0]?.id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, local deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do local é obrigatorio.</li><br>`;
                }
              }

              // console.log("local npe ok");

              if (configModule.response[0]?.fields[sheet] == 'Safra') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) === 'string') {
                    const validateSafra: any = await this.safraController.getOne(Number(data.safra));
                    if (data.spreadSheet[keySheet][sheet] != validateSafra.response.safraName) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, A safra a ser importada tem que ser a mesma selecionada.</li><br>`;
                    }
                    const safras: any = await this.safraController.getAll({ safraName: data.spreadSheet[keySheet][sheet] });
                    if (safras.total == 0) {
                      // console.log('aqui Safra');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a safra não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_safra = safras.response[0]?.id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, safra deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome da safra é obrigatorio.</li><br>`;
                }
              }

              // console.log("safra npe ok");

              if (configModule.response[0]?.fields[sheet] == 'OGM') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if ((typeof (data.spreadSheet[keySheet][sheet])) === 'number' && data.spreadSheet[keySheet][sheet].toString().length < 2) {
                    data.spreadSheet[keySheet][sheet] = `0${data.spreadSheet[keySheet][sheet].toString()}`;
                  }
                  const cod_tec_input = String(data.spreadSheet[keySheet][sheet]);
                  // console.log("cod_tec");
                  // console.log(cod_tec_input);
                  const ogm: any = await this.ogmController.getAll({ cod_tec: cod_tec_input });
                  if (ogm.total == 0) {
                    // console.log('aqui OGM');
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a tecnologia informada não existe no sistema.</li><br>`;
                  } else {
                    this.aux.id_ogm = ogm.response[0]?.id;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do tecnologia é obrigatorio.</li><br>`;
                }
              }

              // console.log("ogm ok npe");

              if (configModule.response[0]?.fields[sheet] == 'Foco') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) === 'string') {
                    const foco: any = await this.focoController.getAll({ name: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                    if (foco.total == 0) {
                      // console.log('aqui Foco');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o foco não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_foco = foco.response[0]?.id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, foco deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do foco é obrigatorio.</li><br>`;
                }
              }

              // console.log("foco ok npe");

              if (configModule.response[0]?.fields[sheet] == 'Ensaio') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) === 'string') {
                    const ensaio: any = await this.typeAssayController.getAll({ name: data.spreadSheet[keySheet][sheet] });
                    if (ensaio.total == 0) {
                      // console.log('aqui Ensaio');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta,o tipo de ensaio não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_type_assay = ensaio.response[0]?.id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, tipo de ensaio deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do tipo de ensaio é obrigatorio.</li><br>`;
                }
              }

              // console.log("ensaio ok npe");

              if (configModule.response[0]?.fields[sheet] == 'NPEI') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) === 'number') {
                    if (typeof (this.aux.id_foco) === 'undefined') {
                      return 'O foco precisa ser importado antes da NPEI';
                    }
                    const resp: any = await this.npeController.validateNpeiDBA({
                      Column, Line, safra: data.safra, foco: this.aux.id_foco, npei: data.spreadSheet[keySheet][sheet],
                    });
                    if (resp.erro == 1) {
                      responseIfError[Column - 1] += resp.message;
                    }
                    if (responseIfError.length === 0) {
                      this.aux.npei = data.spreadSheet[keySheet][sheet];
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, NPEI deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do NPEI é obrigatorio.</li><br>`;
                }
              }

              // console.log("npei npe ok");

              if (configModule.response[0]?.fields[sheet] == 'Epoca') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) !== 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, época deve ser um campo numerico.</li><br>`;
                  } else if (data.spreadSheet[keySheet][sheet] <= 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, época deve ser um número positivo.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo a época é obrigatorio.</li><br>`;
                }
              }

              // console.log("epoca ok npe");

              if (Column == configModule.lenght) {
                // console.log('chogu aqui');
                const npe: any = await this.npeController.getAll({
                  id_safra: data.safra,
                  id_foco: this.aux.id_foco,
                  id_type_assay: this.aux.id_type_assay,
                  id_ogm: this.aux.id_ogm,
                  epoca: this.aux.epoca,
                });
                // console.log(npe);
                if (npe.total > 0) {
                  responseIfError[Column - 1] = `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, dados já cadastrado no banco, para atualizar inative o que já está cadastrado`;
                }
              }
            }
          }
        }
      }

      if (responseIfError == '') {
        // console.log('AQUI R');
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              this.aux.status = 1;
              this.aux.created_by = data.created_by;
              this.aux.npef = 0;
              this.aux.prox_npe = 0;
              if (configModule.response[0]?.fields[sheet] == 'Local') {
                // console.log("Local R");
                const local: any = await this.localController.getAll(
                  { name_local_culture: data.spreadSheet[keySheet][sheet] },
                );
                this.aux.id_local = local.response[0]?.id;
              }

              if (configModule.response[0]?.fields[sheet] == 'Safra') {
                // console.log("Safra R");
                this.aux.id_safra = Number(data.safra);
              }

              if (configModule.response[0]?.fields[sheet] == 'OGM') {
                // console.log("OGM R");
                const ogm: any = await this.ogmController.getAll(
                  { cod_tec: String(data.spreadSheet[keySheet][sheet]) },
                );
                this.aux.id_ogm = ogm.response[0]?.id;
              }

              if (configModule.response[0]?.fields[sheet] == 'Foco') {
                // console.log("FOCO R");
                const foco: any = await this.focoController.getAll(
                  { name: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture },
                );
                this.aux.id_foco = Number(foco.response[0]?.id);
              }

              if (configModule.response[0]?.fields[sheet] == 'Ensaio') {
                // console.log("Ensaio R");
                const ensaio: any = await this.typeAssayController.getAll(
                  { name: data.spreadSheet[keySheet][sheet] },
                );
                this.aux.id_type_assay = ensaio.response[0]?.id;
              }

              if (configModule.response[0]?.fields[sheet] == 'Epoca') {
                this.aux.epoca = String(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0]?.fields[sheet] == 'NPEI') {
                this.aux.npei = data.spreadSheet[keySheet][sheet];
              }

              if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                const { response: groupResponse }: any = await this.groupController.getAll(
                  { id_safra: data.safra, id_foco: this.aux.id_foco },
                );
                this.aux.id_group = Number(groupResponse[0]?.id);
                await this.npeController.create(this.aux);
              }
            }
          }
        }
        return 'save';
      }
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return responseStringError;
    } catch (err) {
      // console.log('Erro geral import NPE: ');
      // console.log(err);
      return 'Erro ao validar';
    }
  }

  async validateDelineamentoNew(data: object | any) {
    const responseIfError: any = [];
    let Column: number;

    try {
      const configModule: object | any = await this.getAll(Number(data.moduleId));
      let sorteio_anterior: number = 0;
      let tratamento_anterior: number = 0;
      let bloco_anterior: number = 0;
      const repeticao: number = 1;
      const repeticao_ini: number = 1;
      let repeticao_anterior: number = 0;
      let name_anterior: string = '';
      let name_atual: string = '';
      const count_trat: number = 0;
      const count_trat_ant: number = 0;
      const count_linhas: number = 0;
      const repeticoes: number[] = [];
      let repeticao_atual: number = 0;
      let tratamentos: number[] = [];
      let tratamento_atual: number = 0;
      const repeticoes_tratamento: any[] = [];
      let i: number = 0;
      let verifica_repeticao: boolean = false;
      let verifica_repeticao_indice: number = 0;

      if (data != null && data != undefined) {
        let Line: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              // console.log(configModule.response[0]?.fields[sheet]);
              // console.log(sheet);

              if (configModule.response[0]?.fields[sheet] == 'Nome') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  const delineamento: any = await this.delineamentoController.getAll({ name: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                  if (delineamento.total > 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, nome do delineamento ja cadastrado.</li><br>`;
                  } else if (name_anterior == '' && name_atual == '') {
                    name_anterior = data.spreadSheet[keySheet][sheet];
                    name_atual = data.spreadSheet[keySheet][sheet];
                  } else {
                    name_anterior = name_atual;
                    name_atual = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Repeticao') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, repetição não pode estar vazio.</li><br>`;
                } else if (typeof (data.spreadSheet[keySheet][sheet]) !== 'number') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, repetição deve ser um número.</li><br>`;
                } else if (data.spreadSheet[1][sheet] != 1) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, repetição deve iniciar com valor igual a 1.</li><br>`;
                } else {
                  repeticoes.push(data.spreadSheet[keySheet][sheet]);
                  repeticao_atual = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Tratamento') {
                if (repeticao_atual == 1) {
                  if (tratamentos.includes(data.spreadSheet[keySheet][sheet])) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, tratamento não pode ser duplicado na repetição.</li><br>`;
                  } else {
                    tratamentos.push(data.spreadSheet[keySheet][sheet]);
                    // repeticoes_tratamento.push(repeticao_atual);
                    if (repeticoes_tratamento.length > 0) {
                      for (let i2 = 0; i2 < repeticoes_tratamento.length; i2++) {
                        // console.log('procurando');
                        // console.log(repeticoes_tratamento[i2].repeticao);
                        // console.log(repeticao_atual);
                        // console.log(repeticoes_tratamento);
                        if (repeticoes_tratamento[i2].repeticao == repeticao_atual) {
                          verifica_repeticao = true;
                          verifica_repeticao_indice = i2;
                        }
                      }
                      if (verifica_repeticao) {
                        repeticoes_tratamento[verifica_repeticao_indice].tratamentos.push(data.spreadSheet[keySheet][sheet]);
                      } else {
                        repeticoes_tratamento.push({ repeticao: repeticao_atual, tratamentos: [data.spreadSheet[keySheet][sheet]] });
                      }
                      verifica_repeticao = false;
                      verifica_repeticao_indice = 0;
                    } else {
                      repeticoes_tratamento.push({ repeticao: repeticao_atual, tratamentos: [data.spreadSheet[keySheet][sheet]] });
                    }
                  }
                  if (keySheet > 1) {
                    if (data.spreadSheet[keySheet - 1][sheet] != data.spreadSheet[keySheet][sheet] - 1) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, tratamento na repetição 1 deve ser sequencial.</li><br>`;
                    } else {
                      tratamento_atual = data.spreadSheet[keySheet][sheet];
                    }
                  }
                } else if (repeticoes_tratamento.length > 0) {
                  for (let i2 = 0; i2 < repeticoes_tratamento.length; i2++) {
                    // console.log('procurando2');
                    // console.log(repeticoes_tratamento[i2].repeticao);
                    // console.log(repeticao_atual);
                    // console.log(repeticoes_tratamento);
                    if (repeticoes_tratamento[i2].repeticao == repeticao_atual) {
                      verifica_repeticao = true;
                      verifica_repeticao_indice = i2;
                    }
                  }
                  if (verifica_repeticao) {
                    repeticoes_tratamento[verifica_repeticao_indice].tratamentos.push(data.spreadSheet[keySheet][sheet]);
                  } else {
                    repeticoes_tratamento.push({ repeticao: repeticao_atual, tratamentos: [data.spreadSheet[keySheet][sheet]] });
                  }
                  verifica_repeticao = false;
                  verifica_repeticao_indice = 0;
                }
                if (repeticao_atual > 1) {
                  console.log('repeticao');
                  console.log(repeticao_atual);
                  console.log(tratamentos);
                  console.log('tratamentos');
                  console.log(data.spreadSheet[keySheet][sheet]);
                  if (tratamentos.includes(data.spreadSheet[keySheet][sheet])) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, tratamento não pode ser duplicado na repetição.</li><br>`;
                  } else {
                    tratamentos.push(data.spreadSheet[keySheet][sheet]);
                  }
                }
              }

              // console.log("repeticao anterior:");
              // console.log(repeticao_anterior);
              // console.log("repeticao atual:");
              // console.log(repeticao_atual);

              if (configModule.response[0]?.fields[sheet] == 'Sorteio') {
                // console.log("sorteio:");
                // console.log(data.spreadSheet[keySheet][sheet]);
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) !== 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo sorteio tem que ser um numero.</li><br>`;
                  } else {
                    if (name_atual != name_anterior) {
                      sorteio_anterior = 0;
                    }
                    if (sorteio_anterior > data.spreadSheet[keySheet][sheet] && repeticao_anterior == repeticao_atual) {
                      responseIfError[Column - 1] += `A coluna de sorteio da ${Column}º coluna da ${Line}º linha deve está em ordem crescente.`;
                    }
                    sorteio_anterior = data.spreadSheet[keySheet][sheet];
                  }
                }

                if (repeticao_atual && repeticao_anterior != repeticao_atual && repeticao_anterior > 1) {
                  i += 1;
                }
                if (repeticao_atual && repeticao_anterior != repeticao_atual) {
                  tratamentos = [];
                }
                repeticao_anterior = repeticao_atual;
              }

              if (configModule.response[0]?.fields[sheet] == 'Bloco') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) !== 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o bloco tem que ser um numero.</li><br>`;
                  } else if (bloco_anterior != 0 && bloco_anterior != data.spreadSheet[keySheet][sheet]) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, os blocos não podem ser diferentes.</li><br>`;
                  } else {
                    bloco_anterior = data.spreadSheet[keySheet][sheet];
                  }
                }
              }
            }
          }
        }
      }

      let validacao_nt_repeticoes = [];
      if (responseIfError.length > 0) {
        Column = responseIfError.length - 1;
      } else {
        Column = 0;
      }
      if (repeticoes_tratamento.length > 1) {
        for (let i3 = 1; i3 < repeticoes_tratamento.length; i3++) {
          repeticoes_tratamento[i3].tratamentos.forEach((value: number) => {
            repeticoes_tratamento[0]?.tratamentos.forEach((value2: number) => {
              if (value == value2) {
                validacao_nt_repeticoes.push(value2);
              }
            });
          });
          if (repeticoes_tratamento[i3].tratamentos.length != repeticoes_tratamento[0]?.tratamentos.length) {
            responseIfError[Column] += `<li style="text-align:left"> A quantidade de tratamentos da repetição ${String(repeticoes_tratamento[i3].repeticao)} não é igual aos tratamentos da repetição 1.</li><br>`;
          }
          if (repeticoes_tratamento[0]?.tratamentos.length != validacao_nt_repeticoes.length) {
            responseIfError[Column] += `<li style="text-align:left"> Os tratamentos da repetição ${String(repeticoes_tratamento[i3].repeticao)} não coincidem com os tratamentos da repetição 1.</li><br>`;
          }
          validacao_nt_repeticoes = [];
        }
      }

      // console.log("errors");
      // console.log(responseIfError.length);
      // console.log(responseIfError[0]);
      // console.log(responseIfError);

      // console.log("repetições arr:");
      // console.log(repeticoes_tratamento);

      if (responseIfError == '' && responseIfError.length == 0) {
        let name_anterior: string = '';
        let name_atual: string = '';
        let repeticao: number = 1;
        let countTrat = 1;
        const aux: object | any = {};
        let Column;
        let Lines;
        let delimit = 0;

        aux.created_by = data.created_by;

        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Lines = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              // console.log
              if (configModule.response[0]?.fields[sheet] == 'Nome') {
                if (name_anterior == '' && name_atual == '') {
                  name_anterior = data.spreadSheet[keySheet][sheet];
                  name_atual = data.spreadSheet[keySheet][sheet];
                } else {
                  name_anterior = name_atual;
                  name_atual = data.spreadSheet[keySheet][sheet];
                  if (name_atual != name_anterior) {
                    delimit = 0;
                    await this.delineamentoController.update({ id: aux.id_delineamento, repeticao, trat_repeticao: countTrat });
                  } else if (Lines == data.spreadSheet.length) {
                    countTrat++;
                    await this.delineamentoController.update({ id: aux.id_delineamento, repeticao, trat_repeticao: countTrat });
                  }
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Repeticao') {
                if (name_atual != '' && name_anterior != '') {
                  if (name_atual != name_anterior) {
                    countTrat = 1;
                    repeticao = 1;
                  }
                }

                if (data.spreadSheet[keySheet][sheet] > repeticao) {
                  repeticao++;
                  countTrat = 1;
                  tratamento_anterior = 0;
                } else {
                  countTrat++;
                }
                aux.repeticao = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0]?.fields[sheet] == 'Sorteio') {
                aux.sorteio = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0]?.fields[sheet] == 'Tratamento') {
                aux.nt = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0]?.fields[sheet] == 'Bloco') {
                aux.bloco = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (data.spreadSheet[keySheet].length == Column && aux != []) {
                if (name_atual == name_anterior && delimit == 0) {
                  const delineamento: any = await this.delineamentoController.post({
                    id_culture: data.id_culture, name: name_atual, repeticao, trat_repeticao: countTrat, status: 1, created_by: data.created_by,
                  });
                  aux.id_delineamento = delineamento.response.id;
                  delimit = 1;
                }
                await this.sequenciaDelineamentoController.create(aux);
              }
            }
          }
        }
        return 'save';
      }
      console.log(responseIfError);
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return responseStringError;
    } catch (err) {
      console.log(err);
      return 'Houve um erro, tente novamente mais tarde!5';
    }
    // return 'save';
  }

  async validateDelineamento(data: object | any) {
    const responseIfError: any = [];
    let Column: number;

    try {
      const configModule: object | any = await this.getAll(Number(data.moduleId));
      let sorteio_anterior: number = 0;
      let tratamento_anterior: number = 0;
      let bloco_anterior: number = 0;
      let repeticao: number = 1;
      let repeticao_ini: number = 1;
      let repeticao_anterior: number = 0;
      let name_anterior: string = '';
      let name_atual: string = '';
      let count_trat: number = 0;
      let count_trat_ant: number = 0;
      const count_linhas: number = 0;

      if (data != null && data != undefined) {
        let Line: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              if (configModule.response[0]?.fields[sheet] == 'Nome') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  const delineamento: any = await this.delineamentoController.getAll({ name: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                  if (delineamento.total > 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, nome do delineamento ja cadastrado.</li><br>`;
                  } else if (name_anterior == '' && name_atual == '') {
                    name_anterior = data.spreadSheet[keySheet][sheet];
                    name_atual = data.spreadSheet[keySheet][sheet];
                  } else {
                    name_anterior = name_atual;
                    name_atual = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Repeticao') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) !== 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a repetição tem que ser um numero.</li><br>`;
                  } else {
                    if (repeticao_ini == 1) {
                      repeticao_ini++;
                      if (data.spreadSheet[keySheet][sheet] != 1) {
                        return 'A repetição deve iniciar com 1';
                      }
                      repeticao_anterior = data.spreadSheet[keySheet][sheet];
                      repeticao = data.spreadSheet[keySheet][sheet];
                    } else if (name_atual != name_anterior) {
                      repeticao = 1;
                      repeticao_ini = 1;
                    } else {
                      repeticao_anterior = repeticao;
                      repeticao = data.spreadSheet[keySheet][sheet];
                    }

                    if (data.spreadSheet[keySheet][sheet] < repeticao) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a repetição está incorreta.</li><br>`;
                    }
                  }
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Sorteio') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) !== 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo sorteio tem que ser um numero.</li><br>`;
                  } else {
                    if (name_atual != name_anterior) {
                      sorteio_anterior = 0;
                    }
                    if (sorteio_anterior > data.spreadSheet[keySheet][sheet]) {
                      return 'A coluna de sorteio deve está em ordem crescente.';
                    }
                    sorteio_anterior = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Tratamento') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) !== 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o tratamento tem que ser um numero.</li><br>`;
                  } else {
                    if ((name_atual != name_anterior)) {
                      count_trat = 0;
                      tratamento_anterior = 0;
                    } else if ((repeticao != repeticao_anterior)) {
                      if (repeticao != repeticao_anterior) {
                        if (count_trat == 0) {
                          count_trat_ant = count_trat;
                          count_trat = tratamento_anterior;
                        } else {
                          count_trat_ant = count_trat;
                          count_trat = tratamento_anterior;
                          if (count_trat != count_trat_ant) {
                            // responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, O número de tratamento deve ser igual para todas repetições.</li><br>`;
                          }
                        }
                      }
                      tratamento_anterior = 0;
                    }

                    if (data.spreadSheet.length == Line) {
                      if (data.spreadSheet[keySheet][sheet] != count_trat) {
                        // responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, O número de tratamento deve ser igual para todas repetições.</li><br>`;
                      }
                    }

                    if (tratamento_anterior == 0) {
                      tratamento_anterior = data.spreadSheet[keySheet][sheet];
                      if (data.spreadSheet[keySheet][sheet] != 1) {
                        responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, O número de tratamento deve iniciar com 1.</li><br>`;
                      }
                    } else if (tratamento_anterior >= data.spreadSheet[keySheet][sheet]) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a coluna de tratamento deve estar em ordem crescente para cada repetição.</li><br>`;
                    } else {
                      tratamento_anterior = data.spreadSheet[keySheet][sheet];
                    }
                  }
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Bloco') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) !== 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o bloco tem que ser um numero.</li><br>`;
                  } else if (bloco_anterior != 0 && bloco_anterior != data.spreadSheet[keySheet][sheet]) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, os blocos não podem ser diferentes.</li><br>`;
                  } else {
                    bloco_anterior = data.spreadSheet[keySheet][sheet];
                  }
                }
              }
            }
          }
        }
      }

      if (responseIfError == '') {
        let name_anterior: string = '';
        let name_atual: string = '';
        let repeticao: number = 1;
        let countTrat = 1;
        const aux: object | any = {};
        let Column;
        let Lines;
        let delimit = 0;

        aux.created_by = data.created_by;

        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Lines = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              // console.log
              if (configModule.response[0]?.fields[sheet] == 'Nome') {
                if (name_anterior == '' && name_atual == '') {
                  name_anterior = data.spreadSheet[keySheet][sheet];
                  name_atual = data.spreadSheet[keySheet][sheet];
                } else {
                  name_anterior = name_atual;
                  name_atual = data.spreadSheet[keySheet][sheet];
                  if (name_atual != name_anterior) {
                    delimit = 0;
                    await this.delineamentoController.update({ id: aux.id_delineamento, repeticao, trat_repeticao: countTrat });
                  } else if (Lines == data.spreadSheet.length) {
                    countTrat++;
                    await this.delineamentoController.update({ id: aux.id_delineamento, repeticao, trat_repeticao: countTrat });
                  }
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Repeticao') {
                if (name_atual != '' && name_anterior != '') {
                  if (name_atual != name_anterior) {
                    countTrat = 1;
                    repeticao = 1;
                  }
                }

                if (data.spreadSheet[keySheet][sheet] > repeticao) {
                  repeticao++;
                  countTrat = 1;
                  tratamento_anterior = 0;
                } else {
                  countTrat++;
                }
                aux.repeticao = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0]?.fields[sheet] == 'Sorteio') {
                aux.sorteio = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0]?.fields[sheet] == 'Tratamento') {
                aux.nt = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0]?.fields[sheet] == 'Bloco') {
                aux.bloco = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (data.spreadSheet[keySheet].length == Column && aux != []) {
                if (name_atual == name_anterior && delimit == 0) {
                  const delineamento: any = await this.delineamentoController.post({
                    id_culture: data.id_culture, name: name_atual, repeticao, trat_repeticao: countTrat, status: 1, created_by: data.created_by,
                  });
                  aux.id_delineamento = delineamento.response.id;
                  delimit = 1;
                }
                await this.sequenciaDelineamentoController.create(aux);
              }
            }
          }
        }
        return 'save';
      }
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return responseStringError;
    } catch (err) {
      console.log(err);
      return 'Houve um erro, tente novamente mais tarde!5';
    }
    return 'save';
  }

  async validateLote(data: object | any) {
    const responseIfError: any = [];
    let Column: number;
    try {
      const configModule: object | any = await this.getAll(Number(data.moduleId));

      if (data != null && data != undefined) {
        let Line: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              if (configModule.response[0]?.fields[sheet] == 'Genotipo') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo genótipo é obrigatorio.</li><br>`;
                } else {
                  const geno = await this.genotipoController.getAll({ genotipo: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                  if (geno.total == 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, genótipo não existe no sistema.</li><br>`;
                  }
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Lote') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo Lote é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Volume') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo volume é obrigatorio.</li><br>`;
                } else {

                }
              }
            }
          }
        }
      }

      if (responseIfError == '') {
        this.aux.created_by = Number(data.created_by);
        this.aux.status = 1;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              if (configModule.response[0]?.fields[sheet] == 'Genotipo') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  const geno = await this.genotipoController.getAll({ genotipo: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                  if (geno.total > 0) {
                    this.aux.id_genotipo = geno.response[0]?.id;
                  }
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Lote') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  const lote = await this.loteController.getAll({ name: data.spreadSheet[keySheet][sheet] });
                  if (lote.total > 0) {
                    this.aux.name = data.spreadSheet[keySheet][sheet];
                    this.aux.id = lote.response[0]?.id;
                  }
                  this.aux.name = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Volume') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.volume = data.spreadSheet[keySheet][sheet];
                }
              }

              if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                if (this.aux.id) {
                  await this.loteController.update(this.aux);
                } else {
                  await this.loteController.create(this.aux);
                }
              }
            }
          }
        }
        return 'save';
      }
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return responseStringError;
    } catch (err) {
      console.log(err);
      return 'Houve um erro, tente novamente mais tarde!7';
    }
  }

  async validateLocal({
    spreadSheet, moduleId, id_safra, created_by,
  }: object | any) {
    const responseIfError: any = [];
    try {
      console.log('spreadsheet');
      console.log(spreadSheet);
      const configModule: object | any = await this.getAll(Number(moduleId));
      configModule.response[0]?.fields.push('DT');
      for (const row in spreadSheet) {
        for (const column in spreadSheet[row]) {
          if (row === '0') {
            if (!(spreadSheet[row][column].toUpperCase()).includes(configModule.response[0]?.fields[column].toUpperCase())) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, a sequencia de colunas da planilha esta incorreta. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('ID da unidade de cultura')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo ID da unidade de cultura é obrigatório. </li> <br>`;
            } else if (typeof (spreadSheet[row][column]) !== 'number') {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo ID do unidade de cultura deve ser numérico. </li> <br>`;
            } else {
              this.aux.id_local_culture = spreadSheet[row][column];
            }
          } else if (spreadSheet[0][column].includes('Ano')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Ano é obrigatório. </li> <br>`;
            } else {
              const safraYearValidate: any = await this.safraController.getOne(id_safra);
              if (safraYearValidate.response?.year !== spreadSheet[row][column]) {
                responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Ano não corresponde ao ano da safra selecionada. </li> <br>`;
              } else if (typeof (spreadSheet[row][column]) !== 'number') {
                responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Ano deve ser numérico. </li> <br>`;
              }
            }
          } else if (spreadSheet[0][column].includes('Nome da unidade de cultura')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome da unidade de cultura é obrigatório. </li> <br>`;
            } else {
              const unidadeCulturaAlreadyExist = await this.unidadeCulturaController.getAll({ name_unity_culture: (spreadSheet[row][column].toString()) });
              if (unidadeCulturaAlreadyExist.response.length > 0) responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome da unidade de cultura já esta cadastrado. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('ID do lugar de cultura')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo ID do Lugar da cultura é obrigatório. </li> <br>`;
            } else if (typeof (spreadSheet[row][column]) !== 'number') {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo ID do Lugar da cultura deve ser numérico. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('Nome do lugar de cultura')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome do lugar de cultura é obrigatório. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('Rótulo')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Rótulo é obrigatório. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('MLOC')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo MLOC é obrigatório. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('Endereço')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Endereço é obrigatório. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('Identificador de localidade')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Identificador de localidade é obrigatório. </li> <br>`;
            } else if (typeof (spreadSheet[row][column]) !== 'number') {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Identificador de localidade deve ser numérico. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('Nome da localidade')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome da localidade é obrigatório. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('Identificador de região')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Identificador de região é obrigatório. </li> <br>`;
            } else if (typeof (spreadSheet[row][column]) !== 'number') {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Identificador de região deve ser numérico. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('Nome da região')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome da região é obrigatório. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('REG_LIBELLE')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Rótulo é obrigatório. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('ID do País')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo ID do País é obrigatório. </li> <br>`;
            } else if (typeof (spreadSheet[row][column]) !== 'number') {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo ID do País deve ser numérico. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('Nome do país')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome do páis é obrigatório. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('CNTR_LIBELLE')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Rótulo é obrigatório. </li> <br>`;
            }
          } else if (spreadSheet[0][column].includes('DT')) {
            const local: any = await this.localController.getAll({ id_local_culture: this.aux.id_local_culture });
            if (local.response[0]?.dt_import > spreadSheet[row][column]) {
              responseIfError[Number(column)] = `<li style="text-align:left"> A ${column}º coluna da ${row}º linha está incorreta, essa informação é mais antiga do que a informação do software`;
            }
          }
        }
      }

      if (responseIfError.length === 0) {
        const localCultureDTO: object | any = {};
        const unityCultureDTO: object | any = {};
        for (const row in spreadSheet) {
          if (row !== '0') {
            for (const column in spreadSheet[row]) {
              if (spreadSheet[0][column].includes('ID da unidade de cultura')) {
                unityCultureDTO.id_unity_culture = Number(spreadSheet[row][column]);
              } else if (spreadSheet[0][column].includes('Ano')) {
                unityCultureDTO.year = Number(spreadSheet[row][column]);
              } else if (spreadSheet[0][column].includes('Nome da unidade de cultura')) {
                unityCultureDTO.name_unity_culture = (spreadSheet[row][column].toString());
              } else if (spreadSheet[0][column].includes('ID do lugar de cultura')) {
                localCultureDTO.id_local_culture = Number(spreadSheet[row][column]);
              } else if (spreadSheet[0][column].includes('Nome do lugar de cultura')) {
                localCultureDTO.name_local_culture = (spreadSheet[row][column].toString());
              } else if (spreadSheet[0][column].includes('CP_LIBELLE')) {
                localCultureDTO.label = (spreadSheet[row][column].toString());
              } else if (spreadSheet[0][column].includes('MLOC')) {
                localCultureDTO.mloc = (spreadSheet[row][column].toString());
              } else if (spreadSheet[0][column].includes('Endereço')) {
                localCultureDTO.adress = (spreadSheet[row][column].toString());
              } else if (spreadSheet[0][column].includes('Identificador de localidade')) {
                localCultureDTO.id_locality = Number(spreadSheet[row][column]);
              } else if (spreadSheet[0][column].includes('Nome da localidade')) {
                localCultureDTO.name_locality = (spreadSheet[row][column].toString());
              } else if (spreadSheet[0][column].includes('Identificador de região')) {
                localCultureDTO.id_region = Number(spreadSheet[row][column]);
              } else if (spreadSheet[0][column].includes('Nome da região')) {
                localCultureDTO.name_region = (spreadSheet[row][column].toString());
              } else if (spreadSheet[0][column].includes('REG_LIBELLE')) {
                localCultureDTO.label_region = (spreadSheet[row][column].toString());
              } else if (spreadSheet[0][column].includes('ID do País')) {
                localCultureDTO.id_country = Number(spreadSheet[row][column]);
              } else if (spreadSheet[0][column].includes('Nome do país')) {
                localCultureDTO.name_country = (spreadSheet[row][column].toString());
              } else if (spreadSheet[0][column].includes('CNTR_LIBELLE')) {
                localCultureDTO.label_country = (spreadSheet[row][column].toString());
              } else if (spreadSheet[0][column].includes('DT')) {
                localCultureDTO.dt_import = spreadSheet[row][column];
              }
            }
            try {
              localCultureDTO.created_by = Number(created_by);
              unityCultureDTO.created_by = Number(created_by);
              const localAlreadyExists = await this.localController.getAll({ id_local_culture: localCultureDTO.id_local_culture });
              if (localAlreadyExists.response?.length > 0) {
                localCultureDTO.id = localAlreadyExists.response[0]?.id;
                unityCultureDTO.id_local = localAlreadyExists.response[0]?.id;
                await this.localController.update(localCultureDTO);
                const response = await this.unidadeCulturaController.create(unityCultureDTO);
              } else {
                delete localCultureDTO.id;
                const response = await this.localController.create(localCultureDTO);
                unityCultureDTO.id_local = response?.response?.id;
                await this.unidadeCulturaController.create(unityCultureDTO);
              }
            } catch (err) {
              console.log('Error save import local');
              console.log(err);
              return 'Erro ao salvar local no banco';
            }
          }
        }
        return 'save';
      }

      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return responseStringError;
    } catch (error) {
      console.log('Erro na validação do local');
      console.log(error);
      return 'Erro na validação do local';
    }
  }

  async saveDelineamento(data: any, id_delineamento: number, configModule: any) {
    const aux: object | any = {};
    let Column;

    aux.id_delineamento = id_delineamento;
    aux.created_by = data.created_by;

    for (const [keySheet, lines] of data.spreadSheet.entries()) {
      for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
        Column = Number(sheet) + 1;
        if (keySheet != '0') {
          if (configModule.response[0]?.fields[sheet] == 'Repeticao') {
            aux.repeticao = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (configModule.response[0]?.fields[sheet] == 'Sorteio') {
            aux.sorteio = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (configModule.response[0]?.fields[sheet] == 'Tratamento') {
            aux.nt = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (configModule.response[0]?.fields[sheet] == 'Bloco') {
            aux.bloco = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (data.spreadSheet[keySheet].length == Column && aux != []) {
            await this.sequenciaDelineamentoController.create(aux);
          }
        }
      }
    }
  }

  async validateLayoutQuadra(data: object | any) {
    const responseIfError: any = [];
    let Column: number;

    try {
      const configModule: object | any = await this.getAll(Number(data.moduleId));

      if (data != null && data != undefined) {
        let cod_esquema: any = ''; let cod_esquema_anterior: any = ''; const
          disparo: any = 0;
        let sl: any = 0; let sc: any; let s_aloc: any; let scolheita: any = 0; let
          tiro: any = 0;
        let combinacao: any = ''; let
          combinacao_anterior: any = '';
        let count_linhas = 0;
        const auxTiros: object = {};
        let Line: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              if (configModule.response[0]?.fields[sheet] == 'Esquema') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o esquema é obrigatorio.</li><br>`;
                } else {
                  const esquema: any = await this.layoutQuadraController.getAll({ id_culture: data.id_culture, esquema: data.spreadSheet[keySheet][sheet], status: 1 });
                  if (esquema.total > 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, ja existe um esquema ativo com esse código.</li><br>`;
                  } else {
                    cod_esquema_anterior = cod_esquema;
                    cod_esquema = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Plantadeiras') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a plantadeira é obrigatorio.</li><br>`;
                } else if (Number(data.spreadSheet[keySheet][sheet]) != 4 && Number(data.spreadSheet[keySheet][sheet]) != 8 && Number(data.spreadSheet[keySheet][sheet] != 12)) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a plantadeira deve estar dentro desses numeros 4,8 e 12.</li><br>`;
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Tiro') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o tiro é obrigatorio.</li><br>`;
                } else if (tiro == 0) {
                  if (data.spreadSheet[keySheet][sheet] != 1) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o tiro precisa começar com 1.</li><br>`;
                  }
                  tiro = data.spreadSheet[keySheet][sheet];
                } else {
                  tiro = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Disparo') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo disparos é obrigatorio.</li><br>`;
                } else {
                  if (tiro == 0) {
                    return 'O campo tiro precisa vir antes que a campo disparo';
                  }
                  combinacao_anterior = combinacao;
                  combinacao = `${tiro}x${data.spreadSheet[keySheet][sheet]}`;
                  if (combinacao == combinacao_anterior) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a combinacao de tiros e disparos deve ser unica dentro do esquema.</li><br>`;
                  }
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'SL') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo sl é obrigatorio.</li><br>`;
                } else {
                  if (cod_esquema == cod_esquema_anterior) {
                    if (data.spreadSheet[keySheet][sheet] == sl) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o sl não pode se repetir no mesmo esquema.</li><br>`;
                    }
                    count_linhas++;
                  } else {
                    tiro = 0;
                    count_linhas = 0;
                  }
                  sl = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'SC') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo sc é obrigatorio.</li><br>`;
                } else {
                  if (cod_esquema == cod_esquema_anterior) {
                    if (data.spreadSheet[keySheet][sheet] == sc) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o sc não pode se repetir no mesmo esquema.</li><br>`;
                    }
                  }
                  sc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'SALOC') {
                if (data.spreadSheet[keySheet][sheet] == '' || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo saloc é obrigatorio.</li><br>`;
                } else {
                  if (cod_esquema == cod_esquema_anterior) {
                    if (data.spreadSheet[keySheet][sheet] == s_aloc) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o saloc não pode se repetir no mesmo esquema.</li><br>`;
                    }
                  }
                  s_aloc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'CJ') {
                if (data.spreadSheet[keySheet][sheet] == '' || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo cj é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Dist') {
                if (data.spreadSheet[keySheet][sheet] == '' || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo dist é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'ST') {
                if (data.spreadSheet[keySheet][sheet] == '' || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a st é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0]?.fields[sheet] == 'SPC') {
                if (data.spreadSheet[keySheet][sheet] == '' || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a spc é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0]?.fields[sheet] == 'SColheita') {
                if (String(data.spreadSheet[keySheet][sheet]) == '' || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a scolheita é obrigatorio.</li><br>`;
                } else {
                  if (cod_esquema == cod_esquema_anterior) {
                    if (data.spreadSheet[keySheet][sheet] == scolheita) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o scolheita não pode se repetir no mesmo esquema.</li><br>`;
                    }
                  }
                  scolheita = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'TipoParcela') {
                if (data.spreadSheet[keySheet][sheet] == '' || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a tipo parcela é obrigatorio.</li><br>`;
                } else if ((data.spreadSheet[keySheet][sheet] != 'P' && data.spreadSheet[keySheet][sheet] != 'p') && (data.spreadSheet[keySheet][sheet] != 'V' && data.spreadSheet[keySheet][sheet] != 'v')) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, no tipo de parcela só é aceitado p ou v.</li><br>`;
                }
              }
            }
          }
        }
      }

      if (responseIfError == '') {
        this.aux.created_by = Number(data.created_by);
        this.aux.id_culture = Number(data.id_culture);
        this.aux.status = 1;
        let count = 1;

        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              if (configModule.response[0]?.fields[sheet] == 'Esquema') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if ((this.aux.esquema) && this.aux.esquema != data.spreadSheet[keySheet][sheet]) {
                    const layoutQuadra: any = await this.layoutQuadraController.getAll({ status: 1, id_culture: data.id_culture, esquema: data.spreadSheet[keySheet][sheet] });
                    if (layoutQuadra.total > 0) {
                      this.aux.id_layout_bd = layoutQuadra.response[0]?.id;
                    } else {
                      delete this.aux.id_layout_bd;
                    }
                    count = 1;
                  } else {
                    delete this.aux.id_layout_bd;
                  }
                  const teste = data.spreadSheet[keySheet][sheet].split('');
                  this.aux.tiroFixo = teste[0] + teste[1];
                  this.aux.disparoFixo = teste[3] + teste[4];
                  this.aux.parcelas = (Number(this.aux.tiroFixo) * Number(this.aux.disparoFixo));
                  this.aux.esquema = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Plantadeiras') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.plantadeira = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Tiro') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.tiro = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Disparo') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.disparo = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'SL') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.sl = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'SC') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.sc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'SALOC') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.s_aloc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'CJ') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.cj = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'Dist') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.dist = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'ST') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.st = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'SPC') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.spc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'SColheita') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.scolheita = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0]?.fields[sheet] == 'TipoParcela') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.tipo_parcela = data.spreadSheet[keySheet][sheet];
                }
              }

              if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                if (count == 1) {
                  if (this.aux.id_layout_bd) {
                    const upLayout: any = await this.layoutQuadraController.update({
                      id: Number(this.aux.id_layout_bd),
                      id_culture: Number(this.aux.id_culture),
                      esquema: this.aux.esquema,
                      plantadeira: String(this.aux.plantadeira),
                      parcelas: this.aux.parcelas,
                      tiros: Number(this.aux.tiroFixo),
                      disparos: Number(this.aux.disparoFixo),
                      status: this.aux.status,
                      created_by: this.aux.created_by,
                    });
                    this.aux.id_layout = this.aux.id_layout_bd;
                  } else {
                    const saveLayout: any = await this.layoutQuadraController.post({
                      id_culture: Number(this.aux.id_culture),
                      esquema: this.aux.esquema,
                      plantadeira: String(this.aux.plantadeira),
                      parcelas: this.aux.parcelas,
                      tiros: Number(this.aux.tiroFixo),
                      disparos: Number(this.aux.disparoFixo),
                      status: this.aux.status,
                      created_by: this.aux.created_by,
                    });
                    this.aux.id_layout = saveLayout.response.id;
                  }

                  count++;
                }

                await this.layoutChildrenController.create({
                  id_layout: this.aux.id_layout,
                  sl: this.aux.sl,
                  sc: this.aux.sc,
                  s_aloc: this.aux.s_aloc,
                  tiro: this.aux.tiro,
                  cj: String(this.aux.cj),
                  disparo: this.aux.disparo,
                  dist: this.aux.dist,
                  st: String(this.aux.st),
                  spc: String(this.aux.spc),
                  scolheita: this.aux.scolheita,
                  tipo_parcela: this.aux.tipo_parcela,
                  status: this.aux.status,
                  created_by: this.aux.created_by,
                });
              }
            }
          }
        }
        return 'save';
      }
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return responseStringError;
    } catch (err) {
      console.log(err);
      return 'Houve um erro, tente novamente mais tarde!9';
    }
  }
}
