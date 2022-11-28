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
import { UserCultureController } from '../user-culture.controller';
import { CulturaController } from '../cultura.controller';
import { validateHeaders } from '../../shared/utils/validateHeaders';

export class ImportNpeController {
  static aux: any = {};

  static async validate(
    idLog: number,
    {
      spreadSheet, idSafra, idCulture, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const npeController = new NpeController();
    const focoController = new FocoController();
    const safraController = new SafraController();
    const localController = new LocalController();
    const groupController = new GroupController();
    const importController = new ImportController();
    const culturaController = new CulturaController();
    const logImportController = new LogImportController();
    const typeAssayController = new TypeAssayController();
    const tecnologiaController = new TecnologiaController();

    const npeTemp: Array<string> = [];
    const npeiTemp: Array<number> = [];
    const responseIfError: Array<string> = [];
    const headers = [
      'CULTURA',
      'SAFRA',
      'FOCO',
      'ENSAIO',
      'GGEN',
      'CODLOCAL',
      'NPEI',
      'EP',
    ];
    try {
      const validate: any = await validateHeaders(spreadSheet, headers);
      if (validate.length > 0) {
        await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
        return { status: 400, message: validate };
      }
      const configModule: object | any = await importController.getAll(14);
      for (const row in spreadSheet) {
        if (row !== '0') {
          // LINHA COM TITULO DAS COLUNAS
          if (spreadSheet[row][4].toString().length < 2) {
            // eslint-disable-next-line no-param-reassign
            spreadSheet[row][4] = `0${spreadSheet[row][4]}`;
          }
          const npeInicial = spreadSheet[row][6];
          const npeName = `${spreadSheet[row][1]}_${spreadSheet[row][2]}_${spreadSheet[row][3]}_${spreadSheet[row][4]}_${spreadSheet[row][5]}_${spreadSheet[row][7]}`;
          const { response: validateNpe }: IReturnObject = await npeController.getAll({
            safraId: idSafra,
            filterFoco: spreadSheet[row][2],
            filterEnsaio: spreadSheet[row][3],
            filterCodTecnologia: spreadSheet[row][4],
            filterLocal: spreadSheet[row][5],
            filterEpoca: spreadSheet[row][7],
            filterStatus: 1,
          });
          console.log('🚀 ~ file: import-npe.controller.ts ~ line 83 ~ ImportNpeController ~ validateNpe', validateNpe);

          if (validateNpe.length > 0) {
            responseIfError[0] += `<li style="text-align:left"> Erro na linha ${Number(row)}. Ambiente já cadastrada no sistema. </li> <br>`;
          }
          if (npeTemp.includes(npeName)) {
            await logImportController.update({
              id: idLog,
              status: 1,
              state: 'INVALIDA',
            });
            npeTemp[row] = npeName;
            responseIfError[0] += `<li style="text-align:left"> Erro na linha ${Number(row)}. Ambiente duplicados na tabela. </li> <br>`;
          }
          if (npeiTemp.includes(npeInicial)) {
            await logImportController.update({
              id: idLog,
              status: 1,
              state: 'INVALIDA',
            });
            npeiTemp[row] = npeInicial;
            responseIfError[0] += `<li style="text-align:left"> Erro na linha ${Number(row)}. NPEI duplicadas na tabela. </li> <br>`;
          }
          npeTemp[row] = npeName;
          npeiTemp[row] = npeInicial;
          for (const column in spreadSheet[row]) {
            this.aux.status = 1;
            this.aux.created_by = createdBy;
            if (configModule.response[0]?.fields[column] === 'Cultura') {
              if (spreadSheet[row][column] !== null) {
                const { response }: any = await culturaController.getOneCulture(
                  Number(idCulture),
                );
                if (response?.name !== spreadSheet[row][column]) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'a cultura e diferente da selecionada',
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

            if (configModule.response[0]?.fields[column] === 'Local') {
              if (spreadSheet[row][column] !== null) {
                if (typeof spreadSheet[row][column] === 'string') {
                  const { response } = await localController.getAll({
                    name_local_culture: spreadSheet[row][column],
                  });
                  if (response.total === 0) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'o local não existe no sistema',
                    );
                  } else {
                    const {
                      response: responseSafra,
                    }: IReturnObject = await safraController.getOne(idSafra);
                    const cultureUnityValidate = response[0]?.cultureUnity.map(
                      (item: any) => {
                        if (item?.year === responseSafra?.year) return true;
                        return false;
                      },
                    );
                    if (!cultureUnityValidate?.includes(true)) {
                      responseIfError[Number(column)] += responseGenericFactory(
                        Number(column) + 1,
                        row,
                        spreadSheet[0][column],
                        'o local não tem unidades referentes ao ano da safra selecionada',
                      );
                    } else {
                      this.aux.localId = response[0]?.id;
                    }
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
                if (typeof spreadSheet[row][column] === 'string') {
                  const validateSafra: any = await safraController.getOne(
                    Number(idSafra),
                  );
                  if (
                    spreadSheet[row][column]
                    !== validateSafra.response.safraName
                  ) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'a safra a ser importada tem que ser a mesma selecionada',
                    );
                  }
                  const safras: any = await safraController.getAll({
                    safraName: spreadSheet[row][column],
                  });
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
                if ((spreadSheet[row][column]).toString().length > 2) {
                  responseIfError[Number(column)]
                  += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o limite de caracteres e 2',
                    );
                } else {
                  if (spreadSheet[row][column].toString().length < 2) {
                  // eslint-disable-next-line no-param-reassign
                    spreadSheet[row][column] = `0${spreadSheet[row][column].toString()}`;
                  }

                  const ogm: any = await tecnologiaController.getAll({
                    cod_tec: String(spreadSheet[row][column]),
                    id_culture: idCulture,
                  });
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
                if (typeof spreadSheet[row][column] === 'string') {
                  const {
                    status: focoStatus,
                    response,
                  }: IReturnObject = await focoController.getAll({
                    name: spreadSheet[row][column],
                    id_culture: idCulture,
                    filterStatus: 1,
                  });
                  if (focoStatus !== 200) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'informado não existe no sistema ou está inativo',
                    );
                  } else {
                    this.aux.focoId = response[0]?.id;
                  //   const { status: focoGroup }: IReturnObject = await groupController.getAll({
                  //     id_safra: idSafra,
                  //     id_foco: this.aux.focoId,
                  //   });
                  //   if (focoGroup !== 200) {
                  //     responseIfError[Number(column)] += responseGenericFactory(
                  //       Number(column) + 1,
                  //       row,
                  //       spreadSheet[0][column],
                  //       'os focos precisam ter grupos cadastrados nessa safra',
                  //     );
                  //   }
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
                if (typeof spreadSheet[row][column] === 'string') {
                  const ensaio: any = await typeAssayController.getAll({
                    name: spreadSheet[row][column],
                    id_culture: idCulture,
                    filterStatus: 1,
                  });
                  if (ensaio.total === 0) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'o tipo de ensaio não existe no sistema ou está inativo',
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
                if (
                  typeof spreadSheet[row][column] === 'number'
                  || spreadSheet[row][column] > 0
                ) {
                  if (typeof this.aux.focoId === 'undefined') {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'O foco precisa ser importado antes da NPEI',
                    );
                  }
                  const resp: any = await npeController.validateNpeiDBA({
                    Column: Number(column) + 1,
                    Line: Number(row) + 1,
                    safra: idSafra,
                    foco: this.aux.focoId,
                    npei: spreadSheet[row][column],
                  });
                  if (resp.erro === 1) {
                    responseIfError[Number(column)] += resp.message;
                  }
                  if (responseIfError.length === 0) {
                    this.aux.npei = spreadSheet[row][column];
                    this.aux.npef = spreadSheet[row][column];
                    this.aux.prox_npe = spreadSheet[row][column];
                    this.aux.npei_i = spreadSheet[row][column];
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
                if (
                  typeof spreadSheet[row][column] !== 'number'
                  || spreadSheet[row][column] <= 0
                ) {
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
          const createMany: any = [];
          for (const row in spreadSheet) {
            if (row !== '0') {
              const npeDto: any = {};
              for (const column in spreadSheet[row]) {
                npeDto.status = 1;
                npeDto.created_by = createdBy;

                if (configModule.response[0]?.fields[column] === 'Local') {
                  const local: any = await localController.getAll(
                    { name_local_culture: spreadSheet[row][column] },
                  );
                  npeDto.localId = local.response[0]?.id;
                }

                if (configModule.response[0]?.fields[column] === 'Safra') {
                  npeDto.safraId = Number(idSafra);
                }

                if (configModule.response[0]?.fields[column] === 'OGM') {
                  const ogm: any = await tecnologiaController.getAll(
                    { cod_tec: String(spreadSheet[row][column]) },
                  );
                  npeDto.tecnologiaId = ogm.response[0]?.id;
                }

                if (configModule.response[0]?.fields[column] === 'Foco') {
                  const foco: any = await focoController.getAll(
                    {
                      name: spreadSheet[row][column],
                      id_culture: idCulture,
                      filterStatus: 1,
                    },
                  );
                  npeDto.focoId = Number(foco.response[0]?.id);
                }

                if (configModule.response[0]?.fields[column] === 'Ensaio') {
                  const ensaio: any = await typeAssayController.getAll(
                    { name: spreadSheet[row][column], filterStatus: 1 },
                  );
                  npeDto.typeAssayId = ensaio.response[0]?.id;
                }

                if (configModule.response[0]?.fields[column] === 'Epoca') {
                  npeDto.epoca = String(spreadSheet[row][column]);
                }

                if (configModule.response[0]?.fields[column] === 'NPEI') {
                  npeDto.npei = spreadSheet[row][column];
                  npeDto.npef = spreadSheet[row][column];
                  npeDto.prox_npe = spreadSheet[row][column];
                  npeDto.npei_i = spreadSheet[row][column];
                }

                if (spreadSheet[row].length === (Number(column) + 1)) {
                  const { response: groupResponse }: any = await groupController.getAll(
                    { id_safra: idSafra, id_foco: npeDto.focoId },
                  );
                  npeDto.groupId = Number(groupResponse[0]?.id);
                  createMany.push(npeDto);
                }
              }
            }
          }
          await npeController.create(createMany);
          await logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' });
          return { status: 200, message: 'Ambiente importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({
            id: idLog,
            status: 1,
            state: 'FALHA',
          });
          handleError('NPE controller', 'Save Import', error.message);
          return {
            status: 500,
            message: 'Erro ao salvar planilha de Ambiente',
          };
        }
      }
      await logImportController.update({
        id: idLog,
        status: 1,
        state: 'INVALIDA',
      });
      const responseStringError = responseIfError
        .join('')
        .replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({
        id: idLog,
        status: 1,
        state: 'FALHA',
      });
      handleError('NPE controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de Ambiente' };
    }
  }
}
