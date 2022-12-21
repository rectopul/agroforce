/* eslint-disable no-loop-func */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { TransactionConfig } from 'src/shared/prisma/transactionConfig';
import { DelineamentoRepository } from 'src/repository/delineamento.repository';
import { SequenciaDelineamentoRepository } from 'src/repository/sequencia-delineamento.repository';
import { skip } from 'rxjs';
import handleError from '../../shared/utils/handleError';
import {
  responseNullFactory,
  responseGenericFactory,
  responsePositiveNumericFactory,
} from '../../shared/utils/responseErrorFactory';
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import { DelineamentoController } from './delineamento.controller';
import { LogImportController } from '../log-import.controller';
import { SequenciaDelineamentoController } from '../sequencia-delineamento.controller';
import { ImportController } from '../import.controller';
import { CulturaController } from '../cultura.controller';
import { validateHeaders } from '../../shared/utils/validateHeaders';
import { delimitationQueue } from './delimitation-queue';

export class ImportDelimitationController {
  static async validate(
    idLog: number,
    queueProcessing: boolean,
    {
      spreadSheet, idSafra, idCulture, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const logImportController = new LogImportController();
    const headers = [
      'CULTURA',
      'DELI',
      'R',
      'ORDEM',
      'NT',
      'B',
    ];
    const validate: any = await validateHeaders(spreadSheet, headers);
    if (validate.length > 0) {
      await logImportController.update({
        id: idLog, status: 1, state: 'INVALIDA', updated_at: new Date(Date.now()), invalid_data: validate,
      });

      return { status: 400, message: validate };
    }
    if ((spreadSheet.length > Number(process.env.MAX_DIRECT_UPLOAD_ALLOWED))
    && !queueProcessing) {
      delimitationQueue.add({
        instance: {
          spreadSheet, idSafra, idCulture, created_by: createdBy,
        },
        logId: idLog,
      });
      return {
        status: 400,
        message: 'Os dados são validados e carregados em background',
      };
    }

    const importController = new ImportController();
    const culturaController = new CulturaController();
    const delineamentoController = new DelineamentoController();

    const responseIfError: Array<string> = [];
    try {
      const configModule: object | any = await importController.getAll(7);
      for (const row in spreadSheet) {
        if (row !== '0') {
          for (const column in spreadSheet[row]) {
            if (configModule.response[0]?.fields[column] === 'Cultura') {
              if (spreadSheet[row][column] !== null) {
                const {
                  response,
                }: any = await culturaController.getOneCulture(Number(idCulture));
                if (response?.name?.toUpperCase() !== spreadSheet[row][column]?.toUpperCase()) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'a cultura e diferente da selecionada',
                  );
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'Nome') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              const delineamento: any = await delineamentoController.getAll(
                { name: spreadSheet[row][column], id_culture: idCulture, status: 1 },
              );
              if (delineamento.total > 0) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'nome do delineamento ja cadastrado',
                );
              }
            }

            if (configModule.response[0]?.fields[column] === 'Repeticao') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else if (typeof (spreadSheet[row][column]) !== 'number'
               || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              } else if (spreadSheet[Number(row) - 1][1]
                !== spreadSheet[row][1]
                || row === '1') {
                if (spreadSheet[row][column] !== 1) {
                  responseIfError[Number(column)]
                  += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'repetição deve iniciar com valor igual a 1',
                    );
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'Tratamento') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }

            if (configModule.response[0]?.fields[column] === 'Sorteio') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (typeof (spreadSheet[row][column]) !== 'number'
               || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              } else if (spreadSheet[Number(row) - 1][1]
                !== spreadSheet[row][1]
                || row === '1') {
                if (spreadSheet[row][column] !== 1) {
                  responseIfError[Number(column)]
                  += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'o sorteio deve começar em 1',
                    );
                }
              } else if (spreadSheet[Number(row) - 1][column]
              !== (spreadSheet[row][column] - 1)) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'o sorteio deve ser sequencial',
                  );
              }
            }

            if (configModule.response[0]?.fields[column] === 'Bloco') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              if (typeof (spreadSheet[row][column]) !== 'number'
              || Number(spreadSheet[row][column]) < 0) {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              }
            }
          }
        }
      }

      if (responseIfError.length === 0) {
        return this.storeRecords(idLog, {
          spreadSheet, idSafra, idCulture, created_by: createdBy,
        });
      }
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      await logImportController.update({
        id: idLog,
        status: 1,
        state: 'INVALIDA',
        invalid_data: responseStringError,
        updated_at: new Date(Date.now()),
      });
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({
        id: idLog, status: 1, state: 'FALHA', updated_at: new Date(Date.now()),
      });
      handleError('Delineamento controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de Delineamento' };
    }
  }

  static async storeRecords(idLog: number, {
    spreadSheet, idSafra, idCulture, created_by: createdBy,
  }: ImportValidate) {
    const delineamentoController = new DelineamentoController();
    const sequenciaDelineamentoController = new SequenciaDelineamentoController();
    const logImportController = new LogImportController();

    /* --------- Transcation Context --------- */
    const transactionConfig = new TransactionConfig();
    const delineamentoRepository = new DelineamentoRepository();
    delineamentoRepository.setTransaction(
      transactionConfig.clientManager,
      transactionConfig.transactionScope,
    );
    const sequenciaRepository = new SequenciaDelineamentoRepository();
    sequenciaRepository.setTransaction(
      transactionConfig.clientManager,
      transactionConfig.transactionScope,
    );
    /* --------------------------------------- */

    try {
      await transactionConfig.transactionScope.run(async () => {
        let delineamentoSaved;

        for (const row in spreadSheet) {
          if (row !== '0') {
            const where = {
              name: spreadSheet[row][1],
              id_culture: Number(idCulture),
              status: 1,
            };
            const select = {
              id: true,
              name: true,
              repeticao: true,
              trat_repeticao: true,
              status: true,
            };

            const listDelineamento = await delineamentoRepository.findAll(where, select, undefined, undefined, undefined);
            let delineamentoId = listDelineamento[0]?.id;

            if (listDelineamento.total > 0) {
              delineamentoSaved = await delineamentoRepository.updateTransaction(delineamentoId, {
                id: delineamentoId,
                created_by: createdBy,
              });
            } else {
              delineamentoSaved = await delineamentoRepository.createTransaction({
                name: spreadSheet[row][1],
                id_culture: idCulture,
                repeticao: 1,
                trat_repeticao: 1,
                created_by: createdBy,
              });
              delineamentoId = delineamentoSaved.id;
            }
            const sequenciaCreated = await sequenciaRepository.createTransaction({
              id_delineamento: delineamentoId,
              repeticao: spreadSheet[row][2],
              sorteio: spreadSheet[row][3],
              nt: spreadSheet[row][4],
              bloco: spreadSheet[row][5],
              created_by: createdBy,
            });

            // Atualiza contagem apos inserir nova sequencia
            if (delineamentoSaved) {
              let repeticaoUpdated = delineamentoSaved.repeticao;
              let tratRepeticaoUpdated = delineamentoSaved.trat_repeticao;

              if (sequenciaCreated.repeticao > delineamentoSaved.repeticao) {
                repeticaoUpdated = sequenciaCreated.repeticao;
              }

              if (sequenciaCreated.nt > delineamentoSaved.trat_repeticao) {
                tratRepeticaoUpdated = sequenciaCreated.nt;
              }

              delineamentoSaved = await delineamentoRepository.updateTransaction(delineamentoId, {
                id: delineamentoId,
                repeticao: repeticaoUpdated,
                trat_repeticao: tratRepeticaoUpdated,
              });
            }
          }
        }
      });
      await logImportController.update({
        id: idLog, status: 1, state: 'SUCESSO', updated_at: new Date(Date.now()),
      });
      return { status: 200, message: 'Delineamento importado com sucesso' };
    } catch (error: any) {
      await logImportController.update({
        id: idLog, status: 1, state: 'FALHA', updated_at: new Date(Date.now()),
      });
      handleError('Delineamento controller', 'Save Import', error.message);
      return { status: 500, message: 'Erro ao salvar planilha de Delineamento' };
    }
  }
}
