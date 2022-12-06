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
import { LogImportController } from '../log-import.controller';
// eslint-disable-next-line import/no-cycle
import { ImportController } from '../import.controller';
import { LayoutQuadraController } from './layout-quadra.controller';
import { LayoutChildrenController } from '../layout-children.controller';
import { CulturaController } from '../cultura.controller';
import { validateHeaders } from '../../shared/utils/validateHeaders';

export class ImportLayoutBlockController {
  static aux: any = {};

  static async validate(
    idLog: number,
    {
      spreadSheet, idCulture, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const importController = new ImportController();
    const culturaController = new CulturaController();
    const logImportController = new LogImportController();
    const layoutQuadraController = new LayoutQuadraController();
    const layoutChildrenController = new LayoutChildrenController();

    const responseIfError: Array<string> = [];
    const configModule: object | any = await importController.getAll(Number(5));
    const headers = [
      'CULTURA',
      'CODIGO',
      'LINHAS_PLANTADEIRA 4 / 8 / 12',
      'SL',
      'SC',
      'S_ALOC',
      'TIRO',
      'DISPARO',
      'CJ',
      'DIST',
      'ST',
      'SPC',
      'SCOLHEITA',
      'TIPO_PARCELA',
    ];
    try {
      const validate: any = await validateHeaders(spreadSheet, headers);
      if (validate.length > 0) {
        await logImportController.update({
          id: idLog, status: 1, state: 'INVALIDA', updated_at: Date().toLocaleString(), invalid_data: validate,
        });
        return { status: 400, message: validate };
      }
      const sColheita: any = {};
      const sl: any = {};
      const sc: any = {};
      const sAloc: any = {};
      let tiro: any = 0;
      const tiroXdisparo: any = {};
      const parcelas: any = {};
      let combinacao: any = '';
      for (const row in spreadSheet) {
        if (row !== '0') { // LINHA COM TITULO DAS COLUNAS
          for (const column in spreadSheet[row]) {
            if (configModule.response[0]?.fields[column] === 'Cultura') {
              if (spreadSheet[row][column] !== null) {
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
            }

            if (configModule.response[0]?.fields[column] === 'Esquema') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else {
                const { status }: IReturnObject = await layoutQuadraController.getAll(
                  { id_culture: idCulture, esquema: spreadSheet[row][column], status: 1 },
                );
                if (status === 200) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'ja existe um esquema ativo com esse código',
                  );
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'Plantadeiras') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else if (Number(spreadSheet[row][column]) !== 4
               && Number(spreadSheet[row][column]) !== 8
               && Number(spreadSheet[row][column] !== 12)) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'a plantadeira deve ser 4,8 ou 12',
                );
              } else if (spreadSheet[Number(row) - 1][1] === spreadSheet[row][1]
              && spreadSheet[Number(row) - 1][column] !== spreadSheet[row][column]) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'a plantadeira precisa ser igual para todo o esquema',
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'Tiro') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else if (tiro === 0) {
                if (spreadSheet[row][column] !== 1) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'o tiro precisa começar com 1',
                  );
                }
                tiro = spreadSheet[row][column];
              } else {
                tiro = spreadSheet[row][column];
              }
            }

            if (configModule.response[0]?.fields[column] === 'Disparo') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else {
                if (tiro === 0) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'o campo tiro precisa vir antes que a campo disparo',
                  );
                }
                if (spreadSheet[row][1] !== spreadSheet[Number(row) - 1][1]) {
                  tiroXdisparo[spreadSheet[row][0]] = [];
                }
                combinacao = `${spreadSheet[row][5]}x${spreadSheet[row][column]}`;
                if (tiroXdisparo[spreadSheet[row][1]]?.includes(combinacao)) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'a combinacao de tiros e disparos deve ser unica dentro do esquema',
                  );
                }
                tiroXdisparo[spreadSheet[row][0]]?.push(combinacao);
              }
            }

            if (configModule.response[0]?.fields[column] === 'SL') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                  );
              } else if (spreadSheet[row][1] === spreadSheet[Number(row) - 1][1]) {
                if (sl[spreadSheet[row][1]]?.includes(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'o sl não pode se repetir no mesmo esquema',
                  );
                }
              }
              if (spreadSheet[row][1] !== spreadSheet[Number(row) - 1][1]) {
                sl[spreadSheet[row][1]] = [];
              }
              sl[spreadSheet[row][1]]?.push(Number(spreadSheet[row][column]));
            }

            if (configModule.response[0]?.fields[column] === 'SC') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                  );
              } else if (spreadSheet[row][1] === spreadSheet[Number(row) - 1][1]) {
                if (sc[spreadSheet[row][1]]?.includes(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'o sc não pode se repetir no mesmo esquema',
                  );
                }
              }
              if (spreadSheet[row][1] !== spreadSheet[Number(row) - 1][1]) {
                sc[spreadSheet[row][1]] = [];
              }
              sc[spreadSheet[row][1]]?.push(Number(spreadSheet[row][column]));
            }

            if (configModule.response[0]?.fields[column] === 'SALOC') {
              if (spreadSheet[row][column] === null || spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else if (typeof (spreadSheet[row][column]) !== 'number' || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                  );
              } else if (spreadSheet[row][1] === spreadSheet[Number(row) - 1][1]) {
                if (sAloc[spreadSheet[row][1]]?.includes(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'o sAloc não pode se repetir no mesmo esquema',
                  );
                }
              }
              if (spreadSheet[row][1] !== spreadSheet[Number(row) - 1][1]) {
                sAloc[spreadSheet[row][1]] = [];
              }
              sAloc[spreadSheet[row][1]]?.push(Number(spreadSheet[row][column]));
            }

            if (configModule.response[0]?.fields[column] === 'CJ') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else if (spreadSheet[row][column] !== 'A'
              && spreadSheet[row][column] !== 'B'
              && spreadSheet[row][column] !== 'C'
              && spreadSheet[row][column] !== 'D') {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'o cj precisa ser A, B, C ou D',
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'Dist') {
              if (spreadSheet[row][column] === null || spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else if (typeof spreadSheet[row][column] !== 'number'
                && spreadSheet[row][column] > 9
                && spreadSheet[row][column] < 1) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'o Dist precisa ser um numero de 1 a 9',
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'ST') {
              if (spreadSheet[row][column] === null || spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else if (spreadSheet[row][column] !== 'A'
              && spreadSheet[row][column] !== 'V') {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'o ST precisa ser A ou V',
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'SPC') {
              if (spreadSheet[row][column] === null || spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'SColheita') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'a scolheita é obrigatorio',
                );
              } else {
                if (spreadSheet[row][1] === spreadSheet[Number(row) - 1][1]) {
                  if (sColheita[spreadSheet[row][1]]?.includes(spreadSheet[row][column])) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'o scolheita não pode se repetir no mesmo esquema',
                    );
                  }
                }
                if (spreadSheet[row][1] !== spreadSheet[Number(row) - 1][1]) {
                  sColheita[spreadSheet[row][1]] = [];
                }
                sColheita[spreadSheet[row][1]]?.push(Number(spreadSheet[row][column]));
              }
            }

            if (configModule.response[0]?.fields[column] === 'TipoParcela') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else if (spreadSheet[row][column] !== 'P'
               && spreadSheet[row][column] !== 'V') {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'no tipo de parcela só é aceitado P ou V',
                );
              } else if (spreadSheet[row][1] !== spreadSheet[Number(row) - 1][1]) {
                parcelas[spreadSheet[row][1]] = [];
              }
              parcelas[spreadSheet[row][1]]?.push(spreadSheet[row][column]);
            }
          }
        }
      }
      if (responseIfError.length === 0) {
        try {
          this.aux.status = 1;
          let count = 1;

          for (const row in spreadSheet) {
            if (row !== '0') {
              for (const column in spreadSheet[row]) {
                if (configModule.response[0]?.fields[column] === 'Esquema') {
                  if (spreadSheet[row][column] !== null) {
                    if ((this.aux.esquema) && this.aux.esquema !== spreadSheet[row][column]) {
                      const layoutQuadra: any = await layoutQuadraController.getAll(
                        { status: 1, idCulture, esquema: spreadSheet[row][column] },
                      );
                      if (layoutQuadra.total > 0) {
                        this.aux.id_layout_bd = layoutQuadra.response[0]?.id;
                      } else {
                        delete this.aux.id_layout_bd;
                      }
                      count = 1;
                    } else {
                      delete this.aux.id_layout_bd;
                    }
                    this.aux.parcelas = parcelas[spreadSheet[row][column]].length;
                    this.aux.esquema = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'Plantadeiras') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.plantadeira = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'Tiro') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.tiro = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'Disparo') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.disparo = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'SL') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.sl = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'SC') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.sc = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'SALOC') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.sAloc = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'CJ') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.cj = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'Dist') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.dist = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'ST') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.st = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'SPC') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.spc = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'SColheita') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.scolheita = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0]?.fields[column] === 'TipoParcela') {
                  if (spreadSheet[row][column] !== null) {
                    this.aux.tipo_parcela = spreadSheet[row][column];
                  }
                }
                if (spreadSheet[row].length === (Number(column) + 1) && this.aux !== []) {
                  if (count === 1) {
                    if (this.aux.id_layout_bd) {
                      await layoutQuadraController.update({
                        id: Number(this.aux.id_layout_bd),
                        id_culture: Number(idCulture),
                        esquema: this.aux.esquema,
                        plantadeira: String(this.aux.plantadeira),
                        parcelas: this.aux.parcelas,
                        tiros: 0,
                        disparos: 0,
                        status: this.aux.status,
                        created_by: createdBy,
                      });
                      this.aux.id_layout = this.aux.id_layout_bd;
                    } else {
                      const saveLayout: any = await layoutQuadraController.create({
                        id_culture: Number(idCulture),
                        esquema: this.aux.esquema,
                        plantadeira: String(this.aux.plantadeira),
                        parcelas: this.aux.parcelas,
                        tiros: 0,
                        disparos: 0,
                        status: this.aux.status,
                        created_by: createdBy,
                      });
                      this.aux.id_layout = saveLayout.response.id;
                    }

                    count += 1;
                  }

                  await layoutChildrenController.create({
                    id_layout: this.aux.id_layout,
                    sl: this.aux.sl,
                    sc: this.aux.sc,
                    s_aloc: this.aux.sAloc,
                    tiro: this.aux.tiro,
                    cj: String(this.aux.cj),
                    disparo: this.aux.disparo,
                    dist: this.aux.dist,
                    st: String(this.aux.st),
                    spc: String(this.aux.spc),
                    scolheita: this.aux.scolheita,
                    tipo_parcela: this.aux.tipo_parcela,
                    created_by: createdBy,
                  });
                }
              }
            }
          }
          await logImportController.update({
            id: idLog, status: 1, state: 'SUCESSO', updated_at: Date().toLocaleString(),
          });
          return { status: 200, message: 'Layout de quadra importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({
            id: idLog, status: 1, state: 'FALHA', updated_at: Date().toLocaleString(),
          });
          handleError('Layout de quadra controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de Layout de quadra' };
        }
      }
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      await logImportController.update({
        id: idLog, status: 1, state: 'INVALIDA', updated_at: Date().toLocaleString(), invalid_data: responseStringError,
      });
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({
        id: idLog, status: 1, state: 'FALHA', updated_at: Date().toLocaleString(),
      });

      handleError('Layout de quadra controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de Layout de quadra' };
    }
  }
}
