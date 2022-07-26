/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable eqeqeq */
/* eslint-disable no-await-in-loop */
import { SafraController } from './safra.controller';
import { LocalController } from './local/local.controller';
import { FocoController } from './foco.controller';
import { TypeAssayController } from './tipo-ensaio.controller';
import { AssayListController } from './assay-list.controller';
import { TecnologiaController } from './technology/tecnologia.controller';
import { NpeController } from './npe.controller';
import { DelineamentoController } from './delineamento.controller';
import { SequenciaDelineamentoController } from './sequencia-delineamento.controller';
import { GenotipoController } from './genotype/genotipo.controller';
import { LoteController } from './lote.controller';
import { QuadraController } from './quadra.controller';
import { DisparosController } from './disparos.controller';
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

  disparosController = new DisparosController();

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
      user_id: data.created_by, status: 2, table: data.spreadSheet[1][0],
    });
    try {
      if (status === 400) {
        return {
          status: 400, message,
        };
      }
      let erro: any;
      let response: any;
      const protocolLevel = data.spreadSheet[1][0];
      const newData = removeProtocolLevel(data);
      switch (protocolLevel) {
        case 'TECHNOLOGY_S2':
          return await ImportTechnologyController.validate(newData);
        case 'CULTURE_UNIT':
          response = await this.validateLocal(newData);
          if (response == 'save') {
            response = 'Itens cadastrados com sucesso!';
          } else {
            erro = true;
          }
          break;
        case 'GENOTYPE_S2':
          return ImportGenotypeController.validate(newData);
        default:
          return { status: 400, response: [], message: 'Nenhum protocol_level configurado ' };
      }
      return { status: 200, message: response, error: erro };
    } catch (error) {
      return { status: 400, message: error };
    } finally {
      await this.logImportController.update({ id: responseLog?.id, status: 1 });
    }
  }

  async validateGeneral(data: object | any) {
    const {
      status,
      response: responseLog,
      message,
    }: any = await this.logImportController.create({
      user_id: data.created_by, status: 2, table: data.table,
    });
    try {
      if (data != null && data != undefined) {
        if (!data.moduleId) return { status: 400, message: 'precisa ser informado o modulo que está sendo acessado!' };

        if (data.moduleId === 27) {
          return await ImportGenotypeTreatmentController.validate(data);
        }

        if (status === 400) {
          return {
            status: 200, message, error: true,
          };
        }

        let response: any;
        let erro: any = false;
        const configModule: object | any = await this.getAll(Number(data.moduleId));

        if (data.moduleId !== 22 && data.moduleId !== 23 && data.moduleId !== 27) {
          if (configModule.response == '') return { status: 200, message: 'Primeiro é preciso configurar o modelo de planilha para esse modulo!' };
        }

        if (data.moduleId === 22) {
          const responseImport = await ImportExperimentController.validate(data);
          await this.logImportController.update({ id: responseLog.id, status: 1 });
          return responseImport;
        }

        // Validação Lista de Ensaio
        if (data.moduleId == 26) {
          response = await this.validateListAssay(data);
          if (response == 'save') {
            response = 'Itens cadastrados com sucesso!';
          } else {
            erro = true;
          }
        }

        // Validação do modulo Local
        if (data.moduleId == 4) {
          response = await this.validateLocal(data);
          if (response == 'save') {
            response = 'Itens cadastrados com sucesso!';
          } else {
            erro = true;
          }
        }

        // Validação do modulo Layout Quadra
        if (data.moduleId == 5) {
          response = await this.validateLayoutQuadra(data);
          if (response == 'save') {
            response = 'Itens cadastrados com sucesso!';
          } else {
            erro = true;
          }
        }

        // Validação do modulo Delineamento
        if (data.moduleId == 7) {
          response = await this.validateDelineamento(data);
          if (response == 'save') {
            response = 'Itens cadastrados com sucesso!';
          } else {
            erro = true;
          }
        }

        // Validação do modulo Genotipo
        if (data.moduleId == 10) {
          return ImportGenotypeController.validate(data);
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
          response = await this.validateQuadra(data);
          if (response == 'save') {
            response = 'Itens cadastrados com sucesso!';
          } else {
            erro = true;
          }
        }

        // Validação do modulo tecnologia
        if (data.moduleId === 8) {
          return await ImportTechnologyController.validate(data);
        }

        return { status: 200, message: response, error: erro };
      }
    } catch (err) {
      console.log(err);
      return 'Houve um erro, tente novamente mais tarde!3';
    } finally {
      await this.logImportController.update({ id: responseLog?.id, status: 1 });
    }
  }

  async validateListAssay(data: object | any) {
    const responseIfError: any = [];

    try {
      const Retorno: string = '';
      let options: object | any = {};
      if (data != null && data != undefined) {
        let Line: number;
        let Column: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              // Validação do campo Tipo de Protocolo
              if (sheet == 0) {
                const options: any = {};
                options.filterProtocolName = data.spreadSheet[keySheet][sheet];
                options.filterName = data.spreadSheet[keySheet][3];
                const typeAssayFind = await this.typeAssayController.getAll(options);
                if (typeAssayFind.response.length == 0) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o valor de protocolo não está cadastro no tipo de ensaio.</li><br>`;
                }
              }
              // Validação do campo Foco
              if (sheet == 2) {
                const dataFind = {
                  name: data.spreadSheet[keySheet][sheet],
                  id_culture: data.culture,
                };
                const focoResult: any = await this.focoRepository.findByName(dataFind);
                if (!focoResult) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o valor de foco não existe na cultura selecionada.</li><br>`;
                }
                // return JSON.stringify(dataFind) + data.spreadSheet[keySheet][sheet] + " - " + data.culture + " - " + JSON.stringify(focoResult);
              }
              // Validação do campo Tipo de Ensaio
              if (sheet == 3) {
                const options: any = {};
                options.filterName = data.spreadSheet[keySheet][sheet];
                options.id_culture = data.culture;
                const typeAssayFindByName = await this.typeAssayController.getAll(options);
                if (typeAssayFindByName.response.length == 0) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o valor tipo de ensaio não está cadastrado nesta cultura.</li><br>`;
                }
              }
              // Validação GLI
              if (sheet == 4) {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o valor de GLI está vazio.</li><br>`;
                }
              }
              // Validação do campo código da tecnologia
              if (sheet == 5) {
                let take;
                let skip;
                let orderBy: object | any;
                let select: any = [];
                select = {
                  id: true,
                  name: true,
                };
                const parameters: object | any = {};
                parameters.cod_tec = String(data.spreadSheet[keySheet][sheet]);
                parameters.id_culture = data.culture;
                const tecnologiaFind: any = await this.tecnologiaRepository.findAll(parameters, select, take, skip, orderBy);
                if (tecnologiaFind.length == 0) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o código da tecnologia não existe na cultura selecionada.</li><br>`;
                }
              }
              // Validação do campo EP
              if (sheet == 6) {
                const charactersCell = String(data.spreadSheet[keySheet][sheet]).length;
                const onlyNumeric = String(data.spreadSheet[keySheet][sheet]).replace(/[^\d]/g, '');
                const charactersNumeric = String(onlyNumeric).length;
                if (onlyNumeric == '' || onlyNumeric.length > 2 || charactersCell != charactersNumeric) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o valor de EP não pode ser vazio, deve ser numérico e com no máximo dois caracteres.</li><br>`;
                }
              }
              // Validação do campo número de tratamento
              if (sheet == 9) {
                const number_of_treatment = data.spreadSheet[keySheet][sheet];
                const number_of_treatment_previous = number_of_treatment - 1;
                if (keySheet > 1 && data.spreadSheet[keySheet - 1][sheet] != number_of_treatment_previous
                  && data.spreadSheet[keySheet - 1][sheet] && data.spreadSheet[keySheet - 1][4] == data.spreadSheet[keySheet][4]) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o número de tratamento não está sequencial (${number_of_treatment})</li><br>`;
                }
              }
              // Validação do campo status
              if (sheet == 10) {
                if (data.spreadSheet[keySheet][sheet] == '' || (data.spreadSheet[keySheet][sheet] != 'T' && data.spreadSheet[keySheet][sheet] != 'L')) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o valor de status deve ser igual a T ou L.</li><br>`;
                }
              }
              // Validação do campo nome do genótipo
              if (sheet == 11) {
                options = {};
                options.filterGenotipo = data.spreadSheet[keySheet][sheet];
                options.id_culture = data.culture;
                const findGenotype = await this.genotipoController.getAll(options);
                if (data.spreadSheet[keySheet][sheet] == '' || findGenotype.response.length == 0) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o valor de nome do genótipo não foi encontrado.</li><br>`;
                }
              }
              // Validação do campo NCA
              if (sheet == 12) {
                options = {};
                options.filterNcc = data.spreadSheet[keySheet][sheet];
                const findLote = await this.loteController.getAll(options);
                if (data.spreadSheet[keySheet][sheet] != '' && findLote.response.length == 0) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o valor de NCA é diferente de vazio e não foi encontrado no cadastro de lotes.</li><br>`;
                }
              }
              // Retorno += " - " + data.spreadSheet[keySheet][sheet];
            }
          }
        }
      }

      if (responseIfError.length === 0) {
        let Line: number;
        let Column: number;

        let productivity: number = 0;
        let advance: number = 0;
        let register: number = 0;

        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != 0) {
              if (sheet == 8) {
                const cultureFind: any = await this.culturaController.getOneCulture(data.culture);

                const assay = data.spreadSheet[keySheet][3];
                const protocol_name = data.spreadSheet[keySheet][0];
                const id_culture = cultureFind.response.id;
                options.filterName = assay;
                options.filterProtocolName = protocol_name;
                options.id_culture = id_culture;
                const getTypeAssay = await this.typeAssayController.getAll(options);

                let savedTypeAssay: any = {};
                let idSavedTypeAssay: any;

                if (getTypeAssay.response.length == 0) {
                  savedTypeAssay = await this.typeAssayController.create({
                    id_culture: cultureFind.response.id,
                    name: data.spreadSheet[keySheet][3],
                    protocol_name: data.spreadSheet[keySheet][0],
                    status: 1,
                    created_by: data.created_by,
                  });
                  idSavedTypeAssay = savedTypeAssay.response.id;
                } else {
                  savedTypeAssay = await this.typeAssayController.update({
                    id: getTypeAssay.response.id,
                    id_culture: cultureFind.response.id,
                    name: data.spreadSheet[keySheet][3],
                    protocol_name: data.spreadSheet[keySheet][0],
                    status: 1,
                    created_by: data.created_by,
                  });
                  idSavedTypeAssay = getTypeAssay.response[0].id;
                }

                if (idSavedTypeAssay) {
                  const focoFind: any = await this.focoRepository.findByName({ name: data.spreadSheet[keySheet][2], id_culture: data.culture });
                  let take;
                  let skip;
                  let orderBy: object | any;
                  let select: any = [];
                  select = {
                    id: true,
                    name: true,
                  };
                  const parameters: object | any = {};
                  parameters.cod_tec = String(data.spreadSheet[keySheet][5]);
                  parameters.id_culture = data.culture;
                  const tecnologiaFind = await this.tecnologiaRepository.findAll(parameters, select, take, skip, orderBy);
                  if (tecnologiaFind.length > 0) {
                    const gli = data.spreadSheet[keySheet][4];
                    options = {};
                    options.filterGli = gli;
                    const getListAssay = await this.assayListController.getAll(options);
                    // console.log("ListAssay: "+JSON.stringify(getListAssay));

                    let savedAssayList: any;
                    if (getListAssay.response.length == 0) {
                      savedAssayList = await this.assayListController.create({
                        id_safra: data.safra,
                        id_foco: focoFind.id,
                        id_type_assay: idSavedTypeAssay,
                        id_tecnologia: tecnologiaFind[0].id,
                        gli: data.spreadSheet[keySheet][4],
                        period: data.spreadSheet[keySheet][9],
                        protocol_name: data.spreadSheet[keySheet][0],
                        bgm: data.spreadSheet[keySheet][7],
                        project: String(data.spreadSheet[keySheet][8]),
                        status: data.spreadSheet[keySheet][10],
                        comments: data.spreadSheet[keySheet][13],
                        created_by: data.created_by,
                      });
                      // console.log("Created Assay List Status: " + savedAssayList.status);
                    } else {
                      savedAssayList = await this.assayListController.update({
                        id: getListAssay.response[0].id,
                        id_safra: data.safra,
                        id_foco: focoFind.id,
                        id_type_assay: idSavedTypeAssay,
                        id_tecnologia: tecnologiaFind[0].id,
                        gli: data.spreadSheet[keySheet][4],
                        period: data.spreadSheet[keySheet][9],
                        protocol_name: data.spreadSheet[keySheet][0],
                        bgm: data.spreadSheet[keySheet][7],
                        project: String(data.spreadSheet[keySheet][8]),
                        status: data.spreadSheet[keySheet][10],
                        comments: data.spreadSheet[keySheet][13],
                        created_by: data.created_by,
                      });
                      // console.log("Updated Assay List Status: " + savedAssayList.status);
                    }
                    if (savedAssayList.status == 201 || savedAssayList.status == 200) {
                      if (data.spreadSheet[keySheet][0] == 'Produtividade') {
                        productivity++;
                      }
                      if (data.spreadSheet[keySheet][0] == 'Avanço') {
                        advance++;
                      }
                      register++;
                    }
                  }
                }
              }
            }
          }
        }
        return `Ensaios importados (${String(register)}). Produtividade x Avanço (${String(productivity)} x ${String(advance)}) `;
        // return 'save';
      }
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return responseStringError;
    } catch (err) {
      console.log(err);
      return 'Houve um erro, tente novamente mais tarde!4';
    }

    return false;
  }

  async validateNPE(data: object | any) {
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
              this.aux.status = 1;
              this.aux.created_by = data.created_by;
              this.aux.npef = 0;
              this.aux.prox_npe = 0;
              if (configModule.response[0].fields[sheet] == 'Local') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) === 'string') {
                    const local: any = await this.localController.getAll({ name_local_culture: data.spreadSheet[keySheet][sheet] });
                    if (local.total == 0) {
                      // console.log('aqui Local');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o local não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_local = local.response[0].id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, local deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do local é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Safra') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) === 'string') {
                    const validateSafra: any = await this.safraController.getOne(Number(data.safra));
                    if (data.spreadSheet[keySheet][sheet] != validateSafra.response.safraName) {
                      return 'A safra a ser importada tem que ser a mesma selecionada!';
                    }
                    const safras: any = await this.safraController.getAll({ safraName: data.spreadSheet[keySheet][sheet] });
                    if (safras.total == 0) {
                      // console.log('aqui Safra');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a safra não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_safra = safras.response[0].id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, safra deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome da safra é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'OGM') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if ((typeof (data.spreadSheet[keySheet][sheet])) === 'number' && data.spreadSheet[keySheet][sheet].toString().length < 2) {
                    data.spreadSheet[keySheet][sheet] = `0${data.spreadSheet[keySheet][sheet].toString()}`;
                  }
                  const ogm: any = await this.ogmController.getAll({ cod_tec: String(data.spreadSheet[keySheet][sheet]) });
                  if (ogm.total == 0) {
                    // console.log('aqui OGM');
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o tecnologia informado não existe no sistema.</li><br>`;
                  } else {
                    this.aux.id_ogm = ogm.response[0].id;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do tecnologia é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Foco') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) === 'string') {
                    const foco: any = await this.focoController.getAll({ name: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                    if (foco.total == 0) {
                      // console.log('aqui Foco');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o foco não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_foco = foco.response[0].id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, foco deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do foco é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Ensaio') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if (typeof (data.spreadSheet[keySheet][sheet]) === 'string') {
                    const ensaio: any = await this.typeAssayController.getAll({ name: data.spreadSheet[keySheet][sheet] });
                    if (ensaio.total == 0) {
                      // console.log('aqui Ensaio');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta,o tipo de ensaio não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_type_assay = ensaio.response[0].id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, tipo de ensaio deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do tipo de ensaio é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'NPEI') {
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

              if (configModule.response[0].fields[sheet] == 'Epoca') {
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
              if (configModule.response[0].fields[sheet] == 'Local') {
                // console.log("Local R");
                const local: any = await this.localController.getAll(
                  { name_local_culture: data.spreadSheet[keySheet][sheet] },
                );
                this.aux.id_local = local.response[0].id;
              }

              if (configModule.response[0].fields[sheet] == 'Safra') {
                // console.log("Safra R");
                this.aux.id_safra = Number(data.safra);
              }

              if (configModule.response[0].fields[sheet] == 'OGM') {
                // console.log("OGM R");
                const ogm: any = await this.ogmController.getAll({ cod_tec: String(data.spreadSheet[keySheet][sheet]) });
                this.aux.id_ogm = ogm.response[0].id;
              }

              if (configModule.response[0].fields[sheet] == 'Foco') {
                // console.log("FOCO R");
                const foco: any = await this.focoController.getAll({ name: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                this.aux.id_foco = Number(foco.response[0].id);
              }

              if (configModule.response[0].fields[sheet] == 'Ensaio') {
                // console.log("Ensaio R");
                const ensaio: any = await this.typeAssayController.getAll({ name: data.spreadSheet[keySheet][sheet] });
                this.aux.id_type_assay = ensaio.response[0].id;
              }

              if (configModule.response[0].fields[sheet] == 'Epoca') {
                this.aux.epoca = String(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0].fields[sheet] == 'NPEI') {
                this.aux.npei = data.spreadSheet[keySheet][sheet];
              }

              if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                const { response: groupResponse }: any = await this.groupController.getAll({ id_safra: data.safra, id_foco: this.aux.id_foco });
                this.aux.id_group = Number(groupResponse[0].id);
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
      console.log('Erro geral import NPE: ');
      console.log(err);
      return 'Erro ao validar';
    }
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
              if (configModule.response[0].fields[sheet] == 'Nome') {
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

              if (configModule.response[0].fields[sheet] == 'Repeticao') {
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

              if (configModule.response[0].fields[sheet] == 'Sorteio') {
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

              if (configModule.response[0].fields[sheet] == 'Tratamento') {
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

              if (configModule.response[0].fields[sheet] == 'Bloco') {
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
              if (configModule.response[0].fields[sheet] == 'Nome') {
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

              if (configModule.response[0].fields[sheet] == 'Repeticao') {
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

              if (configModule.response[0].fields[sheet] == 'Sorteio') {
                aux.sorteio = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0].fields[sheet] == 'Tratamento') {
                aux.nt = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0].fields[sheet] == 'Bloco') {
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
              if (configModule.response[0].fields[sheet] == 'Genotipo') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo genótipo é obrigatorio.</li><br>`;
                } else {
                  const geno = await this.genotipoController.getAll({ genotipo: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                  if (geno.total == 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, genótipo não existe no sistema.</li><br>`;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Lote') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo Lote é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0].fields[sheet] == 'Volume') {
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
              if (configModule.response[0].fields[sheet] == 'Genotipo') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  const geno = await this.genotipoController.getAll({ genotipo: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                  if (geno.total > 0) {
                    this.aux.id_genotipo = geno.response[0].id;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Lote') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  const lote = await this.loteController.getAll({ name: data.spreadSheet[keySheet][sheet] });
                  if (lote.total > 0) {
                    this.aux.name = data.spreadSheet[keySheet][sheet];
                    this.aux.id = lote.response[0].id;
                  }
                  this.aux.name = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Volume') {
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
      configModule.response[0].fields.push('DT');
      for (const row in spreadSheet) {
        for (const column in spreadSheet[row]) {
          if (row === '0') {
            if (!(spreadSheet[row][column].toUpperCase()).includes(configModule.response[0].fields[column].toUpperCase())) {
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
            if (local.response[0].dt_import > spreadSheet[row][column]) {
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
                localCultureDTO.id = localAlreadyExists.response[0].id;
                unityCultureDTO.id_local = localAlreadyExists.response[0].id;
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
          if (configModule.response[0].fields[sheet] == 'Repeticao') {
            aux.repeticao = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (configModule.response[0].fields[sheet] == 'Sorteio') {
            aux.sorteio = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (configModule.response[0].fields[sheet] == 'Tratamento') {
            aux.nt = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (configModule.response[0].fields[sheet] == 'Bloco') {
            aux.bloco = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (data.spreadSheet[keySheet].length == Column && aux != []) {
            await this.sequenciaDelineamentoController.create(aux);
          }
        }
      }
    }
  }

  async validateQuadra(data: object | any) {
    const responseIfError: any = [];
    let Column: number;

    try {
      const configModule: object | any = await this.getAll(Number(data.moduleId));

      if (data != null && data != undefined) {
        let larg_q: any; let
          comp_p: any;
        let df: any = 0; let cod_quadra: any; let cod_quadra_anterior: any; let t4_i: any = 0; let
          t4_f: any = 0;
        let divisor_anterior: any = 0;
        let Line: number;
        let local_preparo: any = 0;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              if (configModule.response[0].fields[sheet] == 'Safra') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo safra é obrigatorio.</li><br>`;
                } else {
                  const safra = await this.safraController.getAll({ id_safra: Number(data.safra) });
                  if (safra.total > 0) {
                    if (String(data.spreadSheet[keySheet][sheet]) != safra.response[0].safraName) {
                      return 'A safra importada precisa ser igual a safra selecionada';
                    }
                  } else {
                    return 'A safra importada precisa ser igual a safra selecionada';
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Cultura') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo cultura é obrigatorio.</li><br>`;
                } else {
                  const culture: any = await this.culturaController.getOneCulture(Number(data.id_culture));

                  if (data.spreadSheet[keySheet][sheet].toUpperCase() != culture.response.name.toUpperCase()) {
                    return 'A cultura importada precisa ser igual a cultura selecionada';
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'LocalPrep') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o localprep cruza é obrigatorio.</li><br>`;
                } else {
                  const local: any = await this.localController.getAll({ name_local_culture: data.spreadSheet[keySheet][sheet] });
                  if (local.total == 0) {
                    local_preparo = 2;
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o local não existe no sistema.</li><br>`;
                  } else {
                    local_preparo = 1;
                    this.aux.local_preparo = local.response[0].id;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'CodigoQuadra') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo código quadra é obrigatorio.</li><br>`;
                } else {
                  if (local_preparo == 0) {
                    return 'Local preparo precisa ser importado antes do código da quadra';
                  }
                  if (local_preparo == 1) {
                    local_preparo = 0;
                    const quadra: any = await this.quadraController.getAll({ cod_quadra: data.spreadSheet[keySheet][sheet], local_preparo: this.aux.local_preparo, filterStatus: 1 });
                    if (quadra.total > 0) {
                      return 'Código quadra já existe neste local, para poder atualiza-lo você precisa inativar o existente';
                    }
                    cod_quadra_anterior = cod_quadra;
                    cod_quadra = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'LargQ') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a largq é obrigatorio.</li><br>`;
                } else if (larg_q != '') {
                  if (cod_quadra == cod_quadra_anterior) {
                    if (data.spreadSheet[keySheet][sheet] != larg_q) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a largQ precisa ser igual na planilha inteira.</li><br>`;
                      larg_q = data.spreadSheet[keySheet][sheet];
                    } else {
                      larg_q = data.spreadSheet[keySheet][sheet];
                    }
                  } else {
                    larg_q = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'CompP') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a compp é obrigatorio.</li><br>`;
                } else if (cod_quadra == cod_quadra_anterior) {
                  if (data.spreadSheet[keySheet][sheet] != comp_p) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o compP precisa ser igual na planilha inteira.</li><br>`;
                    comp_p = data.spreadSheet[keySheet][sheet];
                  } else {
                    comp_p = data.spreadSheet[keySheet][sheet];
                  }
                } else {
                  comp_p = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'LinhaP') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a linhap é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0].fields[sheet] == 'CompC') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a compc é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0].fields[sheet] == 'Esquema') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o esquema é obrigatorio.</li><br>`;
                } else {
                  const layoutQuadra: any = await this.layoutQuadraController.getAll({ esquema: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture, status: 1 });
                  if (layoutQuadra.total == 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o esquema do layout ainda não foi cadastrado.</li><br>`;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Divisor') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a divisor é obrigatorio.</li><br>`;
                } else if (cod_quadra == cod_quadra_anterior) {
                  if (divisor_anterior == 0) {
                    if (data.spreadSheet[keySheet][sheet] <= 0) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o divisor precisa começar com 1 e ser positivo.</li><br>`;
                    } else {
                      divisor_anterior = data.spreadSheet[keySheet][sheet];
                    }
                  } else if (data.spreadSheet[keySheet][sheet] > divisor_anterior) {
                    if ((divisor_anterior + 1) != data.spreadSheet[keySheet][sheet]) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, não pode ter intersecção de parcelas.</li><br>`;
                    }
                    divisor_anterior = data.spreadSheet[keySheet][sheet];
                  } else {
                    divisor_anterior = data.spreadSheet[keySheet][sheet];
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a coluna dos divisores precisa está em sequencia.</li><br>`;
                  }
                } else if (divisor_anterior == 0) {
                  if (data.spreadSheet[keySheet][sheet] <= 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o divisor precisa começar com 1 e ser positivo.</li><br>`;
                  }
                  divisor_anterior = data.spreadSheet[keySheet][sheet];
                } else {
                  divisor_anterior = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Semente') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a semmetro é obrigatorio.</li><br>`;
                } else if (data.spreadSheet[keySheet][sheet] <= 0) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a semmetro precisar ser maior que 0.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'T4I') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a t4i é obrigatorio.</li><br>`;
                } else if (cod_quadra == cod_quadra_anterior) {
                  if (t4_i == 0) {
                    if (data.spreadSheet[keySheet][sheet] != 1) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o t4i precisa começar com 1.</li><br>`;
                    }
                    t4_i = data.spreadSheet[keySheet][sheet];
                  } else {
                    if (data.spreadSheet[keySheet][sheet] <= t4_f) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o t4i precisa ser maior que a t4f anterior.</li><br>`;
                    }
                    t4_i = data.spreadSheet[keySheet][sheet];
                  }
                } else {
                  if (data.spreadSheet[keySheet][sheet] != 1) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o t4i precisa começar com 1.</li><br>`;
                  }
                  t4_i = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'T4F') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a t4f é obrigatorio.</li><br>`;
                } else if (cod_quadra == cod_quadra_anterior) {
                  if (t4_i == 0) {
                    return 'A coluna t4f precisa está depois da coluna t4i';
                  }
                  if (t4_i > data.spreadSheet[keySheet][sheet]) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o t4i e o t4f precisam estar em ordem crescente.</li><br>`;
                  } else {
                    t4_f = data.spreadSheet[keySheet][sheet];
                  }
                } else {
                  if (t4_i == 0) {
                    return 'A coluna t4f precisa está depois da coluna t4i';
                  }
                  if (t4_i > data.spreadSheet[keySheet][sheet]) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o t4i e o t4f precisam estar em ordem crescente.</li><br>`;
                  } else {
                    t4_f = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'DI') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a di é obrigatorio.</li><br>`;
                } else if (data.spreadSheet[keySheet][sheet] != 1) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o di precisa ser 1. </li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'DF') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a df é obrigatorio.</li><br>`;
                } else if (df == 0) {
                  df = data.spreadSheet[keySheet][sheet];
                } else {
                  df = data.spreadSheet[keySheet][sheet];
                  if (cod_quadra == cod_quadra_anterior) {
                    if (df != data.spreadSheet[keySheet][sheet]) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a coluna df deve ser igual para este pai.</li><br>`;
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (responseIfError == '') {
        // this.aux = "";
        this.aux.created_by = Number(data.created_by);
        this.aux.id_culture = Number(data.id_culture);
        this.aux.status = 1;
        let count = 1;
        let tiro_fixo; let
          disparo_fixo;

        this.aux.id_safra = Number(data.safra);
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              if (configModule.response[0].fields[sheet] == 'LocalPrep') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  // this.aux.local_preparo = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'CodigoQuadra') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if ((this.aux.cod_quadra) && this.aux.cod_quadra != data.spreadSheet[keySheet][sheet]) {
                    this.aux.disparo_fixo = this.aux.t4_f;
                    count = 1;
                  }
                  this.aux.cod_quadra = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'LargQ') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.larg_q = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'CompP') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.comp_p = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'LinhaP') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.linha_p = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'CompC') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.comp_c = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Esquema') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.esquema = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Divisor') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.divisor = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Semente') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.sem_metros = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'T4I') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.t4_i = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'T4F') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.t4_f = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'DI') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.di = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'DF') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.df = data.spreadSheet[keySheet][sheet];
                }
              }

              if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                if (count == 1) {
                  this.aux.tiro_fixo = this.aux.t4_i;

                  if (this.aux.id_quadra) {
                    const update = await this.quadraController.update({ id: this.aux.id_quadra, tiro_fixo: this.aux.tiro_fixo, disparo_fixo: this.aux.disparo_fixo });
                  }

                  const saveQuadra: any = await this.quadraController.create({
                    cod_quadra: this.aux.cod_quadra,
                    id_culture: this.aux.id_culture,
                    id_safra: this.aux.id_safra,
                    local_preparo: this.aux.local_preparo,
                    larg_q: this.aux.larg_q,
                    comp_p: this.aux.comp_p,
                    linha_p: this.aux.linha_p,
                    comp_c: this.aux.comp_c,
                    esquema: this.aux.esquema,
                    status: this.aux.status,
                    created_by: this.aux.created_by,
                  });
                  this.aux.id_quadra = saveQuadra.response.id;
                  count++;
                }

                await this.disparosController.create({
                  id_quadra: this.aux.id_quadra,
                  t4_i: this.aux.t4_i,
                  t4_f: this.aux.t4_f,
                  di: this.aux.di,
                  divisor: this.aux.divisor,
                  df: this.aux.df,
                  sem_metros: this.aux.sem_metros,
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
      return 'Houve um erro, tente novamente mais tarde!8';
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
              if (configModule.response[0].fields[sheet] == 'Esquema') {
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

              if (configModule.response[0].fields[sheet] == 'Plantadeiras') {
                if (data.spreadSheet[keySheet][sheet] == '') {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a plantadeira é obrigatorio.</li><br>`;
                } else if (Number(data.spreadSheet[keySheet][sheet]) != 4 && Number(data.spreadSheet[keySheet][sheet]) != 8 && Number(data.spreadSheet[keySheet][sheet] != 12)) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a plantadeira deve estar dentro desses numeros 4,8 e 12.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Tiro') {
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

              if (configModule.response[0].fields[sheet] == 'Disparo') {
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

              if (configModule.response[0].fields[sheet] == 'SL') {
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

              if (configModule.response[0].fields[sheet] == 'SC') {
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

              if (configModule.response[0].fields[sheet] == 'SALOC') {
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

              if (configModule.response[0].fields[sheet] == 'CJ') {
                if (data.spreadSheet[keySheet][sheet] == '' || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo cj é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Dist') {
                if (data.spreadSheet[keySheet][sheet] == '' || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo dist é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'ST') {
                if (data.spreadSheet[keySheet][sheet] == '' || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a st é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0].fields[sheet] == 'SPC') {
                if (data.spreadSheet[keySheet][sheet] == '' || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a spc é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0].fields[sheet] == 'SColheita') {
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

              if (configModule.response[0].fields[sheet] == 'TipoParcela') {
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
              if (configModule.response[0].fields[sheet] == 'Esquema') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  if ((this.aux.esquema) && this.aux.esquema != data.spreadSheet[keySheet][sheet]) {
                    const layoutQuadra: any = await this.layoutQuadraController.getAll({ status: 1, id_culture: data.id_culture, esquema: data.spreadSheet[keySheet][sheet] });
                    if (layoutQuadra.total > 0) {
                      this.aux.id_layout_bd = layoutQuadra.response[0].id;
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

              if (configModule.response[0].fields[sheet] == 'Plantadeiras') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.plantadeira = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Tiro') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.tiro = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Disparo') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.disparo = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'SL') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.sl = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'SC') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.sc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'SALOC') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.s_aloc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'CJ') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.cj = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Dist') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.dist = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'ST') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.st = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'SPC') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.spc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'SColheita') {
                if (data.spreadSheet[keySheet][sheet] != '') {
                  this.aux.scolheita = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'TipoParcela') {
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
