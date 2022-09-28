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
import { LayoutQuadraController } from '../block-layout/layout-quadra.controller';
import { LayoutChildrenController } from '../layout-children.controller';
import { AllocatedExperimentController } from './allocated-experimento.controller';

export class ImportAllocationController {
  static async validate(
    idLog: number,
    {
      spreadSheet, idSafra, idCulture, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const safraController = new SafraController();
    const localController = new LocalController();
    const quadraController = new QuadraController();
    const logImportController = new LogImportController();
    const experimentController = new ExperimentController();
    const layoutQuadraController = new LayoutQuadraController();
    const layoutChildrenController = new LayoutChildrenController();
    const experimentGenotipeController = new ExperimentGenotipeController();
    const allocatedExperimentController = new AllocatedExperimentController();

    const responseIfError: Array<string> = [];

    for (const count in spreadSheet) {
      spreadSheet[count].push(Number(count));
    }
    const header = spreadSheet.shift();
    // eslint-disable-next-line no-param-reassign
    spreadSheet = await this.orderByBlock(spreadSheet);

    spreadSheet.unshift(header);

    try {
      const allParcelas: any = {};
      for (const row in spreadSheet) {
        if (row !== '0') {
          for (const column in spreadSheet[row]) {
            if (column === '0') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[0][column],
                  );
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
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
                      spreadSheet[row][9],
                      spreadSheet[0][column],
                      'o id do experimento não encontrado nessa safra',
                    );
                }
              }
            }

            if (column === '1') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[0][column],
                  );
              } else {
                const { response }: IReturnObject = await safraController.getOne(Number(idSafra));
                if (response.safraName !== spreadSheet[row][column]) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      spreadSheet[row][9],
                      spreadSheet[0][column],
                      'safra e diferente da safra selecionada',
                    );
                }
              }
            }

            if (column === '2') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[0][column],
                  );
              } else {
                const { status }: IReturnObject = await experimentController.getAll({
                  filterExperimentName: spreadSheet[row][column],
                  idSafra,
                });
                if (status !== 200) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      spreadSheet[row][9],
                      spreadSheet[0][column],
                      'o nome do experimento não cadastrado nessa safra',
                    );
                }
              }
            }

            if (column === '3') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[0][column],
                  );
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[row][column],
                  );
              } else {
                const { response }: IReturnObject = await experimentController.getAll({
                  id: spreadSheet[row][0],
                  idSafra,
                });
                const allNpe = response[0]?.experiment_genotipe.map((item: any) => (item.status === 'IMPRESSO' ? item.npe : 0));
                let npeRange = Number(spreadSheet[row][column]);
                const validateNpeRange = [];
                while (npeRange <= Number(spreadSheet[row][4])) {
                  if (allNpe?.includes(npeRange)) {
                    validateNpeRange.push(true);
                  } else {
                    validateNpeRange.push(false);
                  }
                  npeRange += 1;
                }

                if (validateNpeRange.includes(false)) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      spreadSheet[row][9],
                      spreadSheet[0][column],
                      'as parcelas desse experimento não estão dentro do intervalo de NPE',
                    );
                }
              }
            }

            if (column === '4') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[0][column],
                  );
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[row][column],
                  );
              }
            }

            if (column === '5') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[0][column],
                  );
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[row][column],
                  );
              } else {
                if (spreadSheet[Number(row) - 1][7] !== spreadSheet[row][7]
                      || row === '1') {
                  allParcelas[spreadSheet[row][7]] = 0;
                }
                // eslint-disable-next-line max-len
                const npeDiff = Number(spreadSheet[row][Number(column) - 1]) === Number(spreadSheet[row][Number(column) - 2])
                  ? 1
                  : (spreadSheet[row][Number(column) - 1]
                  - spreadSheet[row][Number(column) - 2]) + 1;
                if (npeDiff !== spreadSheet[row][column]) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      spreadSheet[row][9],
                      spreadSheet[0][column],
                      'o numero de parcelas estão fora do alcance de NPE',
                    );
                } else if ((spreadSheet.length - 1) !== Number(row)) {
                  if (spreadSheet[Number(row) + 1][7] !== spreadSheet[row][7]
                  || Number(row) === (Number(spreadSheet?.length) - 1)) {
                    allParcelas[spreadSheet[row][7]] += Number(spreadSheet[row][column]);
                    const { response }: IReturnObject = await quadraController.getAll({
                      cod_quadra: spreadSheet[Number(row) - 1][7],
                      id_safra: idSafra,
                    });
                    const {
                      response: esquema,
                    }: IReturnObject = await layoutQuadraController.getAll({
                      filterEsquema: response[0]?.esquema,
                      id_culture: idCulture,
                    });
                    if (allParcelas[spreadSheet[Number(row) - 1][7]] !== esquema[0]?.parcelas) {
                      responseIfError[Number(column)]
                      += responseGenericFactory(
                          (Number(column) + 1),
                          spreadSheet[row][9],
                          spreadSheet[0][column],
                          'o numero de parcelas e diferente das parcelas do layout',
                        );
                    }
                  } else {
                    allParcelas[spreadSheet[row][7]] += Number(spreadSheet[row][column]);
                  }
                } else {
                  allParcelas[spreadSheet[Number(row) - 1][7]] += Number(spreadSheet[row][column]);
                  const { response }: IReturnObject = await quadraController.getAll({
                    cod_quadra: spreadSheet[Number(row) - 1][7],
                    id_safra: idSafra,
                  });
                  const {
                    response: esquema,
                  }: IReturnObject = await layoutQuadraController.getAll({
                    filterEsquema: response[0]?.esquema,
                    id_culture: idCulture,
                  });
                  if (allParcelas[spreadSheet[Number(row) - 1][7]] !== esquema[0]?.parcelas) {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        spreadSheet[row][9],
                        spreadSheet[0][column],
                        'o numero de parcelas e diferente das parcelas do layout',
                      );
                  }
                }
              }
            }

            if (column === '6') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[0][column],
                  );
              } else {
                const { status, response }: IReturnObject = await localController.getAll({
                  name_local_culture: spreadSheet[row][column],
                });
                if (status !== 200) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      spreadSheet[row][9],
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
                        spreadSheet[row][9],
                        spreadSheet[0][column],
                        'não tem unidade de cultura cadastrada no local informado',
                      );
                  }
                }
              }
            }

            if (column === '7') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[0][column],
                  );
              } else {
                const { status, response }: IReturnObject = await quadraController.getAll({
                  cod_quadra: spreadSheet[row][column],
                  id_safra: idSafra,
                });
                if (status !== 200) {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      spreadSheet[row][9],
                      spreadSheet[0][column],
                      'quadra não cadastrada nessa safra',
                    );
                } else if (response[0]?.local?.name_local_culture !== spreadSheet[row][6]) {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      spreadSheet[row][9],
                      spreadSheet[0][column],
                      'local de preparo não e o mesmo relacionado a quadra',
                    );
                }
              }
            }

            if (column === '8') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[0][column],
                  );
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
                    spreadSheet[row][column],
                  );
              } else if (spreadSheet[row][7] === spreadSheet[Number(row) - 1][7]) {
                if ((Number(spreadSheet[row][column]) - 1)
                !== spreadSheet[Number(row) - 1][column]) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      spreadSheet[row][9],
                      spreadSheet[0][column],
                      'a seq deve ser sequencial',
                    );
                }
              } else if (Number(spreadSheet[row][column]) !== 1) {
                responseIfError[Number(column)]
                    += responseGenericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][9],
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
              const { response: quadra }: any = await quadraController.getAll({
                id_safra: idSafra, name: spreadSheet[row][7],
              });
              const { response: experiment }: any = await experimentController.getAll({
                filterExperimentName: spreadSheet[row][2],
                idSafra,
              });
              const { response: blockLayout }: any = await layoutQuadraController.getAll({
                esquema: quadra[0]?.esquema,
                id_culture: idCulture,
              });
              const { response: layoutSequence }: any = await layoutChildrenController.getAll({
                id_layout: blockLayout[0]?.id,
                orderBy: 'sc',
                typeOrder: 'asc',
              });
              const parcelas = experiment[0]?.experiment_genotipe.map((item: any) => (item.status === 'IMPRESSO' ? item.id : 0));
              layoutSequence.forEach(async (item: any, index: number) => {
                if (parcelas[index]) {
                  await experimentGenotipeController.relateLayout({
                    id: parcelas[index],
                    blockLayoutId: item.id,
                    status: 'ALOCADO',
                  });
                }
              });
              await quadraController.update({ id: quadra[0]?.id, allocation: 'ALOCADO' });
              await experimentController.update({ id: experiment[0]?.id, blockId: quadra[0]?.id });
              await allocatedExperimentController.create({
                seq: Number(spreadSheet[row][8]),
                experimentName: spreadSheet[row][2],
                npei: Number(spreadSheet[row][3]),
                npef: Number(spreadSheet[row][4]),
                blockId: quadra[0]?.id,
                parcelas: Number(spreadSheet[row][5]),
                createdBy,
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
