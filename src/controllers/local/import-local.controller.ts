/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import handleError from '../../shared/utils/handleError';
import { responseGenericFactory, responseNullFactory, responsePositiveNumericFactory } from '../../shared/utils/responseErrorFactory';
// eslint-disable-next-line import/no-cycle
import { ImportController } from '../import.controller';
import { LogImportController } from '../log-import.controller';
import { SafraController } from '../safra.controller';
import { LocalController } from './local.controller';
import { UnidadeCulturaController } from './unidade-cultura.controller';

export class ImportLocalController {
  static aux: any = {};

  static async validate(
    idLog: number,
    { spreadSheet, idSafra, created_by: createdBy }: ImportValidate,
  ): Promise<IReturnObject> {
    const safraController = new SafraController();
    const localController = new LocalController();
    const importController = new ImportController();
    const logImportController = new LogImportController();
    const unidadeCulturaController = new UnidadeCulturaController();

    const responseIfError: any = [];
    try {
      const configModule: object | any = await importController.getAll(4);
      configModule.response[0]?.fields.push('DT');
      for (const row in spreadSheet) {
        for (const column in spreadSheet[row]) {
          if (row === '0') {
            if (!(spreadSheet[row][column].toUpperCase())
              .includes(configModule.response[0]?.fields[column].toUpperCase())) {
              responseIfError[Number(column)]
                += responseGenericFactory(
                  (Number(column) + 1),
                  row,
                  spreadSheet[0][column],
                  'a sequencia de colunas da planilha esta incorreta',
                );
            }
          } else if (spreadSheet[0][column].includes('ID da unidade de cultura')) {
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
            }
          } else if (spreadSheet[0][column].includes('Ano')) {
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
              const { status, response }: IReturnObject = await safraController.getOne(idSafra);
              if (status === 200) {
                if (response?.year !== spreadSheet[row][column]) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'o campo Ano não corresponde ao ano da safra selecionada',
                    );
                }
              }
            }
          } else if (spreadSheet[0][column].includes('Nome da unidade de cultura')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)]
                += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            } else {
              const { response } = await localController.getAll(
                { id_local_culture: Number(spreadSheet[row][3]) },
              );
              const {
                response: unityExist,
              }: IReturnObject = await unidadeCulturaController.getAll({
                name_unity_culture: spreadSheet[row][column],
              });
              if (unityExist[0]?.id_local !== response[0]?.id) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'não e possível atualizar a unidade de cultura pois a mesma não pertence a esse lugar de cultura',
                );
              }
              console.log('unityExist');
              console.log(unityExist);

              console.log('response');
              console.log(response);
            }
          } else if (spreadSheet[0][column].includes('ID do lugar de cultura')) {
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
            }
          } else if (spreadSheet[0][column].includes('Nome do lugar de cultura')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)]
                += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            }
          } else if (spreadSheet[0][column].includes('Rótulo')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)]
                += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            }
          } else if (spreadSheet[0][column].includes('MLOC')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)]
                += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            }
          } else if (spreadSheet[0][column].includes('Endereço')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)]
                += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            }
          } else if (spreadSheet[0][column].includes('Identificador de localidade')) {
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
            }
          } else if (spreadSheet[0][column].includes('Nome da localidade')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)]
                += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            }
          } else if (spreadSheet[0][column].includes('Identificador de região')) {
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
            }
          } else if (spreadSheet[0][column].includes('Nome da região')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)]
                += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            }
          } else if (spreadSheet[0][column].includes('REG_LIBELLE')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)]
                += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            }
          } else if (spreadSheet[0][column].includes('ID do País')) {
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
            }
          } else if (spreadSheet[0][column].includes('Nome do país')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)]
                += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            }
          } else if (spreadSheet[0][column].includes('CNTR_LIBELLE')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)]
                += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
            }
          } else if (spreadSheet[0][column].includes('DT')) {
            // eslint-disable-next-line no-param-reassign
            spreadSheet[row][column] = new Date(spreadSheet[row][column]);
            const { status, response }: IReturnObject = await localController.getAll({
              filterNameLocalCulture: spreadSheet[row][4],
            });
            const dateNow = new Date();
            if (dateNow.getTime() < spreadSheet[row][column].getTime()) {
              responseIfError[Number(column)] += responseGenericFactory(
                Number(column) + 1,
                row,
                spreadSheet[0][column],
                'a data e maior que a data atual',
              );
            }
            if (spreadSheet[row][column].getTime() < 100000) {
              responseIfError[Number(column)] += responseGenericFactory(
                Number(column) + 1,
                row,
                spreadSheet[0][column],
                'o campo DT precisa ser no formato data',
              );
            }
            if (status === 200) {
              let lastDtImport = response[0]?.dt_import?.getTime();
              response.forEach((item: any) => {
                lastDtImport = item.dt_import.getTime() > lastDtImport
                  ? item.dt_import.getTime()
                  : lastDtImport;
              });
              if (
                lastDtImport
                > spreadSheet[row][column].getTime()
              ) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'essa informação é mais antiga do que a informação do software',
                );
              }
            }
          }
        }
      }

      if (responseIfError.length === 0) {
        const localCultureDTO: object | any = {};
        const unityCultureDTO: object | any = {};
        try {
          for (const row in spreadSheet) {
            if (row !== '0') {
              for (const column in spreadSheet[row]) {
                if (spreadSheet[0][column].includes('ID da unidade de cultura')) {
                  unityCultureDTO.id_unity_culture = Number(spreadSheet[row][column]);
                } else if (spreadSheet[0][column].includes('Ano')) {
                  unityCultureDTO.year = Number(spreadSheet[row][column]);
                } else if (spreadSheet[0][column].includes('Nome da unidade de cultura')) {
                  unityCultureDTO.name_unity_culture = (spreadSheet[row][column].toString());
                } else if (spreadSheet[0][column].includes('ID do lugar de cultura')) {
                  localCultureDTO.id_local_culture = Number(spreadSheet[row][column]);
                } else if (spreadSheet[0][column].includes('Nome do lugar de cultura')) {
                  localCultureDTO.name_local_culture = (spreadSheet[row][column].toString());
                } else if (spreadSheet[0][column].includes('CP_LIBELLE')) {
                  localCultureDTO.label = (spreadSheet[row][column].toString());
                } else if (spreadSheet[0][column].includes('MLOC')) {
                  localCultureDTO.mloc = (spreadSheet[row][column].toString());
                } else if (spreadSheet[0][column].includes('Endereço')) {
                  localCultureDTO.adress = (spreadSheet[row][column].toString());
                } else if (spreadSheet[0][column].includes('Identificador de localidade')) {
                  localCultureDTO.id_locality = Number(spreadSheet[row][column]);
                } else if (spreadSheet[0][column].includes('Nome da localidade')) {
                  localCultureDTO.name_locality = (spreadSheet[row][column].toString());
                } else if (spreadSheet[0][column].includes('Identificador de região')) {
                  localCultureDTO.id_region = Number(spreadSheet[row][column]);
                } else if (spreadSheet[0][column].includes('Nome da região')) {
                  localCultureDTO.name_region = (spreadSheet[row][column].toString());
                } else if (spreadSheet[0][column].includes('REG_LIBELLE')) {
                  localCultureDTO.label_region = (spreadSheet[row][column].toString());
                } else if (spreadSheet[0][column].includes('ID do País')) {
                  localCultureDTO.id_country = Number(spreadSheet[row][column]);
                } else if (spreadSheet[0][column].includes('Nome do país')) {
                  localCultureDTO.name_country = (spreadSheet[row][column].toString());
                } else if (spreadSheet[0][column].includes('CNTR_LIBELLE')) {
                  localCultureDTO.label_country = (spreadSheet[row][column].toString());
                } else if (spreadSheet[0][column].includes('DT')) {
                  localCultureDTO.dt_import = spreadSheet[row][column];
                }
              }
              localCultureDTO.created_by = Number(createdBy);
              unityCultureDTO.created_by = Number(createdBy);
              unityCultureDTO.id_safra = Number(idSafra);
              const { response } = await localController.getAll(
                { id_local_culture: localCultureDTO.id_local_culture },
              );
              const {
                response: unityExist,
              }: IReturnObject = await unidadeCulturaController.getAll({
                name_unity_culture: unityCultureDTO.name_unity_culture,
                id_local: response[0]?.id,
              });
              if (response.total > 0) {
                localCultureDTO.id = response[0]?.id;
                unityCultureDTO.id_local = response[0]?.id;
                await localController.update(localCultureDTO);
                if (unityExist.total > 0) {
                  unityCultureDTO.id = unityExist[0]?.id;
                  await unidadeCulturaController.update(unityCultureDTO);
                } else {
                  delete unityCultureDTO.id;
                  await unidadeCulturaController.create(unityCultureDTO);
                }
              } else {
                delete localCultureDTO.id;
                const { response: newLocal } = await localController.create(localCultureDTO);
                unityCultureDTO.id_local = newLocal?.id;
                if (unityExist.total > 0) {
                  unityCultureDTO.id = unityExist[0]?.id;
                  await unidadeCulturaController.update(unityCultureDTO);
                } else {
                  delete unityCultureDTO.id;
                  await unidadeCulturaController.create(unityCultureDTO);
                }
              }
            }
          }
          await logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' });
          return { status: 200, message: 'Local importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
          handleError('Local controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de Local' };
        }
      }
      await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('Local controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de Local' };
    }
  }
}
