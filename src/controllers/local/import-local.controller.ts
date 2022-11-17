/* eslint-disable prefer-destructuring */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { TransactionConfig } from 'src/shared/prisma/transactionConfig';
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import handleError from '../../shared/utils/handleError';
import { responseGenericFactory, responseNullFactory, responsePositiveNumericFactory } from '../../shared/utils/responseErrorFactory';
import { validateHeaders } from '../../shared/utils/validateHeaders';
// eslint-disable-next-line import/no-cycle
import { ImportController } from '../import.controller';
import { LogImportController } from '../log-import.controller';
import { SafraController } from '../safra.controller';
import { LocalController } from './local.controller';
import { UnidadeCulturaController } from './unidade-cultura.controller';
import { LocalRepository } from '../../repository/local.repository';
import { UnidadeCulturaRepository } from '../../repository/unidade-cultura.repository';

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

    /* --------- Transcation Context --------- */
    const transactionConfig = new TransactionConfig();
    const localRepository = new LocalRepository();
    const unidadeCulturaRepository = new UnidadeCulturaRepository();
    localRepository.setTransaction(
      transactionConfig.clientManager,
      transactionConfig.transactionScope,
    );
    unidadeCulturaRepository.setTransaction(
      transactionConfig.clientManager,
      transactionConfig.transactionScope,
    );
    /* --------------------------------------- */

    const localTemp: Array<string> = [];
    const responseIfError: Array<string> = [];

    const headers = [
      'ID da unidade de cultura (CULTURE_UNIT_ID)',
      'Ano (YEAR)',
      'Nome da unidade de cultura (CULTURE_UNIT_NAME)',
      'ID do lugar de cultura (CP_CULTURE_PLACE_ID)',
      'Nome do lugar de cultura (CP_CULTURE_PLACE_NAME)',
      'Rótulo (CP_LIBELLE)',
      'MLOC (CP_C3084)',
      'Endereço (CP_ADRESS)',
      'Identificador de localidade (CM_COMMUNE_ID)',
      'Nome da localidade (CM_COMMUNE_NAME)',
      'Identificador de região (REG_REGION_ID)',
      'Nome da região (REG_REGION_NAME)',
      'Rótulo (REG_LIBELLE)',
      'ID do País (CNTR_COUNTRY_ID)',
      'Nome do país (CNTR_COUNTRY_NAME)',
      'Rótulo (CNTR_LIBELLE)',
      'DT_EXPORT (SCRIPT0002)',
    ];
    try {
      const validate: any = await validateHeaders(spreadSheet, headers);
      if (validate.length > 0) {
        await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
        return { status: 400, message: validate };
      }
      const configModule: object | any = await importController.getAll(4);
      configModule.response[0]?.fields.push('DT');
      for (const row in spreadSheet) {
        if (localTemp.includes(spreadSheet[row][2])) {
          await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
          localTemp[row] = spreadSheet[row][2];
          return { status: 200, message: `Erro na linha ${Number(row) + 1}. Experimentos duplicados na tabela` };
        }
        localTemp[row] = spreadSheet[row][2];
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
                if (Number(response?.year) !== Number(spreadSheet[row][column])) {
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
              if (unityExist.length > 0) {
                if (unityExist[0]?.id_local !== response[0]?.id) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'não e possível atualizar a unidade de cultura pois a mesma não pertence a esse lugar de cultura',
                  );
                }
              }
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
            // vazio
          } else if (spreadSheet[0][column].includes('Endereço')) {
            // vazio
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
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += responseNullFactory(
                Number(column) + 1,
                row,
                spreadSheet[0][column],
              );
            } else {
              // eslint-disable-next-line no-param-reassign
              spreadSheet[row][column] = new Date(spreadSheet[row][column]);
              const { status, response }: IReturnObject = await unidadeCulturaController.getAll({
                filterNameUnityCulture: spreadSheet[row][2],
                filterYear: spreadSheet[row][1],
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
                const lastDtImport = response[0]?.dt_export?.getTime();
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
      }

      if (responseIfError.length === 0) {
        const localCultureDTO: object | any = {};
        const unityCultureDTO: object | any = {};
        try {
          await transactionConfig.transactionScope.run(async () => {
            for (const row in spreadSheet) {
              if (row !== '0') {
                for (const column in spreadSheet[row]) {
                  if (spreadSheet[0][column].includes('ID da unidade de cultura')) {
                    unityCultureDTO.id_unity_culture = Number(spreadSheet[row][column]);
                  } else if (spreadSheet[0][column].includes('Ano')) {
                    unityCultureDTO.year = Number(spreadSheet[row][column]);
                  } else if (spreadSheet[0][column].includes('Nome da unidade de cultura')) {
                    unityCultureDTO.name_unity_culture = (spreadSheet[row][column]?.toString());
                  } else if (spreadSheet[0][column].includes('ID do lugar de cultura')) {
                    localCultureDTO.id_local_culture = Number(spreadSheet[row][column]);
                  } else if (spreadSheet[0][column].includes('Nome do lugar de cultura')) {
                    localCultureDTO.name_local_culture = (spreadSheet[row][column]?.toString());
                  } else if (spreadSheet[0][column].includes('CP_LIBELLE')) {
                    localCultureDTO.label = (spreadSheet[row][column]?.toString());
                  } else if (spreadSheet[0][column].includes('MLOC')) {
                    localCultureDTO.mloc = (spreadSheet[row][column]?.toString());
                  } else if (spreadSheet[0][column].includes('Endereço')) {
                    localCultureDTO.adress = (spreadSheet[row][column]?.toString());
                  } else if (spreadSheet[0][column].includes('Identificador de localidade')) {
                    localCultureDTO.id_locality = Number(spreadSheet[row][column]);
                  } else if (spreadSheet[0][column].includes('Nome da localidade')) {
                    localCultureDTO.name_locality = (spreadSheet[row][column]?.toString());
                  } else if (spreadSheet[0][column].includes('Identificador de região')) {
                    localCultureDTO.id_region = Number(spreadSheet[row][column]);
                  } else if (spreadSheet[0][column].includes('Nome da região')) {
                    localCultureDTO.name_region = (spreadSheet[row][column]?.toString());
                  } else if (spreadSheet[0][column].includes('REG_LIBELLE')) {
                    localCultureDTO.label_region = (spreadSheet[row][column]?.toString());
                  } else if (spreadSheet[0][column].includes('ID do País')) {
                    localCultureDTO.id_country = Number(spreadSheet[row][column]);
                  } else if (spreadSheet[0][column].includes('Nome do país')) {
                    localCultureDTO.name_country = (spreadSheet[row][column]?.toString());
                  } else if (spreadSheet[0][column].includes('CNTR_LIBELLE')) {
                    localCultureDTO.label_country = (spreadSheet[row][column]?.toString());
                  } else if (spreadSheet[0][column].includes('DT')) {
                    unityCultureDTO.dt_export = spreadSheet[row][column];
                  }
                }
                localCultureDTO.created_by = Number(createdBy);
                unityCultureDTO.created_by = Number(createdBy);
                const { response } = await localController.getAll(
                  { id_local_culture: localCultureDTO.id_local_culture },
                );
                const {
                  response: unityExist,
                }: IReturnObject = await unidadeCulturaController.getAll({
                  name_unity_culture: unityCultureDTO.name_unity_culture,
                  id_local: response[0]?.id,
                });

                // Abrir transação
                if (response.length > 0) {
                  localCultureDTO.id = response[0]?.id;
                  unityCultureDTO.id_local = response[0]?.id;

                  await localRepository.updateTransaction(
                    localCultureDTO.id,
                    localCultureDTO,
                  );
                  if (unityExist.length > 0) {
                    unityCultureDTO.id = unityExist[0]?.id;
                    await unidadeCulturaRepository.updateTransaction(
                      unityCultureDTO.id,
                      unityCultureDTO,
                    );
                  } else {
                    delete unityCultureDTO.id;
                    await unidadeCulturaRepository.createTransaction(unityCultureDTO);
                  }
                } else {
                  delete localCultureDTO.id;
                  const newLocal = await localRepository.createTransaction(localCultureDTO);
                  unityCultureDTO.id_local = await newLocal?.id;
                  if (unityExist.total > 0) {
                    unityCultureDTO.id = unityExist[0]?.id;
                    await unidadeCulturaRepository.updateTransaction(
                      unityCultureDTO.id,
                      unityCultureDTO,
                    );
                  } else {
                    delete unityCultureDTO.id;

                    await unidadeCulturaRepository.createTransaction(unityCultureDTO);
                  }
                }
                // fechar transação
              }
            }
          });

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
