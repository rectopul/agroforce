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

export class ImportExperimentController {
  static async validate({
    spreadSheet, idSafra, idCulture, created_by: createdBy,
  }: ImportValidate): Promise<IReturnObject> {
    const safraController = new SafraController();
    const localController = new LocalController();
    const delineamentoController = new DelineamentoController();
    const assayListController = new AssayListController();
    const experimentController = new ExperimentController();

    const experimentNameTemp: Array<string> = [];
    const responseIfError: Array<string> = [];
    try {
      // eslint-disable-next-line consistent-return
      spreadSheet.forEach(async (item: any, row: number) => {
        if (row !== 0) { // LINHA COM TITULO DAS COLUNAS
          const experimentName = `${spreadSheet[row][0]}_${spreadSheet[row][3]}_${spreadSheet[row][6]}_${spreadSheet[row][8]}`;
          const { response: experiment }: IReturnObject = await experimentController.getAll({
            experimentName,
          });
          if (experiment?.length > 0) {
            return { status: 200, message: `Erro na linha ${row + 1}. Experimento já cadastrado no sistema` };
          } if (experimentNameTemp.includes(experimentName)) {
            experimentNameTemp[row] = experimentName;
            return { status: 200, message: `Erro na linha ${row + 1}. Experimentos duplicados na tabela` };
          }
          experimentNameTemp[row] = experimentName;
          let assayList: any = {};
          if (spreadSheet[row][3] === null) { // GLI
            responseIfError[3]
              += responseNullFactory(4, (row + 1), spreadSheet[0][3]);
          } else {
            const { response }: IReturnObject = await assayListController.getAll({
              gli: spreadSheet[row][3],
            });
            assayList = response.length > 0 ? response[0] : [];
          }
          item.forEach(async (_: any, column: number) => {
            if (column === 0) { // SAFRA
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if (idSafra !== assayList?.id_safra) {
                responseIfError[column]
                  += responseDiffFactory((column + 1), (row + 1), spreadSheet[0][column]);
              }
            }
            if (column === 1) { // ENSAIO
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if (assayList?.type_assay?.name !== spreadSheet[row][column]) {
                responseIfError[column]
                  += responseDiffFactory((column + 1), (row + 1), spreadSheet[0][column]);
              }
            }
            if (column === 2) { // FOCO
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if (assayList?.foco?.name !== spreadSheet[row][column]) {
                responseIfError[column]
                  += responseDiffFactory((column + 1), (row + 1), spreadSheet[0][column]);
              }
            }
            if (column === 4) { // GGEN // TECNOLOGIA
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if (assayList?.tecnologia?.name !== (spreadSheet[row][column].toString())) {
                responseIfError[column]
                  += responseDiffFactory((column + 1), (row + 1), spreadSheet[0][column]);
              }
            }
            if (column === 5) { // GGM // BGM
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if (assayList?.bgm !== spreadSheet[row][column]) {
                responseIfError[column]
                  += responseDiffFactory((column + 1), (row + 1), spreadSheet[0][column]);
              }
            }
            if (column === 6) { // LOCAL
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else {
                const { response }: IReturnObject = await localController.getAll({
                  name_local_culture: spreadSheet[row][column],
                });
                if (response?.length === 0) {
                  responseIfError[column]
                    += responseDoesNotExist((column + 1), (row + 1), spreadSheet[0][column]);
                }
                const {
                  response: responseSafra,
                }: IReturnObject = await safraController.getAllSafra({
                  safraName: spreadSheet[row][0],
                });
                const cultureUnityValidate = response[0]?.cultureUnity.map((unit: any) => {
                  if (unit.year === responseSafra[0].year) return true;
                  return false;
                });
                if (!cultureUnityValidate?.includes(true)) {
                  responseIfError[column]
                    += responseGenericFactory(
                      (column + 1),
                      (row + 1),
                      spreadSheet[0][column],
                      'não tem unidade de cultura cadastrada no local informado',
                    );
                }
              }
            }
            if (column === 7) { // DENSIDADE
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if ((spreadSheet[row][column]).toString().length > 2
                || Number(spreadSheet[row][column]) < 0) {
                responseIfError[column]
                  += responsePositiveNumericFactory(
                    (column + 1),
                    (row + 1),
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === 8) { // EPOCA
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if ((spreadSheet[row][column]).toString().length > 2
                || Number(spreadSheet[row][column]) < 0) {
                responseIfError[column]
                  += responsePositiveNumericFactory(
                    (column + 1),
                    (row + 1),
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === 9) { // DELINEAMENTO
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else {
                const { response }: IReturnObject = await delineamentoController.getAll({
                  id_culture: idCulture, name: spreadSheet[row][column],
                });
                if (response?.length === 0) {
                  responseIfError[column]
                    += responseDoesNotExist((column + 1), (row + 1), spreadSheet[0][column]);
                } else if (response?.repeticao >= spreadSheet[row][10]) {
                  responseIfError[column]
                    += responseGenericFactory(
                      (column + 1),
                      (row + 1),
                      spreadSheet[0][column],
                      'Número de repetições e maior que o do delineamento informado',
                    );
                } else if (response?.trat_repeticao >= assayList?.genotype_treatment) {
                  responseIfError[column]
                    += responseGenericFactory(
                      (column + 1),
                      (row + 1),
                      spreadSheet[0][column],
                      'Número de tratamentos e maior que o do delineamento informado',
                    );
                }
              }
            }
            if (column === 10) { // NREP
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if (spreadSheet[row][column] < 0 || (typeof spreadSheet[row][column]) !== 'number') {
                responseIfError[column]
                  += responsePositiveNumericFactory(
                    (column + 1),
                    (row + 1),
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === 11) { // NPL
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if (spreadSheet[row][column] < 0 || (typeof spreadSheet[row][column]) !== 'number') {
                responseIfError[column]
                  += responsePositiveNumericFactory(
                    (column + 1),
                    (row + 1),
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === 12) { // CLP
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if (spreadSheet[row][column] < 0 || (typeof spreadSheet[row][column]) !== 'number') {
                responseIfError[column]
                  += responsePositiveNumericFactory(
                    (column + 1),
                    (row + 1),
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === 13) { // EEL
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if (spreadSheet[row][column] < 0 || (typeof spreadSheet[row][column]) !== 'number') {
                responseIfError[column]
                  += responsePositiveNumericFactory(
                    (column + 1),
                    (row + 1),
                    spreadSheet[0][column],
                  );
              }
            }
            if (column === 15) { // ORDEM SORTEIO
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((column + 1), (row + 1), spreadSheet[0][column]);
              } else if (spreadSheet[row][column] < 0 || (typeof spreadSheet[row][column]) !== 'number') {
                responseIfError[column]
                  += responsePositiveNumericFactory(
                    (column + 1),
                    (row + 1),
                    spreadSheet[0][column],
                  );
              }
            }
          });
        }
      });
      if (responseIfError.length === 0) {
        try {
          spreadSheet.forEach(async (item: any, row: number) => {
            if (row !== 0) {
              const { response: local }: IReturnObject = await localController.getAll({
                name_local_culture: spreadSheet[row][6],
              });
              const { response: assayList }: IReturnObject = await assayListController.getAll({
                gli: spreadSheet[row][3],
              });
              const {
                response: delineamento,
              }: IReturnObject = await delineamentoController.getAll({
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
                  createdBy,
                },
              );
            }
          });
          return { status: 200, message: 'Experimento importado com sucesso' };
        } catch (error: any) {
          handleError('Experimento controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de experimento' };
        }
      }

      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      handleError('Experimento controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de experimento' };
    }
  }
}
