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
import { LogImportController } from '../log-import.controller';
import { ImportController } from '../import.controller';
import { NpeController } from './npe.controller';
import { TecnologiaController } from '../technology/tecnologia.controller';
import { GroupController } from '../group.controller';
import { FocoController } from '../foco.controller';
import { TypeAssayController } from '../tipo-ensaio.controller';

export class ImportNpeController {
  static aux: any = {};

  static async validate(
    idLog: number,
    {
      spreadSheet, idSafra, idCulture, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const safraController = new SafraController();
    const localController = new LocalController();
    const importController = new ImportController();
    const logImportController = new LogImportController();
    const npeController = new NpeController();
    const tecnologiaController = new TecnologiaController();
    const groupController = new GroupController();
    const focoController = new FocoController();
    const typeAssayController = new TypeAssayController();

    const npeTemp: Array<string> = [];
    const responseIfError: Array<string> = [];
    try {
      const configModule: object | any = await importController.getAll(14);
      for (const row in spreadSheet) {
        if (row !== '0') { // LINHA COM TITULO DAS COLUNAS
          const npeName = `${spreadSheet[row][0]}_${spreadSheet[row][1]}_${spreadSheet[row][2]}_${spreadSheet[row][3]}_${spreadSheet[row][4]}_${spreadSheet[row][6]}`;
          const { status }: IReturnObject = await npeController.getAll({
            safraId: idSafra,
            filterFoco: spreadSheet[row][1],
            filterEnsaio: spreadSheet[row][2],
            filterCodTec: spreadSheet[row][3],
            filterLocal: spreadSheet[row][4],
            filterEpoca: spreadSheet[row][6],
            filterStatus: 1,
            idCulture,
          });
          if (status === 200) {
            return { status: 400, message: `Erro na linha ${Number(row) + 1}. NPE já cadastrada no sistema` };
          }
          if (npeTemp.includes(npeName)) {
            await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
            npeTemp[row] = npeName;
            return { status: 400, message: `Erro na linha ${Number(row) + 1}. NPE's duplicados na tabela` };
          }
          npeTemp[row] = npeName;
          for (const column in spreadSheet[row]) {
            this.aux.status = 1;
            this.aux.created_by = createdBy;
            this.aux.npef = 0;
            this.aux.prox_npe = 0;
            if (configModule.response[0]?.fields[column] === 'Local') {
              if (spreadSheet[row][column] !== null) {
                if (typeof (spreadSheet[row][column]) === 'string') {
                  const local: any = await localController.getAll(
                    { name_local_culture: spreadSheet[row][column] },
                  );
                  if (local.total === 0) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'o local não existe no sistema',
                    );
                  } else {
                    this.aux.localId = local.response[0]?.id;
                  }
                } else {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'local deve ser um campo de texto',
                  );
                }
              } else {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'Safra') {
              if (spreadSheet[row][column] !== null) {
                if (typeof (spreadSheet[row][column]) === 'string') {
                  const validateSafra: any = await safraController.getOne(Number(idSafra));
                  if (spreadSheet[row][column] !== validateSafra.response.safraName) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'a safra a ser importada tem que ser a mesma selecionada',
                    );
                  }
                  const safras: any = await safraController.getAll(
                    { safraName: spreadSheet[row][column] },
                  );
                  if (safras.total === 0) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'a safra não existe no sistema',
                    );
                  } else {
                    this.aux.safraId = safras.response[0]?.id;
                  }
                } else {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'safra deve ser um campo de texto',
                  );
                }
              } else {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'OGM') {
              if (spreadSheet[row][column] !== null) {
                if ((typeof (spreadSheet[row][column])) === 'number' && spreadSheet[row][column].toString().length < 2) {
                  // eslint-disable-next-line no-param-reassign
                  spreadSheet[row][column] = `0${spreadSheet[row][column].toString()}`;
                }
                const ogm: any = await tecnologiaController.getAll(
                  { cod_tec: String(spreadSheet[row][column]) },
                );
                if (ogm.total === 0) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'a tecnologia informada não existe no sistema',
                  );
                } else {
                  this.aux.tecnologiaId = ogm.response[0]?.id;
                }
              } else {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'Foco') {
              if (spreadSheet[row][column] !== null) {
                if (typeof (spreadSheet[row][column]) === 'string') {
                  const {
                    status: focoStatus,
                    response,
                  }: IReturnObject = await focoController.getAll(
                    {
                      name: spreadSheet[row][column],
                      id_culture: idCulture,
                      filterStatus: 1,
                    },
                  );
                  if (focoStatus !== 200) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'o foco não existe no sistema',
                    );
                  } else {
                    this.aux.focoId = response[0]?.id;
                    const { status: focoGroup }: IReturnObject = await groupController.getAll({
                      id_safra: idSafra,
                      id_foco: this.aux.focoId,
                    });
                    if (focoGroup !== 200) {
                      responseIfError[Number(column)] += responseGenericFactory(
                        Number(column) + 1,
                        row,
                        spreadSheet[0][column],
                        'os focos precisam ter grupos cadastrados nessa safra',
                      );
                    }
                  }
                } else {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'foco deve ser um campo de texto',
                  );
                }
              } else {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'Ensaio') {
              if (spreadSheet[row][column] !== null) {
                if (typeof (spreadSheet[row][column]) === 'string') {
                  const ensaio: any = await typeAssayController.getAll(
                    { name: spreadSheet[row][column], id_culture: idCulture },
                  );
                  if (ensaio.total === 0) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'o tipo de ensaio não existe no sistema',
                    );
                  } else {
                    this.aux.typeAssayId = ensaio.response[0]?.id;
                  }
                } else {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'tipo de ensaio deve ser um campo de texto',
                  );
                }
              } else {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'NPEI') {
              if (spreadSheet[row][column] !== null) {
                if (typeof (spreadSheet[row][column]) === 'number' || spreadSheet[row][column] > 0) {
                  if (typeof (this.aux.focoId) === 'undefined') {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'O foco precisa ser importado antes da NPEI',
                    );
                  }
                  const resp: any = await npeController.validateNpeiDBA({
                    Column: (Number(column) + 1),
                    Line: (Number(row) + 1),
                    safra: idSafra,
                    foco: this.aux.focoId,
                    npei: spreadSheet[row][column],
                  });
                  if (resp.erro === 1) {
                    responseIfError[Number(column)] += resp.message;
                  }
                  if (responseIfError.length === 0) {
                    this.aux.npei = spreadSheet[row][column];
                  }
                } else {
                  responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                    );
                }
              } else {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'Epoca') {
              if (spreadSheet[row][column] !== null) {
                if (typeof (spreadSheet[row][column]) !== 'number' || spreadSheet[row][column] <= 0) {
                  responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                    );
                }
              } else {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
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
              for (const column in spreadSheet[row]) {
                this.aux.status = 1;
                this.aux.created_by = createdBy;
                this.aux.npef = 0;
                this.aux.prox_npe = 0;
                if (configModule.response[0]?.fields[column] === 'Local') {
                  const local: any = await localController.getAll(
                    { name_local_culture: spreadSheet[row][column] },
                  );
                  this.aux.localId = local.response[0]?.id;
                }

                if (configModule.response[0]?.fields[column] === 'Safra') {
                  this.aux.safraId = Number(idSafra);
                }

                if (configModule.response[0]?.fields[column] === 'OGM') {
                  const ogm: any = await tecnologiaController.getAll(
                    { cod_tec: String(spreadSheet[row][column]) },
                  );
                  this.aux.tecnologiaId = ogm.response[0]?.id;
                }

                if (configModule.response[0]?.fields[column] === 'Foco') {
                  const foco: any = await focoController.getAll(
                    {
                      name: spreadSheet[row][column],
                      id_culture: idCulture,
                      filterStatus: 1,
                    },
                  );
                  this.aux.focoId = Number(foco.response[0]?.id);
                }

                if (configModule.response[0]?.fields[column] === 'Ensaio') {
                  const ensaio: any = await typeAssayController.getAll(
                    { name: spreadSheet[row][column] },
                  );
                  this.aux.typeAssayId = ensaio.response[0]?.id;
                }

                if (configModule.response[0]?.fields[column] === 'Epoca') {
                  this.aux.epoca = String(spreadSheet[row][column]);
                }

                if (configModule.response[0]?.fields[column] === 'NPEI') {
                  this.aux.npei = spreadSheet[row][column];
                }

                if (spreadSheet[row].length === (Number(column) + 1)) {
                  const { response: groupResponse }: any = await groupController.getAll(
                    { id_safra: idSafra, id_foco: this.aux.focoId },
                  );
                  this.aux.groupId = Number(groupResponse[0]?.id);
                  await npeController.create(this.aux);
                }
              }
            }
          }
          await logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' });
          return { status: 200, message: 'NPE importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
          handleError('NPE controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de NPE' };
        }
      }
      await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('NPE controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de NPE' };
    }
  }
}
