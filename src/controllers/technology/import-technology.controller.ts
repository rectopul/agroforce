/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable keyword-spacing */
import { TecnologiaRepository } from 'src/repository/tecnologia.repository';
import { TransactionConfig } from 'src/shared/prisma/transactionConfig';
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import handleError from '../../shared/utils/handleError';
import { responseGenericFactory, responseNullFactory } from '../../shared/utils/responseErrorFactory';
import { validateHeaders } from '../../shared/utils/validateHeaders';
import { CulturaController } from '../cultura.controller';
import { LogImportController } from '../log-import.controller';
import { TecnologiaController } from './tecnologia.controller';

export class ImportTechnologyController {
  static async validate(
    idLog: number,
    { spreadSheet, idCulture, created_by: createdBy }: ImportValidate,
  ): Promise<IReturnObject> {
    const culturaController = new CulturaController();
    const logImportController = new LogImportController();
    const tecnologiaController = new TecnologiaController();

    /* --------- Transcation Context --------- */
    const transactionConfig = new TransactionConfig();
    const tecnologiaRepository = new TecnologiaRepository();
    tecnologiaRepository.setTransaction(transactionConfig.clientManager, transactionConfig.transactionScope);
    /* --------------------------------------- */

    const responseIfError: any = [];
    const headers = [
      'Código da tecnologia (S1_C0189)',
      'Nome da tecnologia (S1_C0190)',
      'Rótulo (S1_C0101)',
      'Cultura (C0002)',
      'DT_EXPORT (SCRIPT0002)',
    ];
    try {
      const validate: any = await validateHeaders(spreadSheet, headers);
      if (validate.length > 0) {
        return { status: 400, message: validate };
      }
      const duplicateCode: any = [];
      for (const row in spreadSheet) {
        if (row !== '0') {
          for (const column in spreadSheet[row]) {
            if (column === '0') {
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              } else if ((spreadSheet[row][column]).toString().length > 2) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'o limite de caracteres e 2',
                  );
              } else if ((typeof (spreadSheet[row][column])) === 'number' && spreadSheet[row][column].toString().length < 2) {
                // eslint-disable-next-line no-param-reassign
                spreadSheet[row][column] = `0${spreadSheet[row][column].toString()}`;
                if(duplicateCode.includes(spreadSheet[row][column])) {
                  responseIfError[column]
                      += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'existem códigos duplicados na tabela',
                    );
                }
                duplicateCode.push(spreadSheet[row][column]);
              }
            } else if (column === '1') {
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              }
            } else if (column === '3') {
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              } else {
                const { status, response }: IReturnObject = await culturaController.getAllCulture(
                  { name: spreadSheet[row][column] },
                );
                if (status === 400) {
                  if (response?.length === 0) {
                    responseIfError[column]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'a cultura não esta cadastrada',
                      );
                  }
                }
                const {
                  status: statusCulture,
                  response: responseCulture,
                }: IReturnObject = await culturaController.getOneCulture(idCulture);
                if (statusCulture === 200) {
                  if ((responseCulture?.name)?.toUpperCase() !== spreadSheet[row][column]) {
                    responseIfError[column]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'a cultura e diferente da cultura selecionada',
                      );
                  }
                }
              }
            } else if (column === '4') {
              if (spreadSheet[row][column] === null) {
                responseIfError[column]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                // eslint-disable-next-line no-param-reassign
                spreadSheet[row][column] = new Date(spreadSheet[row][column]);
                const { status, response }: IReturnObject = await tecnologiaController.getAll({
                  filterCode: spreadSheet[row][0],
                  id_culture: idCulture,
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
                  let lastDtImport = response[0]?.dt_export?.getTime();
                  response.forEach((item: any) => {
                    lastDtImport = item.dt_export.getTime() > lastDtImport
                      ? item.dt_export.getTime()
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
        }
      }

      if (responseIfError.length === 0) {
        try {
          spreadSheet.forEach(async (item: any, row: number) => {
            if (row !== 0) {
              const {
                response: responseCulture,
              }: IReturnObject = await culturaController.getOneCulture(idCulture);
              const { status, response }: IReturnObject = await tecnologiaController.getAll(
                { id_culture: idCulture, cod_tec: String(spreadSheet[row][0]) },
              );

          await transactionConfig.transactionScope.run(async () => {
            for (let row in spreadSheet) {
              if (row !== '0') {
                const { status, response }: IReturnObject = await tecnologiaController.getAll(
                  { id_culture: idCulture, cod_tec: String(spreadSheet[row][0]) },
                );
                if (status === 200 && response[0]?.id) {
                  await tecnologiaRepository.updateTransaction(response[0]?.id, {
                    id: response[0]?.id,
                    id_culture: responseCulture?.id,
                    cod_tec: String(spreadSheet[row][0]),
                    name: spreadSheet[row][1],
                    desc: spreadSheet[row][2],
                    created_by: createdBy,
                    dt_export: new Date(spreadSheet[row][4]),
                  });
                } else {
                  await tecnologiaRepository.createTransaction({
                    id_culture: responseCulture?.id,
                    cod_tec: String(spreadSheet[row][0]),
                    name: spreadSheet[row][1],
                    desc: spreadSheet[row][2],
                    created_by: createdBy,
                    dt_export: new Date(spreadSheet[row][4]),
                  });
                } 
              }
            }
          });
          // spreadSheet.forEach(async (item: any, row: number) => {
          //   if (row !== 0) {
          //     const {
          //       response: responseCulture,
          //     }: IReturnObject = await culturaController.getOneCulture(idCulture);
          //     const { status, response }: IReturnObject = await tecnologiaController.getAll(
          //       { id_culture: idCulture, cod_tec: String(spreadSheet[row][0]) },
          //     );
          //     console.log('spreadSheet[row][0]');
          //     console.log(spreadSheet[row][0]);

          //     console.log('response');
          //     console.log(response);

          //     if (status === 200) {
          //       await tecnologiaController.update({
          //         id: response[0]?.id,
          //         id_culture: responseCulture?.id,
          //         cod_tec: String(spreadSheet[row][0]),
          //         name: spreadSheet[row][1],
          //         desc: spreadSheet[row][2],
          //         created_by: createdBy,
          //         dt_export: new Date(spreadSheet[row][4]),
          //       });
          //     } else {
          //       await tecnologiaController.create({
          //         id_culture: responseCulture?.id,
          //         cod_tec: String(spreadSheet[row][0]),
          //         name: spreadSheet[row][1],
          //         desc: spreadSheet[row][2],
          //         created_by: createdBy,
          //         dt_export: new Date(spreadSheet[row][4]),
          //       });
          //     }
          //   }
          // });
          await logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' });
          return { status: 200, message: 'Tecnologia importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
          handleError('Tecnologia controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de tecnologia' };
        }
      }

      await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('Tecnologia controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de tecnologia' };
    }
  }
}
