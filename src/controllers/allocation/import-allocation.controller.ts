/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import handleError from '../../shared/utils/handleError';
import {
  responseNullFactory,
  responseGenericFactory,
  responsePositiveNumericFactory,
} from '../../shared/utils/responseErrorFactory';
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import { SafraController } from '../safra.controller';
import { LocalController } from '../local/local.controller';
import { ExperimentController } from '../experiment/experiment.controller';
import { LogImportController } from '../log-import.controller';
import { QuadraController } from '../block/quadra.controller';
import { ExperimentGenotipeController } from '../experiment_genotipe.controller';

export class ImportAllocationController {
  static async validate(
    idLog: number,
    {
      spreadSheet, idSafra, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const safraController = new SafraController();
    const localController = new LocalController();
    const logImportController = new LogImportController();
    const experimentController = new ExperimentController();
    const experimentGenotipeController = new ExperimentGenotipeController();
    const quadraController = new QuadraController();

    const responseIfError: Array<string> = [];

    // eslint-disable-next-line no-param-reassign
    spreadSheet = this.orderByBlock(spreadSheet);
    try {
      for (const row in spreadSheet) {
        if (row !== '0') {
          for (const column in spreadSheet[row]) {
            if (spreadSheet[0][column].includes('ID_EXPERIMENTO')) {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[row][column],
                  );
              } else {
                const { status }: IReturnObject = await experimentController.getAll({
                  id: Number(spreadSheet[row][column]),
                  idSafra,
                });
                if (status !== 200) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o id do experimento não encontrado nessa safra',
                    );
                }
              }
            }

            if (spreadSheet[0][column].includes('SAFRA')) {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { response }: IReturnObject = await safraController.getOne(Number(idSafra));
                if (response.safraName !== spreadSheet[row][column]) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'safra e diferente da safra selecionada',
                    );
                }
              }
            }

            if (spreadSheet[0][column].includes('EXPE')) {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status }: IReturnObject = await experimentController.getAll({
                  filterExperimentName: spreadSheet[row][column],
                  idSafra,
                });
                if (status !== 200) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o nome do experimento não cadastrado nessa safra',
                    );
                }
              }
            }

            if (spreadSheet[0][column].includes('NPEI')) {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[row][column],
                  );
              } else {
                // valida npei
              }
            }

            if (spreadSheet[0][column].includes('NPEF')) {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[row][column],
                  );
              } else {
                // valida npef
              }
            }

            if (spreadSheet[0][column].includes('NTPARC')) {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[row][column],
                  );
              } else {
                // eslint-disable-next-line max-len
                const npeDiff = spreadSheet[row][Number(column) - 1] - spreadSheet[row][Number(column) - 2];
                if (npeDiff !== spreadSheet[row][column]) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o numero de parcelas estão fora do alcance de NPE',
                    );
                }
              }
            }

            if (spreadSheet[0][column].includes('LOCPREP')) {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status, response }: IReturnObject = await localController.getAll({
                  name_local_culture: spreadSheet[row][column],
                });
                if (status !== 200) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o local de preparo não cadastrado no sistema',
                    );
                } else {
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
            }

            if (spreadSheet[0][column].includes('QM')) {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status }: IReturnObject = await quadraController.getAll({
                  cod_quadra: spreadSheet[row][column],
                  id_safra: idSafra,
                });
                if (status !== 200) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'quadra não cadastrada nessa safra',
                    );
                }
              }
            }

            if (spreadSheet[0][column].includes('SEQ')) {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[row][column],
                  );
              } else if (spreadSheet[row][7] === spreadSheet[Number(row) - 1][7]) {
                if ((Number(spreadSheet[row][column]) - 1)
                !== spreadSheet[Number(row) - 1][column]) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'a seq deve ser sequencial',
                    );
                }
              } else if (Number(spreadSheet[row][column]) !== 1) {
                responseIfError[Number(column)]
                    += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'a seq precisa começar em 1 por quadra',
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
              const { response: local }: IReturnObject = await localController.getAll({
                name_local_culture: spreadSheet[row][6],
              });
              const { response: quadra }: IReturnObject = await quadraController.getAll({
                id_safra: idSafra, name: spreadSheet[row][7],
              });
              const { response: experiment }: IReturnObject = await experimentController.getAll({
                filterExperimentName: spreadSheet[row][2],
                idSafra,
              });
              const { response: teste }: IReturnObject = await experimentGenotipeController.update({

              });
            }
          }
          await logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' });
          return { status: 200, message: 'Alocação importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
          handleError('Alocação controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de Alocação' };
        }
      }
      await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('Alocação controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de experimento' };
    }
  }

  private static orderByBlock(ordenanteSpreadSheet: any) {
    function orderBlock(item: any, next: any) {
      if (item[7] === next[7]) {
        return 0;
      }

      return (item[7] < next[7]) ? -1 : 1;
    }
    function orderSeq(item: any, next: any) {
      if (item[8] === next[8]) {
        return 0;
      }

      return (item[8] < next[8]) ? -1 : 1;
    }

    ordenanteSpreadSheet.sort(orderBlock || orderSeq);
    return ordenanteSpreadSheet;
  }
}
