/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/* eslint-disable no-loop-func */
/* eslint-disable import/no-cycle */
/* eslint-disable no-await-in-loop */

import {TransactionConfig} from 'src/shared/prisma/transactionConfig';
import {ImportValidate, IReturnObject,} from '../../interfaces/shared/Import.interface';
import handleError from '../../shared/utils/handleError';
import {validateInteger} from '../../shared/utils/numberValidate';
import {
  responseGenericFactory,
  responseNullFactory,
  responsePositiveNumericFactory,
} from '../../shared/utils/responseErrorFactory';
import {validateHeaders} from '../../shared/utils/validateHeaders';
import {CulturaController} from '../cultura.controller';
import {ImportController} from '../import.controller';
import {LogImportController} from '../log-import.controller';
import {LoteController} from '../lote.controller';
import {SafraController} from '../safra.controller';
import {TecnologiaController} from '../technology/tecnologia.controller';
import {GenotipoController} from './genotipo.controller';
import {genotipeQueue} from './genotipeQueue';

import {GenotipoRepository} from '../../repository/genotipo.repository';
import {LoteRepository} from '../../repository/lote.repository';
import {convertDateToSQLDatetimeUTC, convertSerialDateToJSDate, validarData} from 'src/shared/utils/formatDateEpoch';

/* eslint-disable no-restricted-syntax */
export class ImportGenotypeController {
  static aux: any = {};

  static async validate(
    idLog: number,
    queueProcessing: boolean,
    {
      spreadSheet, idSafra, idCulture, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const logImportController = new LogImportController();
    const headers = [
      'ID_S1 (S1_ID_S1)',
      'Identificador de dados (S1_DATA_ID)',
      'Cultura (S1_C0002)',
      'Nome do genótipo (S1_C0001)',
      'Nome principal (S1_C0000)',
      'Nome público (S1_C0003)',
      'Nome experimental (S1_C0012)',
      'Nome alternativo (S1_C0162)',
      'ELITE_NOME (S1_C3166)',
      'Código da tecnologia (S1_C0189)',
      'Tipo (S1_C0005)',
      'GMR (S1_C3061)',
      'BGM (S1_C3074)',
      'Cruzamento de origem (S1_C0201)',
      'Progenitor F direto (S1_C0006)',
      'Progenitor M direto (S1_C0007)',
      'Progenitor F de origem (S1_C0008)',
      'Progenitor M de origem (S1_C0009)',
      'Progenitores de origem (S1_C0010)',
      'Parentesco completo (S1_C0011)',
      'ID_S2 (ID_S2)',
      'Identificador de dados (DATA_ID)',
      'Ano do lote (C0052)',
      'SAFRA (C0199)',
      'Código do lote (C0050)',
      'NCC (C3107)',
      'FASE (C0200)',
      'Peso (C0065)',
      'Quantidade (C0126)',
      'DT_Export (SCRIPT0002)',
    ];
    const validate: any = await validateHeaders(spreadSheet, headers);
    if (validate.length > 0) {
      await logImportController.update({
        id: idLog, status: 1, state: 'INVALIDA', updated_at: new Date(Date.now()), invalid_data: validate,
      });
      return { status: 400, message: validate };
    }

    if ((spreadSheet.length > Number(process.env.MAX_DIRECT_UPLOAD_ALLOWED)) && !queueProcessing) {
      genotipeQueue.add({
        instance: {
          spreadSheet, idSafra, idCulture, created_by: createdBy,
        },
        logId: idLog,
      });
      return {
        status: 400,
        message: 'Os dados são validados e carregados em background',
      };
    }

    const loteController = new LoteController();
    const safraController = new SafraController();
    const importController = new ImportController();
    const culturaController = new CulturaController();
    const tecnologiaController = new TecnologiaController();

    const responseIfError: any = [];
    const nccValidate: any = [];
    const allEqual = (arr: any) => arr.every((val: any) => val === arr[0]);
    let validateAll: any = {};
    try {
      const configModule: object | any = await importController.getAll(10);

      for (const row in spreadSheet) {
        
        let linhaStr = String(Number(row) + 1);
        
        if (row !== '0') {
          if (nccValidate.includes(spreadSheet[row][25])) {
            responseIfError[Number(25)] += responseGenericFactory(
              Number(25) + 1,
              linhaStr,
              spreadSheet[0][25],
              'esta repetido na planilha',
            );
          }
          if (spreadSheet.length > 2) {
            if (spreadSheet[row][1] !== spreadSheet[Number(row) - 1][1]
            || (spreadSheet.length - 1) === Number(row)) {
              if ((spreadSheet.length - 1) === Number(row) && spreadSheet[row][1] === spreadSheet[Number(row) - 1][1]) {
                validateAll.NOME_PRINCIPAL.push(spreadSheet[row][4]);
                validateAll.NOME_PUBLICO.push(spreadSheet[row][5]);
                validateAll.NOME_EXPERIMENTAL.push(spreadSheet[row][6]);
                validateAll.NOME_ALTERNATIVO.push(spreadSheet[row][7]);
                validateAll.ELITE_NOME.push(spreadSheet[row][8]);
                validateAll.TECNOLOGIA.push(spreadSheet[row][9]);
                validateAll.TIPO.push(spreadSheet[row][10]);
                validateAll.GMR.push(spreadSheet[row][11]);
                validateAll.BGM.push(spreadSheet[row][12]);
                validateAll.CRUZAMENTO_ORIGEM.push(spreadSheet[row][13]);
                validateAll.PROGENITOR_F_DIREITO.push(spreadSheet[row][14]);
                validateAll.PROGENITOR_M_DIREITO.push(spreadSheet[row][15]);
                validateAll.PROGENITOR_F_ORIGEM.push(spreadSheet[row][16]);
                validateAll.PROGENITOR_M_ORIGEM.push(spreadSheet[row][17]);
                validateAll.PROGENITORES_ORIGEM.push(spreadSheet[row][18]);
                validateAll.PARENTESCO_COMPLETO.push(spreadSheet[row][19]);
              }

              for (const property in validateAll) {
                const result = allEqual(validateAll[property]);
                if (!result) {
                  responseIfError[Number(0)]
                  += `<li style="text-align:left"> A coluna ${property} está incorreta, todos os itens do ID_DADOS-${spreadSheet[Number(row) - 1][1]} devem ser iguais. favor checar. </li> <br>`;
                }
              }

              validateAll = {
                NOME_PUBLICO: [],
                NOME_PRINCIPAL: [],
                NOME_EXPERIMENTAL: [],
                NOME_ALTERNATIVO: [],
                ELITE_NOME: [],
                TECNOLOGIA: [],
                TIPO: [],
                GMR: [],
                BGM: [],
                CRUZAMENTO_ORIGEM: [],
                PROGENITOR_F_DIREITO: [],
                PROGENITOR_M_DIREITO: [],
                PROGENITOR_F_ORIGEM: [],
                PROGENITOR_M_ORIGEM: [],
                PROGENITORES_ORIGEM: [],
                PARENTESCO_COMPLETO: [],

              };
              validateAll.NOME_PRINCIPAL.push(spreadSheet[row][4]);
              validateAll.NOME_PUBLICO.push(spreadSheet[row][5]);
              validateAll.NOME_EXPERIMENTAL.push(spreadSheet[row][6]);
              validateAll.NOME_ALTERNATIVO.push(spreadSheet[row][7]);
              validateAll.ELITE_NOME.push(spreadSheet[row][8]);
              validateAll.TECNOLOGIA.push(spreadSheet[row][9]);
              validateAll.TIPO.push(spreadSheet[row][10]);
              validateAll.GMR.push(spreadSheet[row][11]);
              validateAll.BGM.push(spreadSheet[row][12]);
              validateAll.CRUZAMENTO_ORIGEM.push(spreadSheet[row][13]);
              validateAll.PROGENITOR_F_DIREITO.push(spreadSheet[row][14]);
              validateAll.PROGENITOR_M_DIREITO.push(spreadSheet[row][15]);
              validateAll.PROGENITOR_F_ORIGEM.push(spreadSheet[row][16]);
              validateAll.PROGENITOR_M_ORIGEM.push(spreadSheet[row][17]);
              validateAll.PROGENITORES_ORIGEM.push(spreadSheet[row][18]);
              validateAll.PARENTESCO_COMPLETO.push(spreadSheet[row][19]);
            } else {
              validateAll.NOME_PRINCIPAL.push(spreadSheet[row][4]);
              validateAll.NOME_PUBLICO.push(spreadSheet[row][5]);
              validateAll.NOME_EXPERIMENTAL.push(spreadSheet[row][6]);
              validateAll.NOME_ALTERNATIVO.push(spreadSheet[row][7]);
              validateAll.ELITE_NOME.push(spreadSheet[row][8]);
              validateAll.TECNOLOGIA.push(spreadSheet[row][9]);
              validateAll.TIPO.push(spreadSheet[row][10]);
              validateAll.GMR.push(spreadSheet[row][11]);
              validateAll.BGM.push(spreadSheet[row][12]);
              validateAll.CRUZAMENTO_ORIGEM.push(spreadSheet[row][13]);
              validateAll.PROGENITOR_F_DIREITO.push(spreadSheet[row][14]);
              validateAll.PROGENITOR_M_DIREITO.push(spreadSheet[row][15]);
              validateAll.PROGENITOR_F_ORIGEM.push(spreadSheet[row][16]);
              validateAll.PROGENITOR_M_ORIGEM.push(spreadSheet[row][17]);
              validateAll.PROGENITORES_ORIGEM.push(spreadSheet[row][18]);
              validateAll.PARENTESCO_COMPLETO.push(spreadSheet[row][19]);
            }
          }
          nccValidate.push(spreadSheet[row][25]);
          for (const column in spreadSheet[row]) {
            // campos genotipo
            if (configModule.response[0]?.fields[column] === 'id_s1') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'S1_DATA_ID') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'Cultura') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              } else {
                const cultura = await culturaController.getAllCulture({
                  name: spreadSheet[row][column],
                });
                if (cultura.total > 0) {
                  if (idCulture !== cultura.response[0]?.id) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      linhaStr,
                      spreadSheet[0][column],
                      'o campo cultura tem que ser igual a cultura selecionada',
                    );
                  }
                } else {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    linhaStr,
                    spreadSheet[0][column],
                    'cultura não existe',
                  );
                }
              }
            }

            if (
              configModule.response[0]?.fields[column] === 'Nome do genótipo'
            ) {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              }
            }

            if (
              configModule.response[0]?.fields[column]
              === 'Código da tecnologia'
            ) {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              } else if ((spreadSheet[row][column]).toString().length > 2) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                  linhaStr,
                    spreadSheet[0][column],
                    'o limite de caracteres e 2',
                  );
              } else {
                if (spreadSheet[row][column].toString().length < 2) {
                  // eslint-disable-next-line no-param-reassign
                  spreadSheet[row][column] = `0${spreadSheet[row][column].toString()}`;
                }

                const tec: any = await tecnologiaController.getAll({
                  id_culture: idCulture,
                  cod_tec: String(spreadSheet[row][column]),
                });
                if (tec.total === 0) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    linhaStr,
                    spreadSheet[0][column],
                    'a tecnologia informado não existe no sistema',
                  );
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'gmr') {
              if (spreadSheet[row][column] !== null) {
                if (isNaN(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    (Number(column) + 1),
                    linhaStr,
                    spreadSheet[0][column],
                    'precisa ser um numero positivo',
                  );
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'bgm') {
              if (spreadSheet[row][column] !== null) {
                if (isNaN(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responsePositiveNumericFactory(
                    Number(column) + 1,
                    linhaStr,
                    spreadSheet[0][column],
                  );
                }
              }
            }

            // Campos lote
            if (configModule.response[0]?.fields[column] === 'DATA_ID') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              } else {
                const { response: lote }: any = await loteController.getAll({
                  id_dados: spreadSheet[row][column],
                  id_culture: idCulture,
                });
                if (lote[0]?.safra?.id !== idSafra) {
                  if (lote.length > 0) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      linhaStr,
                      spreadSheet[0][column],
                      'o lote já foi cadastrado em outra safra',
                    );
                  }
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'Ano do lote') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              }
              const { response }: IReturnObject = await safraController.getAll({
                id_culture: idCulture,
                filterSafra: String(spreadSheet[row][23]),
                filterStatus: 1,
              });
              
              if (Number(response[0]?.year) !== Number(spreadSheet[row][column])) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                  'ano não é igual ao da safra',
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'Safra') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              } else {
                const { response: safras }: IReturnObject = await safraController.getAll({
                  id_culture: idCulture,
                  filterSafra: String(spreadSheet[row][column]),
                  filterStatus: 1,
                });
                if (safras.length <= 0) {
                  if (safras?.safraName?.toUpperCase()
                          !== spreadSheet[row][column]?.toUpperCase()) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      linhaStr,
                      spreadSheet[0][column],
                      'safra não cadastrada ou inativa nessa cultura',
                    );
                  }
                } else {
                  const { response }: IReturnObject = await safraController.getOne(idSafra);
                  if (response.safraName?.toUpperCase()
                           !== spreadSheet[row][column]?.toUpperCase()) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      linhaStr,
                      spreadSheet[0][column],
                      'safra e diferente da selecionada',
                    );
                  }
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'Código do lote') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              } else {
                if (isNaN(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responsePositiveNumericFactory(
                    Number(column) + 1,
                    linhaStr,
                    spreadSheet[0][column],
                  );
                }
                const lote: any = loteController.getAll({
                  cod_lote: Number(spreadSheet[row][column]),
                  id_culture: idCulture,
                });
                if (lote.total > 0) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    linhaStr,
                    spreadSheet[0][column],
                    'código do lote deve ser um campo único no GOM',
                  );
                }
              }
            }

            if (
              configModule.response[0]?.fields[column]
                === 'Cruzamento de origem'
            ) {
              // cruzamento sem validação
            }

            if (configModule.response[0]?.fields[column] === 'id_s2') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'NCC') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              } else if (!validateInteger(spreadSheet[row][column])
                  || spreadSheet[row][column].toString().length > 12) {
                responseIfError[Number(column)] += responseGenericFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column],
                  'precisa ser um numero inteiro e positivo e ter 12 dígitos',
                );
              } else {
                const { response }: IReturnObject = await loteController.getAll({
                  ncc: spreadSheet[row][column],
                  id_culture: idCulture,
                });
                if (response[0]?.safra?.id !== idSafra) {
                  if (response.length > 0) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      (Number(column) + 1),
                      linhaStr,
                      spreadSheet[0][column],
                      'é chave única na cultura, e já foi cadastrado',
                    );
                  }
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'Peso') {
              if (isNaN(spreadSheet[row][column])) {
                responseIfError[Number(column)] += responsePositiveNumericFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'DT_EXPORT') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                );
              } else if (typeof spreadSheet[row][column] !== 'number') {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                  'o campo DT precisa ser numérico separado por virgula',
                );
              } else {

                /*
                spreadSheet[row][column] = spreadSheet[row][column].replace(/\.\d+/, '');
                // eslint-disable-next-line no-param-reassign
                spreadSheet[row][column] = new Date(spreadSheet[row][column]);*/
                
                const { status, response: responseLoteExists }: IReturnObject = await loteController.getAll({
                  id_dados: spreadSheet[row][21],
                  id_culture: idCulture,
                });
                
                const dateEpoch = spreadSheet[row][column];
                
                const dateJs = convertSerialDateToJSDate(dateEpoch);
                
                const dateNow = new Date();

                const dateTimeSqlUTC = convertDateToSQLDatetimeUTC(dateEpoch);

                if (dateNow.getTime() < dateJs.getTime()) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    linhaStr,
                    spreadSheet[0][column],
                    'a data e maior que a data atual',
                  );
                }

                if (!validarData(dateTimeSqlUTC)) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    linhaStr,
                    spreadSheet[0][column],
                    'o campo DT precisa ser no formato data numérico (ex: XXXXX,XXXXXXXXXX)',
                  );
                }
                
                if (status === 200) {
                  const lastDtImport = Number(responseLoteExists[0]?.dt_rde);
                  // console.log('lastDtImport', lastDtImport, dateEpoch, lastDtImport > dateEpoch);
                  if ((lastDtImport != null) && lastDtImport > dateEpoch) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      linhaStr,
                      spreadSheet[0][column],
                      'essa informação é mais antiga do que a informação do software',
                    );
                  }
                }
              }
            }
          }
        }
      }

      if (responseIfError.length === 0) {
        return this.storeRecords(idLog, {
          spreadSheet, idSafra, idCulture, created_by: createdBy,
        });
      }
      const responseStringError = responseIfError
        .join('')
        .replace(/undefined/g, '');

      await logImportController.update({
        id: idLog,
        status: 1,
        state: 'INVALIDA',
        invalid_data: responseStringError,
        updated_at: new Date(Date.now()),
      });
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({
        id: idLog,
        status: 1,
        state: 'FALHA',
        updated_at: new Date(Date.now()),
      });
      handleError('Genótipo controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de Genótipo' };
    }
  }

  static async storeRecords(idLog: number, {
    spreadSheet, idSafra, idCulture, created_by: createdBy,
  }: ImportValidate) {
    const loteController = new LoteController();
    const importController = new ImportController();
    const genotipoController = new GenotipoController();
    const tecnologiaController = new TecnologiaController();
    const logImportController = new LogImportController();

    /* --------- Transcation Context --------- */
    const transactionConfig = new TransactionConfig();
    const genotipoRepository = new GenotipoRepository();
    const loteRepository = new LoteRepository();
    loteRepository.setTransaction(
      transactionConfig.clientManager,
      transactionConfig.transactionScope,
    );
    genotipoRepository.setTransaction(
      transactionConfig.clientManager,
      transactionConfig.transactionScope,
    );
    /* --------------------------------------- */

    try {
      const configModule: object | any = await importController.getAll(10);
      await transactionConfig.transactionScope.run(async () => {
        for (const row in spreadSheet) {
          if (row !== '0') {
            for (const column in spreadSheet[row]) {
              this.aux.genealogy = '';
              // campos genotipo
              if (configModule.response[0]?.fields[column] === 'id_s1') {
                if (spreadSheet[row][column] !== null) {
                  this.aux.id_s1 = spreadSheet[row][column];
                }
              }

              if (configModule.response[0]?.fields[column] === 'S1_DATA_ID') {
                if (spreadSheet[row][column] !== null) {
                  const genotypeId : string = String(spreadSheet[row][column]);
                  const params = { id_dados: genotypeId, id_culture: idCulture };
                  const select = { id: true, id_dados: true, name_genotipo: true };
                  const take = undefined;
                  const skip = undefined;
                  const order = undefined;

                  const genotypeList : any = await genotipoRepository.findAll(params, select, take, skip, order);

                  if (genotypeList.total > 0) {
                    this.aux.id_genotipo = genotypeList[0].id;
                  } else {
                    this.aux.id_genotipo = null;
                  }
                  this.aux.id_dados_geno = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column]
                === 'Nome do genótipo'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.name_genotipo = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column] === 'Nome principal'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.name_main = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column] === 'Nome público'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.name_public = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column]
                === 'Nome experimental'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.name_experiment = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column]
                === 'Nome alternativo'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.name_alter = spreadSheet[row][column];
                }
              }

              if (configModule.response[0]?.fields[column] === 'Elite_Nome') {
                if (spreadSheet[row][column] !== null) {
                  this.aux.elit_name = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column]
                === 'Código da tecnologia'
              ) {
                if (spreadSheet[row][column] !== null) {
                  if (
                    typeof spreadSheet[row][column] === 'number'
                    && spreadSheet[row][column].toString().length < 2
                  ) {
                    // eslint-disable-next-line no-param-reassign
                    spreadSheet[row][column] = `0${spreadSheet[row][
                      column
                    ].toString()}`;
                  }
                  const tec: any = await tecnologiaController.getAll({
                    id_culture: idCulture,
                    cod_tec: String(spreadSheet[row][column]),
                  });
                  if (tec.total > 0) {
                    this.aux.id_tecnologia = tec.response[0]?.id;
                  }
                }
              }

              if (configModule.response[0]?.fields[column] === 'Tipo') {
                if (spreadSheet[row][column] !== null) {
                  this.aux.type = spreadSheet[row][column];
                }
              }

              if (configModule.response[0]?.fields[column] === 'gmr') {
                if (spreadSheet[row][column] !== null) {
                  this.aux.gmr = Number(spreadSheet[row][column]).toFixed(1);
                }
              }

              if (configModule.response[0]?.fields[column] === 'bgm') {
                if (spreadSheet[row][column] !== null) {
                  this.aux.bgm = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column]
                === 'Cruzamento de origem'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.cruza = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column]
                === 'Progenitor F direto'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.progenitor_f_direto = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column]
                === 'Progenitor M direto'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.progenitor_m_direto = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column]
                === 'Progenitor F de origem'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.progenitor_f_origem = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column]
                === 'Progenitor M de origem'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.progenitor_m_origem = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column]
                === 'Progenitores de origem'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.progenitores_origem = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column]
                === 'Parentesco Completo'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.parentesco_completo = spreadSheet[row][column];
                }
              }

              // Campos lote
              if (configModule.response[0]?.fields[column] === 'id_s2') {
                if (spreadSheet[row][column] !== null) {
                  this.aux.id_s2 = spreadSheet[row][column];
                }
              }

              if (configModule.response[0]?.fields[column] === 'DATA_ID') {
                if (spreadSheet[row][column] !== null) {
                  const lote: any = await loteController.getAll({
                    id_dados: spreadSheet[row][column],
                    id_culture: idCulture,
                  });
                  if (lote.total > 0) {
                    this.aux.id_lote = lote.response[0]?.id;
                  }
                  this.aux.id_dados_lote = spreadSheet[row][column];
                }
              }

              if (
                configModule.response[0]?.fields[column] === 'Ano do lote'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.year = spreadSheet[row][column];
                }
              }

              if (configModule.response[0]?.fields[column] === 'NCC') {
                if (spreadSheet[row][column] !== null) {
                  this.aux.ncc = spreadSheet[row][column];
                } else {
                  this.aux.ncc = 0;
                }
              }

              if (
                configModule.response[0]?.fields[column] === 'Código do lote'
              ) {
                if (spreadSheet[row][column] !== null) {
                  this.aux.cod_lote = spreadSheet[row][column];
                }
              }

              if (configModule.response[0]?.fields[column] === 'Fase') {
                if (spreadSheet[row][column] !== null) {
                  this.aux.fase = spreadSheet[row][column];
                }
              }

              if (configModule.response[0]?.fields[column] === 'Peso') {
                if (spreadSheet[row][column] !== null) {
                  this.aux.peso = Number(spreadSheet[row][column]).toFixed(5);
                }
              }

              if (configModule.response[0]?.fields[column] === 'SEMENTES') {
                if (spreadSheet[row][column] !== null) {
                  this.aux.quant_sementes = spreadSheet[row][column];
                }
              }

              if (configModule.response[0]?.fields[column] === 'DT_EXPORT') {
                if (spreadSheet[row][column] !== null) {
                  let dateEpoch = spreadSheet[row][column];
                  // convertSerialDateToJSDate
                  const dateJSDate = convertSerialDateToJSDate(dateEpoch);
                  this.aux.dt_export = dateJSDate;
                  this.aux.dt_rde = dateEpoch;
                }
              }

              if (
                spreadSheet[row].length === Number(column) + 1
              ) {
                if (this.aux.id_genotipo) {
                  await genotipoRepository.updateTransaction(this.aux.id_genotipo, {
                    id: this.aux.id_genotipo,
                    id_tecnologia: Number(this.aux.id_tecnologia),
                    id_s1: this.aux.id_s1,
                    id_dados: String(this.aux.id_dados_geno),
                    name_genotipo: this.aux.name_genotipo,
                    name_main: this.aux.name_main ? String(this.aux.name_main) : null,
                    name_public: this.aux.name_public ? String(this.aux.name_public) : null,
                    name_experiment: this.aux.name_experiment ? String(this.aux.name_experiment) : null,
                    name_alter: this.aux.name_alter ? String(this.aux.name_alter) : null,
                    elit_name: this.aux.elit_name ? String(this.aux.elit_name) : null,
                    type: this.aux.type ? String(this.aux.type) : null,
                    gmr: this.aux.gmr ? this.aux.gmr : null,
                    bgm: this.aux.bgm ? this.aux.bgm : null,
                    cruza: this.aux.cruza ? String(this.aux.cruza) : null,
                    progenitor_f_direto: this.aux.progenitor_f_direto ? String(this.aux.progenitor_f_direto) : null,
                    progenitor_m_direto: this.aux.progenitor_m_direto ? String(this.aux.progenitor_m_direto) : null,
                    progenitor_f_origem: this.aux.progenitor_f_origem ? String(this.aux.progenitor_f_origem) : null,
                    progenitor_m_origem: this.aux.progenitor_m_origem ? String(this.aux.progenitor_m_origem) : null,
                    progenitores_origem: this.aux.progenitores_origem ? String(this.aux.progenitores_origem) : null,
                    parentesco_completo: this.aux.parentesco_completo ? String(this.aux.parentesco_completo) : null,
                    created_by: createdBy,
                  });
                } else {
                  const genotipo: any = await genotipoRepository.createTransaction({
                    id_culture: idCulture,
                    id_tecnologia: this.aux.id_tecnologia,
                    id_s1: this.aux.id_s1,
                    id_dados: String(this.aux.id_dados_geno),
                    name_genotipo: this.aux.name_genotipo,
                    name_main: this.aux.name_main ? String(this.aux.name_main) : null,
                    name_public: this.aux.name_public ? String(this.aux.name_public) : null,
                    name_experiment: this.aux.name_experiment ? String(this.aux.name_experiment) : null,
                    name_alter: this.aux.name_alter ? String(this.aux.name_alter) : null,
                    elit_name: this.aux.elit_name ? String(this.aux.elit_name) : null,
                    type: this.aux.type ? String(this.aux.type) : null,
                    gmr: this.aux.gmr ? Number(this.aux.gmr) : null,
                    bgm: this.aux.bgm ? Number(this.aux.bgm) : null,
                    cruza: this.aux.cruza ? String(this.aux.cruza) : null,
                    progenitor_f_direto: this.aux.progenitor_f_direto ? String(this.aux.progenitor_f_direto) : null,
                    progenitor_m_direto: this.aux.progenitor_m_direto ? String(this.aux.progenitor_m_direto) : null,
                    progenitor_f_origem: this.aux.progenitor_f_origem ? String(this.aux.progenitor_f_origem) : null,
                    progenitor_m_origem: this.aux.progenitor_m_origem ? String(this.aux.progenitor_m_origem) : null,
                    progenitores_origem: this.aux.progenitores_origem ? String(this.aux.progenitores_origem) : null,
                    parentesco_completo: this.aux.parentesco_completo ? String(this.aux.parentesco_completo) : null,
                    created_by: createdBy,
                  });

                  this.aux.id_genotipo = await genotipo.id;
                }

                if (this.aux.id_genotipo) {
                  if (this.aux.id_lote) {
                    await loteRepository.updateTransaction(this.aux.id_lote, {
                      id: Number(this.aux.id_lote),
                      id_genotipo: Number(this.aux.id_genotipo),
                      id_safra: Number(idSafra),
                      id_culture: idCulture,
                      cod_lote: Number(this.aux.cod_lote),
                      id_s2: Number(this.aux.id_s2),
                      id_dados: Number(this.aux.id_dados_lote),
                      year: Number(this.aux.year),
                      ncc: Number(this.aux.ncc),
                      fase: this.aux.fase ? String(this.aux.fase) : null,
                      peso: this.aux.peso ? this.aux.peso : null,
                      quant_sementes: this.aux.quant_sementes ? Number(this.aux.quant_sementes) : null,
                      dt_export: this.aux.dt_export,
                      dt_rde: this.aux.dt_rde,
                      created_by: createdBy,
                    });

                    const genotype: any = await genotipoRepository.findOne(this.aux.id_genotipo);
                    const genotypeUpdated:any = await genotipoRepository.updateTransaction(this.aux.id_genotipo, { numberLotes: genotype?.lote?.length });
                  } else {
                    const lote = await loteRepository.createTransaction({
                      id_genotipo: Number(this.aux.id_genotipo),
                      id_safra: Number(idSafra),
                      id_culture: idCulture,
                      cod_lote: Number(this.aux.cod_lote),
                      id_s2: Number(this.aux.id_s2),
                      id_dados: Number(this.aux.id_dados_lote),
                      year: Number(this.aux.year),
                      ncc: Number(this.aux.ncc),
                      fase: this.aux.fase ? String(this.aux.fase) : null,
                      peso: this.aux.peso ? this.aux.peso : null,
                      quant_sementes: this.aux.quant_sementes,
                      dt_export: this.aux.dt_export,
                      dt_rde: this.aux.dt_rde,
                      created_by: createdBy,
                    });

                    const genotype: any = await genotipoRepository.findOne(this.aux.id_genotipo);
                    const genotypeUpdated: any = await genotipoRepository.updateTransaction(this.aux.id_genotipo, {numberLotes: genotype?.lote?.length});
                  }
                }
                this.aux = [];
              }
            }
          }
        }
      });
      await logImportController.update({
        id: idLog,
        status: 1,
        state: 'SUCESSO',
      });
      return { status: 200, message: 'Genótipo importado com sucesso' };
    } catch (error: any) {
      console.error('Genótipo controller error', 'Save Import', error);

      await logImportController.update({
        id: idLog,
        status: 1,
        state: 'FALHA',
        invalid_data: JSON.stringify(error),
        updated_at: new Date(Date.now()),
      });
      handleError('Genótipo controller', 'Save Import', error.message);
      return {
        status: 500,
        message: 'Erro ao salvar planilha de Genótipo',
      };
    }
  }
}
