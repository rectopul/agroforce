/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable keyword-spacing */
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import handleError from '../../shared/utils/handleError';
import { responseGenericFactory, responseNullFactory } from '../../shared/utils/responseErrorFactory';
import { CulturaController } from '../cultura.controller';
import { TecnologiaController } from './tecnologia.controller';

export class ImportTechnologyController {
  static async validate({
    spreadSheet, idCulture, created_by: createdBy,
  }: ImportValidate): Promise<IReturnObject> {
    const culturaController = new CulturaController();
    const tecnologiaController = new TecnologiaController();
    const responseIfError: any = [];
    try {
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
                const { status, response }: IReturnObject = await tecnologiaController.getAll(
                  { idCulture, cod_tec: String(spreadSheet[row][0]) },
                );
                if (status === 200) {
                  if (response.length === 0) {
                    if (response.dt_import > spreadSheet[row][column]) {
                      responseIfError[column]
                        += responseGenericFactory(
                          (Number(column) + 1),
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
      }

      if (responseIfError.length === 0) {
        try {
          spreadSheet.forEach(async (item: any, row: number) => {
            if (row !== 0) {
              const {
                response: responseCulture,
              }: IReturnObject = await culturaController.getOneCulture(idCulture);
              const { status, response }: IReturnObject = await tecnologiaController.getAll(
                { idCulture, cod_tec: String(spreadSheet[row][0]) },
              );
              if (status === 200) {
                await tecnologiaController.update({
                  id: response[0]?.id,
                  id_culture: responseCulture?.id,
                  cod_tec: String(spreadSheet[row][0]),
                  name: spreadSheet[row][1],
                  desc: spreadSheet[row][2],
                  created_by: createdBy,
                  dt_import: new Date(spreadSheet[row][4]),
                });
              } else {
                await tecnologiaController.create({
                  id_culture: responseCulture?.id,
                  cod_tec: String(spreadSheet[row][0]),
                  name: spreadSheet[row][1],
                  desc: spreadSheet[row][2],
                  created_by: createdBy,
                  dt_import: new Date(spreadSheet[row][4]),
                });
              }
            }
          });
          return { status: 200, message: 'Tecnologia importado com sucesso' };
        } catch (error: any) {
          handleError('Tecnologia controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de tecnologia' };
        }
      }

      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      handleError('Tecnologia controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de tecnologia' };
    }
  }
}
