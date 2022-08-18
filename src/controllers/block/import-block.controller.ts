/* eslint-disable camelcase */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import handleError from '../../shared/utils/handleError';
import { responseGenericFactory, responseNullFactory } from '../../shared/utils/responseErrorFactory';
import { CulturaController } from '../cultura.controller';
import { DividersController } from '../dividers.controller';
// eslint-disable-next-line import/no-cycle
import { ImportController } from '../import.controller';
import { LayoutQuadraController } from '../layout-quadra.controller';
import { LocalController } from '../local/local.controller';
import { LogImportController } from '../log-import.controller';
import { SafraController } from '../safra.controller';
import { QuadraController } from './quadra.controller';

export class ImportBlockController {
  static async validate(
    idLog: number,
    {
      spreadSheet, idSafra, idCulture, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const localController = new LocalController();
    const safraController = new SafraController();
    const importController = new ImportController();
    const quadraController = new QuadraController();
    const culturaController = new CulturaController();
    const dividersController = new DividersController();
    const logImportController = new LogImportController();
    const layoutQuadraController = new LayoutQuadraController();

    const responseIfError: any = [];
    const aux: any = {};
    try {
      const configModule: object | any = await importController.getAll(17);

      let larg_q: any;
      let comp_p: any;
      let df: any = 0;
      let cod_quadra: any;
      let cod_quadra_anterior: any;
      let t4_i: any = 0;
      let t4_f: any = 0;
      let divisor_anterior: any = 0;
      for (const row in spreadSheet) {
        if (row !== '0') {
          for (const column in spreadSheet[row]) {
            if (configModule.response[0]?.fields[column] === 'Safra') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status, response }: IReturnObject = await safraController.getOne(
                  Number(idSafra),
                );
                if (status === 200) {
                  if (String(spreadSheet[row][column]) !== response?.safraName) {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'a safra importada precisa ser igual a safra selecionada',
                      );
                  }
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'Cultura') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status, response }: IReturnObject = await culturaController.getOneCulture(
                  Number(idCulture),
                );
                if (status === 200) {
                  if (spreadSheet[row][column].toUpperCase() !== response.name.toUpperCase()) {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'a cultura importada precisa ser igual a cultura selecionada',
                      );
                  }
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'LocalPrep') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status, response }: IReturnObject = await localController.getAll(
                  { name_local_culture: spreadSheet[row][column] },
                );
                if (status !== 200) {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o local não existe no sistema',
                    );
                } else {
                  aux.local_preparo = response[0]?.id;
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'CodigoQuadra') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status }: IReturnObject = await quadraController.getAll(
                  {
                    cod_quadra: spreadSheet[row][column],
                    local: spreadSheet[row][2],
                    filterStatus: 1,
                  },
                );
                if (status === 200) {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'código quadra já existe neste local, para poder atualiza-lo você precisa inativar o existente',
                    );
                }
                cod_quadra_anterior = cod_quadra;
                cod_quadra = spreadSheet[row][column];
              }
            }

            if (configModule.response[0]?.fields[column] === 'LargQ') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (larg_q !== '') {
                if (cod_quadra === cod_quadra_anterior) {
                  if (spreadSheet[row][column] !== larg_q && row !== '1') {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'a largQ precisa ser igual na planilha inteira',
                      );
                    larg_q = spreadSheet[row][column];
                  } else {
                    larg_q = spreadSheet[row][column];
                  }
                } else {
                  larg_q = spreadSheet[row][column];
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'CompP') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (cod_quadra === cod_quadra_anterior) {
                if (spreadSheet[row][column] !== comp_p && row !== '1') {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o compP precisa ser igual na planilha inteira',
                    );
                  comp_p = spreadSheet[row][column];
                } else {
                  comp_p = spreadSheet[row][column];
                }
              } else {
                comp_p = spreadSheet[row][column];
              }
            }

            if (configModule.response[0]?.fields[column] === 'LinhaP') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }

            if (configModule.response[0]?.fields[column] === 'CompC') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }

            if (configModule.response[0]?.fields[column] === 'Esquema') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { response, total }: any = await layoutQuadraController.getAll(
                  { esquema: spreadSheet[row][column], idCulture, status: 1 },
                );
                if (total === 0) {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o esquema do layout ainda não foi cadastrado',
                    );
                } else if (spreadSheet[row][3] !== spreadSheet[Number(row) - 1][3]) {
                  if (spreadSheet[Number(row) - 1][12] < response[0]?.tiros) {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        'T4F',
                        'os tiros da quadra devem ser maiores ou iguais ao da esquema',
                      );
                  }
                  if (spreadSheet[row][14] < response[0]?.disparos) {
                    responseIfError[Number(column)]
                    += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        'DF',
                        'os disparos da quadra devem ser maiores ou iguais ao da esquema',
                      );
                  }
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'Divisor') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (cod_quadra === cod_quadra_anterior) {
                if (divisor_anterior === 0) {
                  if (spreadSheet[row][column] <= 0) {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'o divisor precisa começar com 1 e ser positivo',
                      );
                  } else {
                    divisor_anterior = spreadSheet[row][column];
                  }
                } else if (spreadSheet[row][column] > divisor_anterior) {
                  if ((divisor_anterior + 1) !== spreadSheet[row][column]) {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'não pode ter intersecção de parcelas',
                      );
                  }
                  divisor_anterior = spreadSheet[row][column];
                } else {
                  divisor_anterior = spreadSheet[row][column];
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'a coluna dos divisores precisa está em sequencia',
                    );
                }
              } else if (divisor_anterior === 0) {
                if (spreadSheet[row][column] <= 0) {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o divisor precisa começar com 1 e ser positivo',
                    );
                }
                divisor_anterior = spreadSheet[row][column];
              } else {
                divisor_anterior = spreadSheet[row][column];
              }
            }

            if (configModule.response[0]?.fields[column] === 'Semente') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] <= 0) {
                responseIfError[Number(column)]
                      += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'a semmetro precisar ser maior que 0',
                  );
              }
            }

            if (configModule.response[0]?.fields[column] === 'T4I') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (cod_quadra === cod_quadra_anterior) {
                if (t4_i === 0) {
                  if (spreadSheet[row][column] !== 1) {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'o t4i precisa começar com 1',
                      );
                  }
                  t4_i = spreadSheet[row][column];
                } else {
                  if (spreadSheet[row][column] <= t4_f) {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'o t4i precisa ser maior que a t4f anterior',
                      );
                  }
                  t4_i = spreadSheet[row][column];
                }
              } else {
                if (spreadSheet[row][column] !== 1) {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o t4i precisa começar com 1',
                    );
                }
                t4_i = spreadSheet[row][column];
              }
            }

            if (configModule.response[0]?.fields[column] === 'T4F') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (cod_quadra === cod_quadra_anterior) {
                if (t4_i === 0) {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'A coluna t4f precisa está depois da coluna t4i',
                    );
                }
                if (t4_i > spreadSheet[row][column]) {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o t4i e o t4f precisam estar em ordem crescente',
                    );
                } else {
                  t4_f = spreadSheet[row][column];
                }
              } else {
                if (t4_i === 0) {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'A coluna t4f precisa está depois da coluna t4i',
                    );
                }
                if (t4_i > spreadSheet[row][column]) {
                  responseIfError[Number(column)]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o t4i e o t4f precisam estar em ordem crescente',
                    );
                } else {
                  t4_f = spreadSheet[row][column];
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'DI') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] !== 1) {
                responseIfError[Number(column)]
                      += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'o di precisa ser 1',
                  );
              }
            }

            if (configModule.response[0]?.fields[column] === 'DF') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (df === 0) {
                df = spreadSheet[row][column];
              } else {
                df = spreadSheet[row][column];
                if (cod_quadra === cod_quadra_anterior) {
                  if (df !== spreadSheet[row][column]) {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'a coluna df deve ser igual para este pai',
                      );
                  }
                }
              }
            }
          }
        }
      }

      if (responseIfError.length === 0) {
        aux.created_by = Number(createdBy);
        aux.id_culture = Number(idCulture);
        aux.status = 1;
        let count = 1;
        aux.id_safra = Number(idSafra);

        try {
          for (const row in spreadSheet) {
            if (row !== '0') {
              for (const column in spreadSheet[row]) {
                if (configModule.response[0]?.fields[column] === 'LocalPrep') {
                  if (spreadSheet[row][column] !== '') {
                    const { response }: IReturnObject = await localController.getAll(
                      { name_local_culture: spreadSheet[row][column] },
                    );
                    aux.local_preparo = response[0]?.id;
                  }
                }

                if (configModule.response[0]?.fields[column] === 'CodigoQuadra') {
                  if (spreadSheet[row][column] !== '') {
                    if ((aux.cod_quadra) && aux.cod_quadra !== spreadSheet[row][column]) {
                      aux.disparo_fixo = aux.t4_f;
                      count = 1;
                    }
                    aux.cod_quadra = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'LargQ') {
                  if (spreadSheet[row][column] !== '') {
                    aux.larg_q = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'CompP') {
                  if (spreadSheet[row][column] !== '') {
                    aux.comp_p = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'LinhaP') {
                  if (spreadSheet[row][column] !== '') {
                    aux.linha_p = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'CompC') {
                  if (spreadSheet[row][column] !== '') {
                    aux.comp_c = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'Esquema') {
                  if (spreadSheet[row][column] !== '') {
                    aux.esquema = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'Divisor') {
                  if (spreadSheet[row][column] !== '') {
                    aux.divisor = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'Semente') {
                  if (spreadSheet[row][column] !== '') {
                    aux.sem_metros = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'T4I') {
                  if (spreadSheet[row][column] !== '') {
                    aux.t4_i = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'T4F') {
                  if (spreadSheet[row][column] !== '') {
                    aux.t4_f = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'DI') {
                  if (spreadSheet[row][column] !== '') {
                    aux.di = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'DF') {
                  if (spreadSheet[row][column] !== '') {
                    aux.df = spreadSheet[row][column];
                  }
                }
              }
              if (count === 1) {
                aux.tiro_fixo = aux.t4_i;

                if (aux.id_quadra) {
                  await quadraController.update(
                    {
                      id: aux.id_quadra,
                      tiro_fixo: aux.tiro_fixo,
                      disparo_fixo: aux.disparo_fixo,
                    },
                  );
                }

                const saveQuadra: any = await quadraController.create({
                  cod_quadra: aux.cod_quadra,
                  id_culture: aux.id_culture,
                  id_safra: aux.id_safra,
                  id_local: Number(aux.local_preparo),
                  larg_q: aux.larg_q,
                  comp_p: aux.comp_p,
                  linha_p: aux.linha_p,
                  comp_c: aux.comp_c,
                  esquema: aux.esquema,
                  status: aux.status,
                  created_by: aux.created_by,
                });
                aux.id_quadra = saveQuadra.response.id;
                count += 1;
              }

              await dividersController.create({
                id_quadra: aux.id_quadra,
                t4_i: aux.t4_i,
                t4_f: aux.t4_f,
                di: aux.di,
                divisor: aux.divisor,
                df: aux.df,
                sem_metros: aux.sem_metros,
                created_by: aux.created_by,
              });
            }
          }
          await logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' });
          return { status: 200, message: 'Quadra importada com sucesso' };
        } catch (error: any) {
          await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
          handleError('Quadra controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de Quadra' };
        }
      }
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('Quadra controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de Quadra' };
    }
  }
}
