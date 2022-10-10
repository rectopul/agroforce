/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import handleError from '../../shared/utils/handleError';
import {
  responseDiffFactory,
  responseNullFactory,
  responseGenericFactory,
  responseDoesNotExist,
} from '../../shared/utils/responseErrorFactory';
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import { SafraController } from '../safra.controller';
import { LocalController } from '../local/local.controller';
import { DelineamentoController } from '../delimitation/delineamento.controller';
import { AssayListController } from '../assay-list/assay-list.controller';
import { ExperimentController } from './experiment.controller';
import { LogImportController } from '../log-import.controller';
import { validateInteger } from '../../shared/utils/numberValidate';
import { CulturaController } from '../cultura.controller';

export class ImportExperimentController {
  static async validate(
    idLog: number,
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
    try {
      for (const row in spreadSheet) {
        if (row !== '0') { // LINHA COM TITULO DAS COLUNAS
          let experimentName;
          if (spreadSheet[row][9].toString().length < 2) {
            experimentName = `${spreadSheet[row][1]}_${spreadSheet[row][4]}_${spreadSheet[row][7]}_0${spreadSheet[row][9]}`;
          } else {
            experimentName = `${spreadSheet[row][1]}_${spreadSheet[row][4]}_${spreadSheet[row][7]}_${spreadSheet[row][9]}`;
          }
          const { response: experiment } = await experimentController.getAll({
            filterExperimentName: experimentName,
            idSafra,
          });
          if (experiment?.length > 0) {
            if (experiment[0].status !== 'IMPORTADO') {
              await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
              return { status: 200, message: `Erro na linha ${Number(row) + 1}. Experimento já cadastrado e utilizado no sistema` };
            }
          }
          if (experimentNameTemp.includes(experimentName)) {
            await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
            experimentNameTemp[row] = experimentName;
            return { status: 200, message: `Erro na linha ${Number(row) + 1}. Experimentos duplicados na tabela` };
          }
          experimentNameTemp[row] = experimentName;
          let assayList: any = {};
          if (spreadSheet[row][4] === null) { // GLI
            responseIfError[Number(3)]
              += responseNullFactory(Number(3 + 1), row, spreadSheet[0][4]);
          } else {
            const { response } = await assayListController.getAll({
              gli: spreadSheet[row][4],
              id_safra: idSafra,
            });
            assayList = response.length > 0 ? response[0] : [];
          }
          for (const column in spreadSheet[row]) {
            if (column === '0') { // CULTURA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              const {
                response,
              }: any = await culturaController.getOneCulture(Number(idCulture));
              if (response?.name !== spreadSheet[row][column]) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'a cultura e diferente da selecionada',
                );
              }
            }
            if (column === '1') { // SAFRA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status, response }: IReturnObject = await safraController.getOne(idSafra);

                if (status === 200) {
                  if (response?.safraName !== spreadSheet[row][column]) {
                    responseIfError[Number(column)]
                    += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'safra informada e diferente da selecionada',
                      );
                  }
                }
                if (idSafra !== assayList?.id_safra) {
                  responseIfError[Number(column)]
                    += responseDiffFactory((Number(column) + 1), row, spreadSheet[0][column]);
                }
              }
            }
            if (column === '2') { // ENSAIO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (assayList?.type_assay?.name !== spreadSheet[row][column]) {
                responseIfError[Number(column)]
                  += responseDiffFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '3') { // FOCO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (assayList?.foco?.name !== spreadSheet[row][column]) {
                responseIfError[Number(column)]
                  += responseDiffFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '5') { // GGEN // TECNOLOGIA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if ((typeof (spreadSheet[row][column])) === 'number' && spreadSheet[row][column].toString().length < 2) {
                // eslint-disable-next-line no-param-reassign
                spreadSheet[row][column] = `0${spreadSheet[row][column].toString()}`;
              }
              if (assayList?.tecnologia?.cod_tec !== (spreadSheet[row][column].toString())) {
                responseIfError[Number(column)]
                  += responseDiffFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '6') { // GGM // BGM
              if (spreadSheet[row][column] !== null) {
                if (!validateInteger(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'precisa ser um numero inteiro e positivo',
                  );
                }
              }
            }
            if (column === '7') { // LOCAL
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { response } = await localController.getAll({
                  name_local_culture: spreadSheet[row][column],
                  id_safra: idSafra,
                });
                if (response?.length === 0) {
                  responseIfError[Number(column)]
                    += responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                }
                const {
                  response: responseSafra,
                }: IReturnObject = await safraController.getOne(idSafra);
                const cultureUnityValidate = response[0]?.cultureUnity.map((item: any) => {
                  if (item?.year === responseSafra?.year) return true;
                  return false;
                });
                if (!cultureUnityValidate?.includes(true)) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'não tem unidade de cultura cadastrada no local informado',
                    );
                }
              }
            }
            if (column === '8') { // DENSIDADE
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if ((spreadSheet[row][column]).toString().length > 2
                || !validateInteger(spreadSheet[row][column])) {
                responseIfError[Number(column)]
                        += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'precisa ser um numero inteiro e positivo e de ate 2 dígitos',
                  );
              }
            }
            if (column === '9') { // EPOCA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if ((spreadSheet[row][column]).toString().length > 2
                || !validateInteger(spreadSheet[row][column])) {
                responseIfError[Number(column)]
                        += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'precisa ser um numero inteiro e positivo e de ate 2 dígitos',
                  );
              }
            }
            if (column === '10') { // DELINEAMENTO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { response } = await delineamentoController.getAll({
                  id_culture: idCulture, name: spreadSheet[row][column],
                });

                if (response?.length === 0) {
                  responseIfError[Number(column)]
                    += responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                } else if (response[0]?.repeticao < spreadSheet[row][11]) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'Número de repetições e maior que o do delineamento informado',
                    );
                } else if (response[0]?.trat_repeticao < assayList?.countNT) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'Número de tratamentos e maior que o do delineamento informado',
                    );
                }
              }
            }
            if (column === '11') { // NREP
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (!validateInteger(spreadSheet[row][column])) {
                responseIfError[Number(column)] += responseGenericFactory(
                  (Number(column) + 1),
                  row,
                  spreadSheet[0][column],
                  'precisa ser um numero inteiro e positivo',
                );
              }
            }
            if (column === '12') { // NPL
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (!validateInteger(spreadSheet[row][column])) {
                responseIfError[Number(column)] += responseGenericFactory(
                  (Number(column) + 1),
                  row,
                  spreadSheet[0][column],
                  'precisa ser um numero inteiro e positivo',
                );
              }
            }
            if (column === '13') { // CLP
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              if ((typeof spreadSheet[row][column]) !== 'number' || spreadSheet[row][column] < 0) {
                responseIfError[Number(column)] += responseGenericFactory(
                  (Number(column) + 1),
                  row,
                  spreadSheet[0][column],
                  'precisa ser um numero inteiro e positivo e casas decimais precisam ser com virgula',
                );
              }
            }
            if (column === '15') { // ORDEM SORTEIO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (!validateInteger(spreadSheet[row][column])) {
                responseIfError[Number(column)] += responseGenericFactory(
                  (Number(column) + 1),
                  row,
                  spreadSheet[0][column],
                  'precisa ser um numero inteiro e positivo',
                );
              }
            }
          }
        }
      }
      if (responseIfError.length === 0) {
        try {
          for (const row in spreadSheet) {
            if (row !== '0') {
              const { response: local } = await localController.getAll({
                name_local_culture: spreadSheet[row][7],
              });
              const { response: assayList } = await assayListController.getAll({
                gli: spreadSheet[row][4],
                id_safra: idSafra,
              });
              const { response: delineamento } = await delineamentoController.getAll({
                id_culture: idCulture, name: spreadSheet[row][10],
              });
              const comments = spreadSheet[row][14]?.substr(0, 255) ? spreadSheet[row][14]?.substr(0, 255) : '';
              let experimentName;
              if (spreadSheet[row][9].toString().length < 2) {
                experimentName = `${spreadSheet[row][1]}_${spreadSheet[row][4]}_${spreadSheet[row][7]}_0${spreadSheet[row][9]}`;
              } else {
                experimentName = `${spreadSheet[row][1]}_${spreadSheet[row][4]}_${spreadSheet[row][7]}_${spreadSheet[row][9]}`;
              }
              const { response: experiment } = await experimentController.getAll({
                filterExperimentName: experimentName,
                idSafra,
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
                    bgm: String(spreadSheet[row][6]),
                    comments,
                    orderDraw: spreadSheet[row][15],
                    created_by: createdBy,
                  },
                );
              } else {
                const { status }: IReturnObject = await experimentController.create(
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
                    bgm: String(spreadSheet[row][6]),
                    comments,
                    orderDraw: spreadSheet[row][15],
                    created_by: createdBy,
                  },
                );
                if (status === 200) {
                  await assayListController.update({
                    id: assayList[0]?.id,
                    status: 'UTILIZADO',
                  });
                }
              }
            }
          }
          await logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' });
          return { status: 200, message: 'Experimento importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
          handleError('Experimento controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de experimento' };
        }
      }
      await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('Experimento controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de experimento' };
    }
  }
}
