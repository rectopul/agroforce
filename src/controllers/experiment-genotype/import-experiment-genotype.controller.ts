/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import {TransactionConfig} from 'src/shared/prisma/transactionConfig';
import {ImportValidate, IReturnObject} from '../../interfaces/shared/Import.interface';
import handleError from '../../shared/utils/handleError';
import {
  responseNullFactory,
  responseGenericFactory,
  responseDoesNotExist,
} from '../../shared/utils/responseErrorFactory';
import {AssayListController} from '../assay-list/assay-list.controller';
import {ExperimentController} from '../experiment/experiment.controller';
import {ExperimentGenotipeController} from '../experiment-genotipe.controller';
import {GenotipoController} from '../genotype/genotipo.controller';
import {LogImportController} from '../log-import.controller';
import {LoteController} from '../lote.controller';

import {ExperimentGenotipeRepository} from '../../repository/experiment-genotipe.repository';
import {SafraController} from '../safra.controller';

export class ImportExperimentGenotypeController {
  static async validate(
    idLog: number,
    {spreadSheet, idSafra, created_by: createdBy}: ImportValidate,
  ): Promise<IReturnObject> {
    const safraController = new SafraController();
    const loteController = new LoteController();
    const genotipoController = new GenotipoController();
    // const assayListController = new AssayListController();
    const logImportController = new LogImportController();
    const experimentController = new ExperimentController();
    const experimentGenotipeController = new ExperimentGenotipeController();

    /* --------- Transcation Context --------- */
    const transactionConfig = new TransactionConfig();
    const experimentGenotipeRepository = new ExperimentGenotipeRepository();

    experimentGenotipeRepository.setTransaction(transactionConfig.clientManager, transactionConfig.transactionScope);
    /* --------------------------------------- */

    const responseIfError: Array<string> = [];
    try {
      const value_hold: any = {};

      if (spreadSheet.length == 0) {
        responseIfError[0]
          += '<li style="text-align:left"> Não há registros por favor verifique. </li> <br>';
      }

      for (const row in spreadSheet) {

        let linhaStr = String(Number(row) + 1);
        
        if (row !== '0') {
          // experiments
          // if (spreadSheet[row][5] != null) {
          //   const experiments: any = await experimentController.getFromExpName(spreadSheet[row][5]);
          //   if (experiments.status == 200 && experiments.response.length > 0) {
          //     value_hold.idExperiment = experiments.response[0]?.id;
          //     if (experiments.response[0]?.local.name_local_culture != spreadSheet[row][6]) {
          //       responseIfError[0]
          //         += `<li style="text-align:left"> A ${row}ª linha esta incorreta, a Lugar de plantio e diferente da cadastrada no experimento. </li> <br>`;
          //     }
          //     if (experiments.response[0]?.delineamento.name != spreadSheet[row][7]) {
          //       responseIfError[0]
          //         += `<li style="text-align:left"> A ${row}ª linha esta incorreta, a delineamento e diferente da cadastrada no experimento. </li> <br>`;
          //     }
          //   } else {
          //     responseIfError[0]
          //       += `<li style="text-align:left"> A ${row}ª linha está incorreta, o experimento é diferente do registrado no experimento </li> <br>`;
          //   }
          // } else {
          //   responseIfError[0]
          //     += `<li style="text-align:left"> A ${row}ª linha está vazia para para o experimento </li> <br>`;
          // }

          if (spreadSheet[row][3]?.toString().length < 2) {
            // eslint-disable-next-line no-param-reassign
            spreadSheet[row][3] = `0${spreadSheet[row][3]}`;
          }

          const {
            response: parcels,
          }: any = await experimentGenotipeController.getAll({
            filterFoco: spreadSheet[row][1],
            filterTypeAssay: spreadSheet[row][2],
            filterCodTec: spreadSheet[row][3],
            filterGli: spreadSheet[row][4],
            filterExperimentName: spreadSheet[row][5],
            filterLocal: spreadSheet[row][6],
            filterDelineamento: spreadSheet[row][7],
            rep: spreadSheet[row][8],
            nt: spreadSheet[row][9],
            npe: spreadSheet[row][10],
            filterStatusT: spreadSheet[row][11],
            filterGenotypeName: spreadSheet[row][12],
            nca: String(spreadSheet[row][13]),
            take: 1,
            importValidate: true,
          });

          if (parcels.length === 0) {
            responseIfError[0]
              += `<li style="text-align:left"> A ${linhaStr}ª linha esta incorreta, parcela do experimento não encontrada, as chaves para encontra-lo são (
              FOCO, TIPO DE ENSAIO, TECNOLOGIA, GLI, NOME DO EXPERIMENTO, LOCAL, DELINEAMENTO, REP, NT, NPE, STATUS_T, GENÓTIPO E NCA
              ) </li> <br>`;
          } else if (parcels[0].status === 'IMPRESSO') {
            responseIfError[0]
              += `<li style="text-align:left"> A ${linhaStr}ª linha esta incorreta, a parcela já foi impressa e não pode ser substituída
              ) </li> <br>`;
          }

          for (const column in spreadSheet[row]) {
            
            if (column === '0') { // SAFRA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]);
              }
              const {status, response}: IReturnObject = await safraController.getOne(idSafra);
              if (status === 200) {
                if (response?.safraName?.toUpperCase()
                  !== spreadSheet[row][column]?.toUpperCase()) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                    (Number(column) + 1),
                    linhaStr,
                    spreadSheet[0][column],
                    'safra informada e diferente da selecionada',
                  );
                }
              }

            }
            if (column === '1') { // FOCO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              }

            }
            if (column === '2') { // ENSAIO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              }

            }
            if (column === '3') { // TECNOLOGIA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              } else {
                // const { response: treatment } = await experimentGenotipeController.getAll({
                //   filterCodTec: spreadSheet[row][column],
                //   idExperiment: value_hold.idExperiment,
                //   take: 1,
                // });
                
                // if (treatment.length == 0) {
                //   responseIfError[Number(column)] += responseGenericFactory(
                //     Number(column) + 1,
                //     linhaStr,
                //     spreadSheet[0][column],
                //     ' está incorreta, o Cód Tecnologia é diferente do registrado no experimento ',
                //   );
                // }
              }
            }
            if (column === '4') { // GLI
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              }
              // const { response: treatment } = await experimentGenotipeController.getAll({
              //   gli: spreadSheet[row][4],
              //   idExperiment: value_hold.idExperiment,
              //   take: 1,
              // });

              // if (treatment.length == 0) {
              //   responseIfError[Number(column)] += responseGenericFactory(
              //     Number(column) + 1,
              //     linhaStr,
              //     spreadSheet[0][column],
              //     'está incorreta, o GLI é diferente do registrado no experimento ',
              //   );
              // }
            }
            if (column === '9') { // NT
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              } else {
                // const { response: treatment } = await experimentGenotipeController.getAll({
                //   nt: Number(spreadSheet[row][9]),
                //   idExperiment: value_hold.idExperiment,
                //   take: 1,
                // });

                // if (treatment.length == 0) {
                //   responseIfError[Number(column)] += responseGenericFactory(
                //     Number(column) + 1,
                //     linhaStr,
                //     spreadSheet[0][column],
                //     ' está incorreta, o NT é diferente do registrado no experimento',
                //   );
                // }

                value_hold.nt = spreadSheet[row][9];
              }
            }
            if (column === '10') { // NPE
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              } else {
                // const { response: treatment } = await experimentGenotipeController.getAll({
                //   npe: spreadSheet[row][column],
                //   idExperiment: value_hold.idExperiment,
                //   take: 1,
                // });

                // if (treatment.length == 0) {
                //   responseIfError[Number(column)] += responseGenericFactory(
                //     Number(column) + 1,
                //     linhaStr,
                //     spreadSheet[0][column],
                //     ' está incorreta, o NPE é diferente do registrado no experimento',
                //   );
                // }

                value_hold.npe = spreadSheet[row][column];
              }
            }

            if (column === '12') { // GENOTIPO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              } else {
                // const { status }: any = await genotipoController.getOneByName(spreadSheet[row][12]);
                // if (status === 400) {
                //   responseIfError[Number(column)]
                //     += responseDoesNotExist((Number(column) + 1), linhaStr, spreadSheet[0][column]);
                // }
              }
            }
            if (column === '13') { // NCA
              if (spreadSheet[row][column] != null) {
                const {status, response} = await loteController.getAll({
                  ncc: String(spreadSheet[row][column]),
                  filterGenotipo: String(spreadSheet[row][12]),
                  idExperiment: value_hold.idExperiment,
                });

                // if (status === 400) {
                //   responseIfError[Number(column)] += responseGenericFactory(
                //     Number(column) + 1,
                //     linhaStr,
                //     spreadSheet[0][column],
                //     ' não pertence ao nome genérico',
                //   );
                // }
                value_hold.idLote = response[0]?.id;
              }
            }
            if (column === '14') { // GENOTIPO NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  linhaStr,
                  spreadSheet[0][column],
                  'o campo é obrigatório, caso queira substituir apenas nca apenas replique os genotipos',
                );
              } else {
                const {status} = await genotipoController.getAll({
                  name_genotipo: spreadSheet[row][column],
                  importValidate: true,
                });
                if (status === 400) {
                  responseIfError[Number(column)]
                    += responseDoesNotExist(
                    (Number(column) + 1),
                    linhaStr,
                    spreadSheet[0][column]);
                }
              }
            }
            if (column === '15') { // STATUS T NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              } else if (spreadSheet[row][column] !== 'L' && spreadSheet[row][column] !== 'T') {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column],
                  'Valor só pode ser  "T" ou "L"');
              }
            }
            if (column === '16') { // NCA NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                  (Number(column) + 1),
                  linhaStr,
                  spreadSheet[0][column]
                );
              } else {
                const {response: lote} = await loteController.getAll({
                  ncc: spreadSheet[row][16], // NEW NCA
                  filterGenotipo: spreadSheet[row][14], // new geneticName
                });

                if (lote.length == 0) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    linhaStr,
                    spreadSheet[0][column],
                    'não está correto para este novo nome genético',
                  );
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
                const {response: treatment} = await experimentGenotipeController.getAll({
                  filterFoco: spreadSheet[row][1],
                  filterTypeAssay: spreadSheet[row][2],
                  filterCodTec: spreadSheet[row][3],
                  // filterGli: spreadSheet[row][4],
                  filterExperimentName: spreadSheet[row][5],
                  filterLocal: spreadSheet[row][6],
                  filterDelineamento: spreadSheet[row][7],
                  rep: spreadSheet[row][8],
                  nt: spreadSheet[row][9],
                  npe: spreadSheet[row][10],
                  filterStatusT: spreadSheet[row][11],
                  filterGenotypeName: spreadSheet[row][12],
                  nca: String(spreadSheet[row][13]),
                  take: 1,
                  importValidate: true,
                });

                const {response: genotipo} = await genotipoController.getAll({
                  name_genotipo: spreadSheet[row][14], // New genetic Name
                  importValidate: true,
                });

                const {response: lote} = await loteController.getAll({
                  ncc: spreadSheet[row][16], // NEW NCA
                  filterGenotipo: spreadSheet[row][14], // new geneticName
                });

                const response12 = await experimentGenotipeRepository.updateTransaction(treatment[0]?.id, {
                  id: treatment[0]?.id,
                  // gli: spreadSheet[row][4],
                  // idExperiment: value_hold.idExperiment,
                  // nt: Number(spreadSheet[row][9]),
                  // rep: spreadSheet[row][8],
                  status_t: spreadSheet[row][15],
                  idGenotipo: lote[0]?.id_genotipo,
                  idLote: lote[0]?.id,
                  nca: spreadSheet[row][16].toString(),
                });

                //   id: treatment[0]?.id,
                //   gli: spreadSheet[row][4],
                //   idExperiment : value_hold.idExperiment,
                //   nt:  value_hold.nt,
                //   rep: spreadSheet[row][8],
                //   // status_t: spreadSheet[row][14],
                //   idGenotipo : lote[0]?.id_genotipo,
                //   idLote : lote[0]?.id,
                //   nca :  spreadSheet[row][16].toString()
                //   });
              }
            }
          });
          await logImportController.update({
            id: idLog, status: 1, state: 'SUCESSO', updated_at: new Date(Date.now()),
          });
          return {status: 200, message: 'Sub. de parcelas importado com sucesso'};
        } catch (error: any) {
          await logImportController.update({
            id: idLog, 
            status: 1, 
            state: 'FALHA', 
            updated_at: new Date(Date.now()),
          });
          handleError('Sub. de parcelas controller', 'Save Import', error.message);
          return {status: 500, message: 'Erro ao salvar planilha de Sub. de parcelas'};
        }
      }
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      await logImportController.update({
        id: idLog, status: 1, state: 'INVALIDA', updated_at: new Date(Date.now()), invalid_data: responseStringError,
      });
      return {status: 400, message: responseStringError};
    } catch (error: any) {
      await logImportController.update({
        id: idLog, status: 1, state: 'FALHA', updated_at: new Date(Date.now()),
      });
      handleError('Sub. de parcelas controller', 'Validate Import', error.message);
      return {status: 500, message: 'Erro ao validar planilha de Sub. de parcelas'};
    }
  }
}
