/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import {
  culture, delineamento, local, safra, assay_list, experiment,
} from '@prisma/client';
import handleError from '../../shared/utils/handleError';
import {
  responseDiffFactory,
  responseNullFactory,
  responseGenericFactory,
  responseDoesNotExist,
  responsePositiveNumericFactory,
} from '../../shared/utils/responseErrorFactory';
import {ImportValidate, IReturnObject} from '../../interfaces/shared/Import.interface';
import {SafraController} from '../safra.controller';
import {LocalController} from '../local/local.controller';
import {DelineamentoController} from '../delimitation/delineamento.controller';
import {AssayListController} from '../assay-list/assay-list.controller';
import {ExperimentController} from './experiment.controller';
import {LogImportController} from '../log-import.controller';
import {validateInteger} from '../../shared/utils/numberValidate';
import {CulturaController} from '../cultura.controller';
import {validateHeaders} from '../../shared/utils/validateHeaders';
import {experimentQueue} from './experimento-queue';

export class ImportExperimentController {
  static async validate(
    idLog: number,
    queueProcessing: boolean,
    {
      spreadSheet, idSafra, idCulture, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const safraController = new SafraController();
    const localController = new LocalController();
    const culturaController = new CulturaController();
    const logImportController = new LogImportController();
    const assayListController = new AssayListController();
    const experimentController = new ExperimentController();
    const delineamentoController = new DelineamentoController();

    const experimentNameTemp: Array<string> = [];
    const responseIfError: Array<string> = [];
    const headers = [
      'CULTURA',
      'SAFRA',
      'ENSAIO',
      'FOCO',
      'GLI',
      'GGEN',
      'BGM',
      'CODLOCAL',
      'DENSIDADE',
      'EP',
      'DELI',
      'NREP',
      'NLP',
      'CLP',
      'OBS',
      'ORDEM_SORTEIO',
    ];
    try {
      const validate: any = await validateHeaders(spreadSheet, headers);
      if (validate.length > 0) {
        await logImportController.update({
          id: idLog, status: 1, state: 'INVALIDA', updated_at: new Date(Date.now()), invalid_data: validate,
        });
        return {status: 400, message: validate};
      }

      if ((spreadSheet.length > Number(process.env.MAX_DIRECT_UPLOAD_ALLOWED))
        && !queueProcessing) {
        experimentQueue.add({
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

      // array de culturas para evitar fazer varias requisições
      const cultures: Array<culture> = [];
      // array de safras para evitar fazer varias requisições
      const safras: Array<safra> = [];
      // array de locais para evitar fazer varias requisições
      const locals: Array<local> = [];

      for (const row in spreadSheet) {

        let linhaStr = String(Number(row) + 1);

        if (row !== '0') { // LINHA COM TITULO DAS COLUNAS

          // armazena qual linha e coluna está com erro
          let dataIfErrorPerRow: Array<{
            column: number;
            row: number;
          }> = [];

          // ENSAIO / GLI
          let assayList: any = {};
          if (spreadSheet[row][4] === null) { // GLI
            dataIfErrorPerRow.push({column: 4, row: Number(row)});
            responseIfError[Number(3)]
              += responseNullFactory(
              Number(3 + 1),
              linhaStr,
              spreadSheet[0][4]
            );
          } else {
            const {response} = await assayListController.getAll({
              gli: spreadSheet[row][4],
              id_safra: idSafra,
              importValidate: true,
            });

            assayList = response.length > 0 ? response[0] : [];
          }

          // ERRO: Não foi encontrado o GLI + SAFRA na lista de ensaios;
          // A 4º coluna da 5º linha está incorreta, Não foi encontrado o GLI informado na lista de ensaios;

          // CULTURA
          let columnCultura: string = '0';
          if (columnCultura === '0') { // CULTURA
            if (spreadSheet[row][columnCultura] === null) {
              dataIfErrorPerRow.push({column: Number(columnCultura), row: Number(row)});
              responseIfError[Number(columnCultura)]
                += responseNullFactory(
                (Number(columnCultura) + 1),
                linhaStr,
                spreadSheet[0][columnCultura]
              );
            }

            let responseCulture: any = null;

            // se a cultura não estiver no array de culturas, faz a requisição
            if (!cultures.find((culture) => culture.id === idCulture)) {
              const {
                response: responseCultureX,
              }: any = await culturaController.getOneCulture(Number(idCulture));
              responseCulture = responseCultureX;
              cultures.push(responseCulture);
            } else {
              // find culture bu idCulture
              responseCulture = cultures.find((culture) => culture.id === idCulture);
            }
            if (
              responseCulture?.name?.toUpperCase() !== spreadSheet[row][columnCultura]?.toUpperCase()
            ) {
              dataIfErrorPerRow.push({column: Number(columnCultura), row: Number(row)});
              responseIfError[Number(columnCultura)] += responseGenericFactory(
                Number(columnCultura) + 1,
                linhaStr,
                spreadSheet[0][columnCultura],
                'a cultura e diferente da selecionada',
              );
            }
          }

          // SAFRA
          let columnSafra: string = '1';
          if (columnSafra === '1') { // SAFRA
            if (spreadSheet[row][columnSafra] === null) {
              dataIfErrorPerRow.push({column: Number(columnSafra), row: Number(row)});
              responseIfError[Number(columnSafra)]
                += responseNullFactory(
                (Number(columnSafra) + 1),
                linhaStr,
                spreadSheet[0][columnSafra]
              );
            } else {
              let statusSafra: number = 0;
              let responseSafra: any = null;

              // se a safra não estiver no array de culturas, faz a requisição
              if (!safras.find((safra) => safra.id === idSafra)) {
                const {status: statusX, response: responseX}: IReturnObject = await safraController.getOne(idSafra);

                statusSafra = statusX;
                responseSafra = responseX;

                safras.push(responseSafra);
              } else {
                statusSafra = 200;
                // find safra bu idSafra
                responseSafra = safras.find((safra) => safra.id === idSafra);
              }

              if (statusSafra === 200) {
                if (responseSafra?.safraName?.toUpperCase() !== spreadSheet[row][columnSafra]?.toUpperCase()) {
                  dataIfErrorPerRow.push({column: Number(columnSafra), row: Number(row)});
                  responseIfError[Number(columnSafra)]
                    += responseGenericFactory(
                    (Number(columnSafra) + 1),
                    linhaStr,
                    spreadSheet[0][columnSafra],
                    'safra informada e diferente da selecionada',
                  );
                }
              }
              if (idSafra !== assayList?.id_safra) {
                dataIfErrorPerRow.push({column: Number(columnSafra), row: Number(row)});
                responseIfError[Number(columnSafra)]
                  += responseDiffFactory(
                  (Number(columnSafra) + 1),
                  linhaStr,
                  spreadSheet[0][columnSafra]
                );
              }
            }
          }


          // ENSAIO
          let columnEnsaio: string = '2';
          if (columnEnsaio === '2') {
            if (spreadSheet[row][columnEnsaio] === null) {
              dataIfErrorPerRow.push({column: Number(columnEnsaio), row: Number(row)});
              responseIfError[Number(columnEnsaio)] += responseNullFactory(
                (Number(columnEnsaio) + 1),
                linhaStr,
                spreadSheet[0][columnEnsaio]
              );
            } else {
              if (assayList?.type_assay?.name) {
                assayList.type_assay.name = this.replaceSpecialChars(assayList?.type_assay?.name);
              }
              spreadSheet[row][columnEnsaio] = this.replaceSpecialChars(spreadSheet[row][columnEnsaio]);
              if (assayList?.type_assay?.name?.toUpperCase() !== spreadSheet[row][columnEnsaio]?.toUpperCase()) {
                dataIfErrorPerRow.push({column: Number(columnEnsaio), row: Number(row)});
                responseIfError[Number(columnEnsaio)] += responseDiffFactory(
                  (Number(columnEnsaio) + 1),
                  linhaStr,
                  spreadSheet[0][columnEnsaio]);
              }
            }
          }


          // FOCO
          let columnFoco: string = '3';
          if (columnFoco === '3') {
            if (spreadSheet[row][columnFoco] === null) {
              dataIfErrorPerRow.push({column: Number(columnFoco), row: Number(row)});
              responseIfError[Number(columnFoco)]
                += responseNullFactory(
                (Number(columnFoco) + 1),
                linhaStr,
                spreadSheet[0][columnFoco]);
            } else {
              if (assayList?.foco?.name) {
                assayList.foco.name = this.replaceSpecialChars(assayList?.foco?.name);
              }
              spreadSheet[row][columnFoco] = this.replaceSpecialChars(spreadSheet[row][columnFoco]);
              if (assayList?.foco?.name?.toUpperCase()
                !== spreadSheet[row][columnFoco]?.toUpperCase()
              ) {
                dataIfErrorPerRow.push({column: Number(columnFoco), row: Number(row)});
                responseIfError[Number(columnFoco)]
                  += responseDiffFactory(
                  (Number(columnFoco) + 1),
                  linhaStr,
                  spreadSheet[0][columnFoco]);
              }
            }
          }


          // GGEN // TECNOLOGIA
          let columnTecnologia: string = '5';
          if (columnTecnologia === '5') { // GGEN // TECNOLOGIA
            if (spreadSheet[row][columnTecnologia] === null) {
              dataIfErrorPerRow.push({column: Number(columnTecnologia), row: Number(row)});
              responseIfError[Number(columnTecnologia)]
                += responseNullFactory(
                (Number(columnTecnologia) + 1),
                linhaStr,
                spreadSheet[0][columnTecnologia]
              );
            } else if ((spreadSheet[row][columnTecnologia]).toString().length > 2) {
              dataIfErrorPerRow.push({column: Number(columnTecnologia), row: Number(row)});
              responseIfError[Number(columnTecnologia)]
                += responseGenericFactory(
                (Number(columnTecnologia) + 1),
                linhaStr,
                spreadSheet[0][columnTecnologia],
                'o limite de caracteres e 2',
              );
            } else {
              if (spreadSheet[row][columnTecnologia].toString().length < 2) {
                // eslint-disable-next-line no-param-reassign
                spreadSheet[row][columnTecnologia] = `0${spreadSheet[row][columnTecnologia].toString()}`;
              }
              if (assayList?.tecnologia?.cod_tec?.toUpperCase()
                !== (spreadSheet[row][columnTecnologia]?.toString()?.toUpperCase())) {
                dataIfErrorPerRow.push({column: Number(columnTecnologia), row: Number(row)});
                responseIfError[Number(columnTecnologia)]
                  += responseDiffFactory(
                  (Number(columnTecnologia) + 1),
                  linhaStr,
                  spreadSheet[0][columnTecnologia]);
              }
            }
          }


          // GGM // BGM
          let columnBGM: string = '6';
          if (columnBGM === '6') { // GGM // BGM
            if (spreadSheet[row][columnBGM] !== null) {
              if (isNaN(spreadSheet[row][columnBGM])) {
                dataIfErrorPerRow.push({column: Number(columnBGM), row: Number(row)});
                responseIfError[Number(columnBGM)]
                  += responsePositiveNumericFactory(
                  Number(columnBGM) + 1,
                  linhaStr,
                  spreadSheet[0][columnBGM]);
              } else if (Number(assayList?.bgm) !== Number(spreadSheet[row][columnBGM])) {
                dataIfErrorPerRow.push({column: Number(columnBGM), row: Number(row)});
                responseIfError[Number(columnBGM)]
                  += responseDiffFactory(
                  (Number(columnBGM) + 1),
                  linhaStr,
                  spreadSheet[0][columnBGM]
                );
              }
            }
          }


          // LOCAL
          let columnLocal: string = '7';
          if (columnLocal === '7') { // LOCAL
            if (spreadSheet[row][columnLocal] === null) {
              dataIfErrorPerRow.push({column: Number(columnLocal), row: Number(row)});
              responseIfError[Number(columnLocal)]
                += responseNullFactory(
                (Number(columnLocal) + 1),
                linhaStr,
                spreadSheet[0][columnLocal]);
            } else {
              // locals

              let responseLocal = null;

              // se o lcal não estiver no array de locais, faz a requisição
              if (!locals.find((local) => local.name_local_culture === spreadSheet[row][columnLocal])) {
                const {response: responseLocalx} = await localController.getAll({
                  name_local_culture: spreadSheet[row][columnLocal],
                  importValidate: true,
                });

                responseLocal = responseLocalx;

                locals.push(responseLocalx);
              } else {
                // find local by name
                responseLocal = locals.find((local) => local.name_local_culture === spreadSheet[row][columnLocal]);
              }

              if (responseLocal.total === 0) {
                dataIfErrorPerRow.push({column: Number(columnLocal), row: Number(row)});
                responseIfError[Number(columnLocal)]
                  += responseDoesNotExist(
                  (Number(columnLocal) + 1),
                  linhaStr,
                  spreadSheet[0][columnLocal]);
              }

              let responseSafra: any = null;

              // se a safra não estiver no array de safras, faz a requisição
              if (!safras.find((safra) => safra.id === idSafra)) {
                const {response: responseSafrax} = await safraController.getOne(idSafra);
                responseSafra = responseSafrax;
                safras.push(responseSafra);
              } else {
                // find safra by id
                responseSafra = safras.find((safra) => safra.id === idSafra);
              }

              // const {response: responseSafra,}: IReturnObject = await safraController.getOne(idSafra);

              const cultureUnityValidate = responseLocal[0]?.cultureUnity.map((item: any) => {
                if (item?.year === responseSafra?.year) return true;
                return false;
              });

              if (!cultureUnityValidate?.includes(true)) {
                dataIfErrorPerRow.push({column: Number(columnLocal), row: Number(row)});
                responseIfError[Number(columnLocal)]
                  += responseGenericFactory(
                  (Number(columnLocal) + 1),
                  linhaStr,
                  spreadSheet[0][columnLocal],
                  'não tem unidade de cultura cadastrada no local informado',
                );
              }
            }
          }


          // EPOCA
          let columnEpoca: string = '9';
          if (columnEpoca === '9') { // EPOCA
            // verifica se a epoca é nula
            if (spreadSheet[row][columnEpoca] === null) {
              dataIfErrorPerRow.push({column: Number(columnEpoca), row: Number(row)});
              responseIfError[Number(columnEpoca)]
                += responseNullFactory(
                (Number(columnEpoca) + 1),
                linhaStr,
                spreadSheet[0][columnEpoca]
              );
            } else if ((spreadSheet[row][columnEpoca]).toString().length > 2 || !validateInteger(spreadSheet[row][columnEpoca])) {
              dataIfErrorPerRow.push({column: Number(columnEpoca), row: Number(row)});
              responseIfError[Number(columnEpoca)]
                += responseGenericFactory(
                (Number(columnEpoca) + 1),
                linhaStr,
                spreadSheet[0][columnEpoca],
                'precisa ser um numero inteiro e positivo e de ate 2 dígitos',
              );
            }
          }


          if (dataIfErrorPerRow.length > 0) {
            continue;
          }

          let experimentName;
          // se o experimento tiver menos que 2 digitos, adiciona um 0 na frente
          // ATENÇÃO O EP PODE VIR NO FORMATO NUMBER OU STRING INCLUSIVE NULO
          if ((typeof spreadSheet[row][9] !== 'number' && typeof spreadSheet[row][9] !== 'string') || spreadSheet[row][9] === null) {
            experimentName = `${spreadSheet[row][1]}_${spreadSheet[row][4]}_${spreadSheet[row][7]}_00`;
          } else if (String(spreadSheet[row][9]).toString().length < 2) {
            experimentName = `${spreadSheet[row][1]}_${spreadSheet[row][4]}_${spreadSheet[row][7]}_0${spreadSheet[row][9]}`;
          } else {
            experimentName = `${spreadSheet[row][1]}_${spreadSheet[row][4]}_${spreadSheet[row][7]}_${spreadSheet[row][9]}`;
          }

          const {response: experiment} = await experimentController.getAll({
            filterExperimentName: experimentName,
            idSafra,
            importValidate: true,
          });

          if (experiment?.length > 0) {
            if (experiment[0].status?.toUpperCase() !== 'IMPORTADO') {
              // Atenção responseIfError[0] onde 0 é a ordem em que a mensagem irá aparecer;
              responseIfError[0]
                += `<li style="text-align:left"> Erro na linha ${Number(row) + 1}. Já existe um experimento cadastrado e utilizado com este nome de experimento </li> <br>`;
            }
          }

          if (experimentNameTemp.includes(experimentName)) {
            experimentNameTemp[row] = experimentName;
            responseIfError[0]
              += `<li style="text-align:left"> Erro na linha ${Number(row) + 1}. Experimentos duplicados na tabela </li> <br>`;
          }

          experimentNameTemp[row] = experimentName;

          for (const column in spreadSheet[row]) {

            // DENSIDADE
            if (column === '8') { // DENSIDADE
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]);
              } else if ((spreadSheet[row][column]).toString().length > 2
                || !validateInteger(spreadSheet[row][column])) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column],
                  'precisa ser um numero inteiro e positivo e de ate 2 dígitos',
                );
              }
            }

            // DELINEAMENTO
            if (column === '10') { // DELINEAMENTO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              } else {
                const {response} = await delineamentoController.getAll({
                  id_culture: idCulture,
                  name: spreadSheet[row][column],
                  filterStatus: 1,
                  importValidate: true,
                });

                if (response?.length === 0) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                    (Number(column) + 1),
                    linhaStr,
                    spreadSheet[0][column],
                    'não existe ou esta inativo',
                  );
                } else if (response[0]?.repeticao < spreadSheet[row][11]) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                    (Number(column) + 1),
                    linhaStr,
                    spreadSheet[0][column],
                    'Número de repetições e maior que o do delineamento informado',
                  );
                } else if (response[0]?.trat_repeticao < assayList?.countNT) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                    (Number(column) + 1),
                    linhaStr,
                    spreadSheet[0][column],
                    'Número de tratamentos e maior que o do delineamento informado',
                  );
                }
              }
            }


            // NREP
            if (column === '11') { // NREP
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              } else if (!validateInteger(spreadSheet[row][column])) {
                responseIfError[Number(column)] += responseGenericFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column],
                  'precisa ser um numero inteiro e positivo',
                );
              }
            }


            // NPL
            if (column === '12') { // NPL
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              } else if (!validateInteger(spreadSheet[row][column])) {
                responseIfError[Number(column)] += responseGenericFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column],
                  'precisa ser um numero inteiro e positivo',
                );
              }
            }

            // CLP
            if (column === '13') { // CLP
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              }
              if ((typeof spreadSheet[row][column]) !== 'number' || spreadSheet[row][column] < 0) {
                responseIfError[Number(column)] += responseGenericFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column],
                  'precisa ser um numero inteiro e positivo e casas decimais precisam ser com virgula',
                );
              }
            }

            // ORDEM SORTEIO
            if (column === '15') { // ORDEM SORTEIO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              } else if (!validateInteger(spreadSheet[row][column])) {
                responseIfError[Number(column)] += responseGenericFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column],
                  'precisa ser um numero inteiro e positivo',
                );
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
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      await logImportController.update({
        id: idLog, status: 1, state: 'INVALIDA', updated_at: new Date(Date.now()), invalid_data: responseStringError,
      });
      return {status: 400, message: responseStringError};
    } catch (error: any) {
      await logImportController.update({
        id: idLog, status: 1, state: 'FALHA', updated_at: new Date(Date.now()),
      });
      handleError('Experimento controller', 'Validate Import', error.message);
      return {status: 500, message: 'Erro ao validar planilha de experimento'};
    }
  }

  static async storeRecords(idLog: number, {
    spreadSheet, idSafra, idCulture, created_by: createdBy,
  }: ImportValidate) {
    const localController = new LocalController();
    const assayListController = new AssayListController();
    const logImportController = new LogImportController();
    const experimentController = new ExperimentController();
    const delineamentoController = new DelineamentoController();

    // array de culturas para evitar fazer varias requisições
    const cultures: Array<culture> = [];
    // array de safras para evitar fazer varias requisições
    const safras: Array<safra> = [];
    // array de locais para evitar fazer varias requisições
    const locals: Array<local> = [];
    // array de delineamentos para evitar fazer varias requisições
    const delineamentos: Array<delineamento> = [];
    // array de listas de ensaios para evitar fazer varias requisições
    const assayLists: Array<assay_list> = [];
    // array de experimentos para evitar fazer varias requisições
    const experiments: Array<experiment> = [];

    const otimizar = true;

    let linha = 1;

    try {
      for (const row in spreadSheet) {
        if (row !== '0') {
          let local = null;
          let assayList = null;
          let delineamento = null;

          console.log('processando planilha de experimento: linha:', linha);

          if (otimizar) {
            if (!locals.find((local) => local.name_local_culture === spreadSheet[row][7])) {
              const {response: localX} = await localController.getAll({
                name_local_culture: spreadSheet[row][7],
                importValidate: true,
              });
              local = localX;
              locals.push(local);
            } else {
              local = locals.find((local) => local.name_local_culture === spreadSheet[row][7]);
            }

            if (!assayLists.find((assayList) => assayList.gli === spreadSheet[row][4] && assayList.id_safra === idSafra)) {
              const {response: assayListX} = await assayListController.getAll({
                gli: spreadSheet[row][4],
                id_safra: idSafra,
                importValidate: true,
              });
              assayList = assayListX;
              assayLists.push(assayList);
            } else {
              assayList = assayLists.find((assayList) => assayList.gli === spreadSheet[row][4] && assayList.id_safra === idSafra);
            }

            if (!delineamentos.find((delineamento) => delineamento.id_culture === idCulture && delineamento.name === spreadSheet[row][10])) {
              const {response: delineamentox} = await delineamentoController.getAll({
                id_culture: idCulture,
                name: spreadSheet[row][10],
                filterStatus: 1,
                importValidate: true,
              });
              delineamento = delineamentox;
              delineamentos.push(delineamento);
            } else {
              delineamento = delineamentos.find((delineamento) => delineamento.id_culture === idCulture && delineamento.name === spreadSheet[row][10]);
            }
          } else {
            const {response: localx} = await localController.getAll({
              name_local_culture: spreadSheet[row][7],
              importValidate: true,
            });

            local = localx;

            const {response: assayListx} = await assayListController.getAll({
              gli: spreadSheet[row][4],
              id_safra: idSafra,
              importValidate: true,
            });

            assayList = assayListx;

            const {response: delineamentox} = await delineamentoController.getAll({
              id_culture: idCulture,
              name: spreadSheet[row][10],
              filterStatus: 1,
              importValidate: true,
            });

            delineamento = delineamentox;
          }

          const comments = spreadSheet[row][14]?.substr(0, 255) ? spreadSheet[row][14]?.substr(0, 255) : '';
          let experimentName;
          if (spreadSheet[row][9].toString().length < 2) {
            experimentName = `${spreadSheet[row][1]}_${spreadSheet[row][4]}_${spreadSheet[row][7]}_0${spreadSheet[row][9]}`;
          } else {
            experimentName = `${spreadSheet[row][1]}_${spreadSheet[row][4]}_${spreadSheet[row][7]}_${spreadSheet[row][9]}`;
          }

          const {response: experiment} = await experimentController.getAll({
            filterExperimentName: experimentName,
            idSafra,
            importValidate: true,
          });
          if (experiment.total > 0) {
            await experimentController.update(
              {
                id: experiment[0]?.id,
                idAssayList: assayList[0]?.id,
                idLocal: local[0]?.id,
                idDelineamento: delineamento[0]?.id,
                idSafra,
                experimentName,
                density: spreadSheet[row][8],
                period: spreadSheet[row][9],
                repetitionsNumber: spreadSheet[row][11],
                nlp: spreadSheet[row][12],
                clp: spreadSheet[row][13],
                comments,
                orderDraw: spreadSheet[row][15],
                created_by: createdBy,
                import: true,
              },
            );
          } else {
            const {status}: IReturnObject = await experimentController.create(
              {
                idAssayList: assayList[0]?.id,
                idLocal: local[0]?.id,
                idDelineamento: delineamento[0]?.id,
                idSafra,
                experimentName,
                density: spreadSheet[row][8],
                period: spreadSheet[row][9],
                repetitionsNumber: spreadSheet[row][11],
                nlp: spreadSheet[row][12],
                clp: spreadSheet[row][13],
                comments,
                orderDraw: spreadSheet[row][15],
                created_by: createdBy,
              },
            );
            if (status === 200) {
              await assayListController.update({
                id: assayList[0]?.id,
                status: 'EXP IMP.',
              });
            }
          }

          linha++;
        }
      }
      await logImportController.update({
        id: idLog, status: 1, state: 'SUCESSO', updated_at: new Date(Date.now()),
      });
      return {status: 200, message: 'Experimento importado com sucesso'};
    } catch (error: any) {
      await logImportController.update({
        id: idLog, status: 1, state: 'FALHA', updated_at: new Date(Date.now()),
      });
      handleError('Experimento controller', 'Save Import', error.message);
      return {status: 500, message: 'Erro ao salvar planilha de experimento'};
    }
  }

  static replaceSpecialChars(str: String) {
    console.log('🚀 ~ file: import-experiment.controller.ts:667 ~ ImportExperimentController ~ replaceSpecialChars ~ str:', str);
    return str?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '');
  }
}
