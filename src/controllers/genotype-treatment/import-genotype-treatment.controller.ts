/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { AssayListRepository } from 'src/repository/assay-list.repository';
import { GenotypeTreatmentRepository } from 'src/repository/genotype-treatment/genotype-treatment.repository';
import { HistoryGenotypeTreatmentRepository } from 'src/repository/genotype-treatment/history-genotype-tratment.repository';

import { TransactionConfig } from 'src/shared/prisma/transactionConfig';
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import handleError from '../../shared/utils/handleError';
import { validateInteger } from '../../shared/utils/numberValidate';
import {
  responseNullFactory,
  responseGenericFactory,
  responseDoesNotExist,
} from '../../shared/utils/responseErrorFactory';
import { AssayListController } from '../assay-list/assay-list.controller';
import { GenotipoController } from '../genotype/genotipo.controller';
import { LogImportController } from '../log-import.controller';
import { LoteController } from '../lote.controller';
import { SafraController } from '../safra.controller';
import { GenotypeTreatmentController } from './genotype-treatment.controller';
import { HistoryGenotypeTreatmentController } from './history-genotype-treatment.controller';

export class ImportGenotypeTreatmentController {
  static async validate(
    idLog: number,
    {
      spreadSheet, idSafra, idCulture, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const loteController = new LoteController();
    const genotipoController = new GenotipoController();
    const logImportController = new LogImportController();
    const genotypeTreatmentController = new GenotypeTreatmentController();
    const historyGenotypeTreatmentController = new HistoryGenotypeTreatmentController();

    /* --------- Transcation Context --------- */
    const safraController = new SafraController();
    const transactionConfig = new TransactionConfig();
    const assayListRepository = new AssayListRepository();
    const assayListController = new AssayListController();
    const genotypeTreatmentRepository = new GenotypeTreatmentRepository();
    const historyGenotypeTreatmentRepository = new HistoryGenotypeTreatmentRepository();

    assayListRepository.setTransaction(transactionConfig.clientManager, transactionConfig.transactionScope);
    genotypeTreatmentRepository.setTransaction(transactionConfig.clientManager, transactionConfig.transactionScope);
    historyGenotypeTreatmentRepository.setTransaction(transactionConfig.clientManager, transactionConfig.transactionScope);
    /* --------------------------------------- */

    const responseIfError: Array<string> = [];

    try {
      for (const row in spreadSheet) {
        if (row !== '0') { // LINHA COM TITULO DAS COLUNAS
          // const { response: assayList } = await assayListController.getAll({
          //   gli: spreadSheet[row][4],
          // });
          // if (assayList.length !== 0) {
          //   if ((assayList[0]?.status) === 'EXP IMP.') {
          //     responseIfError[0]
          //       += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o ensaio já foi sorteado </li> <br>`;
          //   }
          // }

          if (spreadSheet[row][3]?.toString().length < 2) {
            // eslint-disable-next-line no-param-reassign
            spreadSheet[row][3] = `0${spreadSheet[row][3]}`;
          }

          const {
            response: treatments,
          }: any = await genotypeTreatmentController.getAll({
            filterFoco: spreadSheet[row][1],
            filterTypeAssay: spreadSheet[row][2],
            filterCodTec: spreadSheet[row][3],
            filterGli: spreadSheet[row][4],
            filterBgm: Number(spreadSheet[row][5]),
            filterTreatmentsNumber: Number(spreadSheet[row][6]),
            filterStatusT: spreadSheet[row][7],
            filterGenotypeName: spreadSheet[row][8],
          });

          if (treatments.length === 0) {
            responseIfError[0]
              += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o tratamento de genótipo não encontrado, as chaves para encontra-lo são (
                FOCO, TIPO DE ENSAIO, TECNOLOGIA, GLI, BGM, NT, STATUS_T E GENÓTIPO
              ) </li> <br>`;
          } else if (treatments[0]?.status_experiment === 'EXP. SORTEADO') {
            responseIfError[0]
              += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o tratamento do genótipo já foi sorteado. </li> <br>`;
          }
          // if (treatments[0]?.status_experiment === 'SORTEADO') {
          //   responseIfError[0]
          //     += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o tratamento já foi sorteado e não pode ser substituído. </li> <br>`;
          // }

          // if (treatments[0]?.assay_list.foco.name !== spreadSheet[row][1]) {
          //   responseIfError[0]
          //     += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o foco e diferente do cadastrado no ensaio. </li> <br>`;
          // }

          // if (treatments[0]?.assay_list.type_assay.name !== spreadSheet[row][2]) {
          //   responseIfError[0]
          //   += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o tipo de ensaio e diferente do cadastrado no ensaio. </li> <br>`;
          // }

          //           if (treatments[0]?.genotipo.name_genotipo !== spreadSheet[row][8]) {
          //             responseIfError[0]
          //               += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o genotipo e diferente do cadastrado no tratamento. </li> <br>`;
          //           }

          //           if (treatments[0]?.genotipo.name_genotipo !== spreadSheet[row][7]) {
          //             responseIfError[0]
          //               += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o status T e diferente do cadastrado no tratamento. </li> <br>`;
          //           }

          // if (String(treatments[0]?.assay_list.tecnologia.cod_tec)
          //     !== String(spreadSheet[row][3])) {
          //   responseIfError[0]
          //     += `<li style="text-align:left"> A ${row}ª linha esta incorreta, a tecnologia e diferente da cadastrada no ensaio. </li> <br>`;
          // }

          // if (treatments[0]?.assay_list.bgm !== spreadSheet[row][5]) {
          //   responseIfError[0]
          //     += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o bgm e diferente do cadastrado no ensaio. </li> <br>`;
          // }

          for (const column in spreadSheet[row]) {
            if (column === '0') { // SAFRA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status, response }: IReturnObject = await safraController.getOne(idSafra);
                if (status === 200) {
                  if (response?.safraName !== spreadSheet[row][column]) {
                    responseIfError[Number(column)]
                    += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'safra informada e diferente da selecionada',
                      );
                  }
                }
              }
            }
            if (column === '1') { // FOCO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '2') { // ENSAIO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '3') { // TECNOLOGIA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '4') { // GLI
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '5') { // BGM
              if (spreadSheet[row][column] !== null) {
                if (!validateInteger(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'precisa ser um numero inteiro e positivo',
                  );
                }
              }
            }
            if (column === '6') { // NT
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '7') { // STATUS_T
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '8') { // GENOTIPO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status } = await genotypeTreatmentController.getAll({
                  name_genotipo: spreadSheet[row][column],
                });
                if (status === 400) {
                  responseIfError[Number(column)]
                    += responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                }
              }
            }
            if (column === '9') { // NCA
              if (treatments[0]?.lote) {
                if (Number(treatments[0]?.lote?.ncc) !== Number(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'não é o mesmo desse tratamento de genótipo',
                  );
                }
              }
            }
            if (column === '10') { // GENOTIPO NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'o campo é obrigatório, caso queira substituir apenas nca apenas replique os genotipos',
                );
              } else {
                const { status } = await genotipoController.getAll({
                  name_genotipo: spreadSheet[row][column],
                });
                if (status === 400) {
                  responseIfError[Number(column)]
                    += responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                }
              }
            }
            if (column === '11') { // STATUS T NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] !== 'L' && spreadSheet[row][column] !== 'T') {
                responseIfError[Number(column)]
                  += responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'Valor só pode ser  "T" ou "L"');
              }
            }
            if (column === '12') { // NCA NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status: loteStatus } = await loteController.getAll({
                  ncc: Number(spreadSheet[row][column]),
                });
                if (loteStatus === 400) {
                  responseIfError[Number(column)]
                    += responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                } else {
                  const { status, response } = await genotipoController.getAll({
                    name_genotipo: spreadSheet[row][10],
                    id_culture: idCulture,
                  });
                  if (status !== 400) {
                    const validateNca = await response[0]?.lote.map((item: any) => {
                      if (Number(item?.ncc) == Number(spreadSheet[row][column])) return true;
                      return false;
                    });

                    if (!validateNca?.includes(true)) {
                      responseIfError[Number(column)]
                        += responseGenericFactory(
                          (Number(column) + 1),
                          row,
                          spreadSheet[0][column],
                          'o nca não pertence a esse genotipo',
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
          await transactionConfig.transactionScope.run(async () => {
            for (const row in spreadSheet) {
              if (row !== '0') {
                const { response: treatment } = await genotypeTreatmentController.getAll({
                  gli: spreadSheet[row][4],
                  treatments_number: spreadSheet[row][6],
                  name_genotipo: spreadSheet[row][8],
                  nca: spreadSheet[row][9],
                });
                const { response: genotipo } = await genotipoController.getAll({
                  name_genotipo: spreadSheet[row][10],
                });
                const { response: lote } = await loteController.getAll({
                  ncc: spreadSheet[row][12],
                });
                await genotypeTreatmentRepository.updateTransaction(
                  treatment[0]?.id,
                  {
                    id: treatment[0]?.id,
                    id_genotipo: genotipo[0]?.id,
                    id_lote: lote[0]?.id,
                    status: spreadSheet[row][11],
                  },
                );
                await historyGenotypeTreatmentRepository.createTransaction({
                  gli: spreadSheet[row][4],
                  safra: spreadSheet[row][0],
                  foco: spreadSheet[row][1],
                  ensaio: spreadSheet[row][2],
                  tecnologia: spreadSheet[row][3],
                  bgm: Number(spreadSheet[row][5]),
                  nt: Number(spreadSheet[row][6]),
                  status: spreadSheet[row][7],
                  genotipo: spreadSheet[row][8],
                  nca: Number(spreadSheet[row][9]),
                  created_by: createdBy,
                });
              }
            }
          });

          await logImportController.update({
            id: idLog, status: 1, state: 'SUCESSO', updated_at: new Date(Date.now()),
          });
          return { status: 200, message: 'Tratamento de genótipo importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({
            id: idLog, status: 1, state: 'FALHA', updated_at: new Date(Date.now()),
          });
          handleError('Tratamento de genótipo controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de tratamento de genótipo' };
        }
      }
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      await logImportController.update({
        id: idLog, status: 1, state: 'INVALIDA', updated_at: new Date(Date.now()), invalid_data: responseStringError,
      });
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({
        id: idLog, status: 1, state: 'FALHA', updated_at: new Date(Date.now()),
      });
      handleError('Tratamento de genótipo controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de tratamento de genótipo' };
    }
  }
}
