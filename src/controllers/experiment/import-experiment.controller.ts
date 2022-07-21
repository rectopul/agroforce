/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import handleError from '../../shared/utils/handleError';
import {
  responseDiffFactory,
  responseNullFactory,
  responseGenericFactory,
  responsePositiveNumericFactory,
  responseDoesNotExist,
} from '../../shared/utils/responseErrorFactory';
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import { SafraController } from '../safra.controller';
import { LocalController } from '../local.controller';
import { DelineamentoController } from '../delineamento.controller';
import { AssayListController } from '../assay-list.controller';
import { ExperimentController } from './experiment.controller';
import { LogImportController } from '../log-import.controller';

export class ImportExperimentController {
  static async validate({
    idLog, spreadSheet, idSafra, idCulture, created_by,
  }: ImportValidate): Promise<IReturnObject> {
    const safraController = new SafraController();
    const localController = new LocalController();
    const delineamentoController = new DelineamentoController();
    const assayListController = new AssayListController();
    const experimentController = new ExperimentController();
    const logImportController = new LogImportController();

    const experimentNameTemp: Array<string> = [];
    const responseIfError: Array<string> = [];
    try {
      for (const row in spreadSheet) {
        if (row !== '0') { // LINHA COM TITULO DAS COLUNAS
          const experimentName = `${spreadSheet[row][0]}_${spreadSheet[row][3]}_${spreadSheet[row][6]}_${spreadSheet[row][8]}`;
          const { response: experiment } = await experimentController.getAll({
            experimentName,
          });
          if (experiment?.length > 0) {
            await logImportController.update({ id: idLog, status: 1 });
            return { status: 200, message: `Erro na linha ${Number(row) + 1}. Experimento já cadastrado no sistema` };
          } if (experimentNameTemp.includes(experimentName)) {
            experimentNameTemp[row] = experimentName;
            await logImportController.update({ id: idLog, status: 1 });
            return { status: 200, message: `Erro na linha ${Number(row) + 1}. Experimentos duplicados na tabela` };
          }
          experimentNameTemp[row] = experimentName;
          let assayList: any = {};
          if (spreadSheet[row][3] === null) { // GLI
            responseIfError[Number(3)]
              += responseNullFactory(Number(3 + 1), row, spreadSheet[0][3]);
          } else {
            const { response } = await assayListController.getAll({
              gli: spreadSheet[row][3],
            });
            assayList = response.length > 0 ? response[0] : [];
          }
          for (const column in spreadSheet[row]) {
            if (column === '0') { // SAFRA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (idSafra !== assayList?.id_safra) {
                responseIfError[Number(column)]
                  += responseDiffFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '1') { // ENSAIO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (assayList?.type_assay?.name !== spreadSheet[row][column]) {
                responseIfError[Number(column)]
                  += responseDiffFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '2') { // FOCO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (assayList?.foco?.name !== spreadSheet[row][column]) {
                responseIfError[Number(column)]
                  += responseDiffFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '4') { // GGEN // TECNOLOGIA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (assayList?.tecnologia?.name !== (spreadSheet[row][column].toString())) {
                responseIfError[Number(column)]
                  += responseDiffFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '5') { // GGM // BGM
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (assayList?.bgm !== spreadSheet[row][column]) {
                responseIfError[Number(column)]
                  += responseDiffFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '6') { // LOCAL
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { response } = await localController.getAll({
                  name_local_culture: spreadSheet[row][column],
                });
                if (response?.length === 0) {
                  responseIfError[Number(column)]
                    += responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                }
                const { response: responseSafra } = await safraController.getAllSafra({
                  safraName: spreadSheet[row][0],
                });
                const cultureUnityValidate = response[0]?.cultureUnity.map((item: any) => {
                  if (item.year === responseSafra[0].year) return true;
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
            if (column === '7') { // DENSIDADE
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if ((spreadSheet[row][column]).toString().length > 2
                || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === '8') { // EPOCA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if ((spreadSheet[row][column]).toString().length > 2
                || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === '9') { // DELINEAMENTO
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
                } else if (response?.repeticao >= spreadSheet[row][10]) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'Número de repetições e maior que o do delineamento informado',
                    );
                } else if (response?.trat_repeticao >= assayList?.genotype_treatment) {
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
            if (column === '10') { // NREP
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] < 0 || (typeof spreadSheet[row][column]) !== 'number') {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === '11') { // NPL
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] < 0 || (typeof spreadSheet[row][column]) !== 'number') {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === '12') { // CLP
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] < 0 || (typeof spreadSheet[row][column]) !== 'number') {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === '13') { // EEL
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] < 0 || (typeof spreadSheet[row][column]) !== 'number') {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === '15') { // ORDEM SORTEIO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] < 0 || (typeof spreadSheet[row][column]) !== 'number') {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
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
                name_local_culture: spreadSheet[row][6],
              });
              const { response: assayList } = await assayListController.getAll({
                gli: spreadSheet[row][3],
              });
              const { response: delineamento } = await delineamentoController.getAll({
                id_culture: idCulture, name: spreadSheet[row][9],
              });
              const comments = spreadSheet[row][14].substr(0, 255) ? spreadSheet[row][14].substr(0, 255) : '';
              const experimentName = `${spreadSheet[row][0]}_${spreadSheet[row][3]}_${spreadSheet[row][6]}_${spreadSheet[row][8]}`;
              await experimentController.create(
                {
                  idAssayList: assayList[0]?.id,
                  idLocal: local[0]?.id,
                  idDelineamento: delineamento[0]?.id,
                  idSafra,
                  experimentName,
                  density: spreadSheet[row][7],
                  period: spreadSheet[row][8],
                  repetitionsNumber: spreadSheet[row][10],
                  nlp: spreadSheet[row][11],
                  clp: spreadSheet[row][12],
                  eel: spreadSheet[row][13],
                  comments,
                  orderDraw: spreadSheet[row][15],
                  created_by,
                },
              );
            }
          }
          await logImportController.update({ id: idLog, status: 1 });
          return { status: 200, message: 'Experimento importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({ id: idLog, status: 1 });
          handleError('Experimento controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de experimento' };
        }
      }

      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      await logImportController.update({ id: idLog, status: 1 });
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1 });
      handleError('Experimento controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de experimento' };
    }
  }
}
