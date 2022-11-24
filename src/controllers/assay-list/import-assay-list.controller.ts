/* eslint-disable no-restricted-globals */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

import { GenotypeTreatmentRepository } from 'src/repository/genotype-treatment/genotype-treatment.repository';
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import { AssayListRepository } from '../../repository/assay-list.repository';
import { TransactionConfig } from '../../shared/prisma/transactionConfig';
import handleError from '../../shared/utils/handleError';
import { responseGenericFactory, responseNullFactory, responsePositiveNumericFactory } from '../../shared/utils/responseErrorFactory';
import { validateHeaders } from '../../shared/utils/validateHeaders';
import { CulturaController } from '../cultura.controller';
import { FocoController } from '../foco.controller';
import { GenotypeTreatmentController } from '../genotype-treatment/genotype-treatment.controller';
import { GenotipoController } from '../genotype/genotipo.controller';
import { LogImportController } from '../log-import.controller';
import { LoteController } from '../lote.controller';
import { SafraController } from '../safra.controller';
import { TecnologiaController } from '../technology/tecnologia.controller';
import { TypeAssayController } from '../tipo-ensaio.controller';
import { assayListQueue } from './assay-list-queue';
import { AssayListController } from './assay-list.controller';

export class ImportAssayListController {
  static async validate(
    idLog: number,
    queueProcessing: boolean,
    {
      spreadSheet, idSafra, idCulture, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const focoController = new FocoController();
    const loteController = new LoteController();
    const safraController = new SafraController();
    const culturaController = new CulturaController();
    const genotipoController = new GenotipoController();
    const logImportController = new LogImportController();
    const assayListController = new AssayListController();
    const typeAssayController = new TypeAssayController();
    const tecnologiaController = new TecnologiaController();

    const responseIfError: any = [];
    const headers = [
      'CULTURA',
      'SAFRA',
      'FOCO',
      'ENSAIO',
      'GLI',
      'GGEN',
      'BGM',
      'PROJETO',
      'NT',
      'STATUS',
      'GENOTIPO',
      'NCA',
      'OBS',
    ];

    try {
      const validate: any = await validateHeaders(spreadSheet, headers);
      if (validate.length > 0) {
        await logImportController.update({
          id: idLog,
          status: 1,
          state: 'INVALIDA',
        });
        return { status: 400, message: validate };
      }

      if ((spreadSheet.length > Number(process.env.MAX_DIRECT_UPLOAD_ALLOWED))
            && !queueProcessing) {
        assayListQueue.add({
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
      for (const count in spreadSheet) {
        spreadSheet[count].push(Number(count));
      }
      const header = spreadSheet.shift();
      // eslint-disable-next-line no-param-reassign
      spreadSheet = await this.orderByGLI(spreadSheet);

      spreadSheet.unshift(header);
      for (const row in spreadSheet) {
        if (row !== '0') {
          for (const column in spreadSheet[row]) {
            // Validação do campo Cultura
            if (column === '0') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                  );
              }
              const {
                response,
              }: any = await culturaController.getOneCulture(Number(idCulture));
              if (response?.name !== spreadSheet[row][column]) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  spreadSheet[row][spreadSheet[row].length - 1],
                  spreadSheet[0][column],
                  'a cultura e diferente da selecionada',
                );
              }
            }
            // Validação do campo Safra
            if (column === '1') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                  );
              }
              const { response }: IReturnObject = await safraController.getOne(idSafra);
              if (response?.safraName !== String(spreadSheet[row][column])) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                    'a safra informada e diferente da selecionada',
                  );
              }
            }
            // Validação do campo Foco
            if (column === '2') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                  );
              }
              const { response }: IReturnObject = await focoController.getAll({
                name: spreadSheet[row][column],
                id_culture: idCulture,
                filterStatus: 1,
              });
              if (response?.length === 0) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                    'informado não existe no sistema ou está inativo',
                  );
              }
            }
            // Validação do campo Tipo de Ensaio
            if (column === '3') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                  );
              }
              const { response }: IReturnObject = await typeAssayController.getAll({
                filterName: spreadSheet[row][column],
                id_culture: idCulture,
                filterStatus: 1,
              });
              if (response?.length === 0) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                    'o tipo de ensaio informado não existe no sistema',
                  );
              }
            }
            // Validação GLI
            if (column === '4') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                  );
              }
              const { response }: IReturnObject = await assayListController.getAll({
                filterGli: spreadSheet[row][4],
                id_safra: idSafra,
              });
              if (response?.length > 0) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                    'o ensaio já foi cadastrado, e preciso excluir para inserir de novo',
                  );
              }
              // if (response[0]?.status === 'EXP IMP.') {
              //   responseIfError[Number(column)]
              //     += responseGenericFactory(
              //       (Number(column) + 1),
              //       spreadSheet[row][spreadSheet[row].length - 1],
              //       spreadSheet[0][column],
              //       'o ensaio já foi utilizado, não e possível alterar',
              //     );
              // }
            }
            // Validação do campo código da tecnologia
            if (column === '5') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                  );
              } else if ((spreadSheet[row][column]).toString().length > 2) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][spreadSheet[row].length - 1],
                    'o limite de caracteres e 2',
                  );
              } else {
                if (spreadSheet[row][column].toString().length < 2) {
                  // eslint-disable-next-line no-param-reassign
                  spreadSheet[row][column] = `0${spreadSheet[row][column].toString()}`;
                }
                const { response }: IReturnObject = await tecnologiaController.getAll({
                  cod_tec: String(spreadSheet[row][column]),
                  id_culture: idCulture,
                });
                if (response?.length === 0) {
                  responseIfError[Number(column)]
                  += responseGenericFactory(
                      (Number(column) + 1),
                      spreadSheet[row][spreadSheet[row].length - 1],
                      spreadSheet[0][column],
                      'a tecnologia informado não existe no sistema',
                    );
                }
              }
            }
            // Validação do campo BGM
            if (column === '6') {
              if (spreadSheet[row][column] !== null) {
                if (isNaN(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responsePositiveNumericFactory(
                    Number(column) + 1,
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                  );
                }
              }
            }
            // Validação do campo PRJ
            if (column === '7') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                  );
              }
            }
            // Validação do campo número de tratamento
            if (column === '8') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                  );
              }
              if (row === '1') {
                if (Number(spreadSheet[row][column]) !== 1) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      spreadSheet[row][spreadSheet[row].length - 1],
                      spreadSheet[0][column],
                      'o numero de tratamentos precisa começar em 1',
                    );
                }
              } else if (
                (Number(spreadSheet[row][column] - 1) !== spreadSheet[Number(row) - 1][column]
                && spreadSheet[Number(row) - 1][4] === spreadSheet[row][4])
              ) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                    'o número de tratamento não está sequencial',
                  );
              } else if (spreadSheet[Number(row) - 1][4] !== spreadSheet[row][4]
               && Number(spreadSheet[row][column]) !== 1) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                    'cada ensaio deve ter tratamentos sequenciais começados em 1',
                  );
              }
            }
            // Validação do campo status
            if (column === '9') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                  );
              }
              if ((spreadSheet[row][column] !== 'T' && spreadSheet[row][column] !== 'L')) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    spreadSheet[row][spreadSheet[row].length - 1],
                    spreadSheet[0][column],
                    'o valor de status deve ser igual a T ou L',
                  );
              }
            }
            // Validação do campo nome do genótipo
            if (column === '10') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              const { response }: IReturnObject = await genotipoController.getAll({
                filterGenotipo: spreadSheet[row][column],
                id_culture: idCulture,
              });
              if (response?.length === 0) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'o genótipo informado não existe no sistema',
                  );
              }
            }
            // Validação do campo NCA
            if (column === '11') {
              if (spreadSheet[row][column] !== null) {
                const { response: genotype }: IReturnObject = await genotipoController.getAll({
                  filterGenotipo: spreadSheet[row][10],
                  id_culture: idCulture,
                });
                const { response }: IReturnObject = await loteController.getAll({
                  filterNcc: spreadSheet[row][column],
                  id_genotipo: genotype[0]?.id,
                });
                if (response?.length === 0) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      spreadSheet[row][spreadSheet[row].length - 1],
                      spreadSheet[0][column],
                      'o valor de NCA não foi encontrado no cadastro de lotes relacionado ao genótipo',
                    );
                }
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
      });
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('Lista de ensaio controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de Lista de ensaio' };
    }
  }

  private static orderByGLI(ordenanteSpreadSheet: any) {
    ordenanteSpreadSheet.sort((a: any, b: any) => a[4].localeCompare(b[4]) || a[8] - b[8]);
    return ordenanteSpreadSheet;
  }

  static async storeRecords(idLog: number, {
    spreadSheet, idSafra, idCulture, created_by: createdBy,
  }: ImportValidate) {
    const typeAssayController = new TypeAssayController();
    const focoController = new FocoController();
    const tecnologiaController = new TecnologiaController();
    const genotipoController = new GenotipoController();
    const loteController = new LoteController();
    const assayListController = new AssayListController();
    const genotypeTreatmentController = new GenotypeTreatmentController();
    const logImportController = new LogImportController();

        /* --------- Transcation Context --------- */
        const transactionConfig = new TransactionConfig();
        const assayListRepository = new AssayListRepository();
        assayListRepository.setTransaction(
          transactionConfig.clientManager,
          transactionConfig.transactionScope,
        );
        const genotypeTreatmentRepository = new GenotypeTreatmentRepository();
        genotypeTreatmentRepository.setTransaction(
          transactionConfig.clientManager,
          transactionConfig.transactionScope,
        );
        /* --------------------------------------- */

    let productivity: number = 0;
    let advance: number = 0;
    let register: number = 0;
    let verifyToDelete: boolean = false;
    try {
      await transactionConfig.transactionScope.run(async () => {
        for (const row in spreadSheet) {
          if (row !== '0') {
            const { response: typeAssay }: IReturnObject = await typeAssayController.getAll({
              filterName: spreadSheet[row][3],
            });
            const { response: foco }: IReturnObject = await focoController.getAll(
              { name: spreadSheet[row][2], id_culture: idCulture },
            );
            const { response: technology }: IReturnObject = await tecnologiaController.getAll({
              cod_tec: String(spreadSheet[row][5]),
              id_culture: idCulture,
            });
            const { response: genotype }: IReturnObject = await genotipoController.getAll({
              filterGenotipo: spreadSheet[row][10],
              id_culture: idCulture,

            });

            const { response: lote }: IReturnObject = await loteController.getAll({
              filterNcc: spreadSheet[row][11] || '0',
            });

            let savedAssayList: any;
            let savedGenotype: any;

            let where = {
              gli : spreadSheet[row][4],
              id_safra: idSafra,
            };
            let select = {
              id: true,
              id_safra: true,
              gli: true,
              treatmentsNumber: true
            };

            const assayList = await assayListRepository.findAll(where,select,undefined,undefined,undefined);
            let assayListId = assayList[0]?.id;
            let assayTreatmentsNumber = 1;

            if (assayList.total == 0) {
              savedAssayList = await assayListRepository.createTransaction({
                id_safra: idSafra,
                id_foco: foco[0]?.id,
                id_type_assay: typeAssay[0]?.id,
                id_tecnologia: technology[0]?.id,
                gli: spreadSheet[row][4],
                bgm: (spreadSheet[row][6]) ? Number(spreadSheet[row][6]) : null,
                project: String(spreadSheet[row][7]),
                created_by: createdBy,
                treatmentsNumber: assayTreatmentsNumber,
              });
              savedGenotype = await genotypeTreatmentRepository.createTransaction({
                id_safra: idSafra,
                id_assay_list: savedAssayList.id,
                id_genotipo: genotype[0]?.id,
                id_lote: lote[0]?.id,
                treatments_number: spreadSheet[row][8],
                status: spreadSheet[row][9],
                comments: spreadSheet[row][12] || '',
                created_by: createdBy,
              });
            } else {
              if (Number(spreadSheet[row][8]) === 1) {
                verifyToDelete = true;
              }

              assayTreatmentsNumber = Number(assayList[0]?.treatmentsNumber) + 1;

              savedAssayList = await assayListRepository.updateTransaction(Number(assayListId), {
                id: assayListId,
                id_safra: idSafra,
                id_foco: foco[0]?.id,
                id_type_assay: typeAssay[0]?.id,
                id_tecnologia: technology[0]?.id,
                gli: spreadSheet[row][4],
                bgm: (spreadSheet[row][6]) ? Number(spreadSheet[row][6]) : null,
                project: String(spreadSheet[row][7]),
                created_by: createdBy,
                treatmentsNumber: assayTreatmentsNumber
              });
              if (verifyToDelete) {
                await genotypeTreatmentRepository.deleteAll(Number(assayListId));
                verifyToDelete = false;
              }
              savedGenotype = await genotypeTreatmentRepository.createTransaction({
                id_safra: idSafra,
                id_assay_list: assayListId,
                id_genotipo: genotype[0]?.id,
                id_lote: lote[0]?.id,
                treatments_number: spreadSheet[row][8],
                comments: spreadSheet[row][12] || '',
                status: spreadSheet[row][9],
                created_by: createdBy,
              });
            }
            if (savedAssayList) {
              if (spreadSheet[row][4] !== spreadSheet[Number(row) - 1][4]) {
                if (spreadSheet[row][0] === 'PRODUTIVIDADE') {
                  productivity += 1;
                }
                if (spreadSheet[row][0] === 'AVANÇO') {
                  advance += 1;
                }
                register += 1;
              }
            }
          }
        }
      });
      await logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' });
      return { status: 200, message: `Ensaios importados (${String(register)}). Produtividade x Avanço (${String(productivity)} x ${String(advance)}) ` };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('Lista de ensaio controller', 'Save Import', error.message);
      return { status: 500, message: 'Erro ao salvar planilha de Lista de ensaio' };
    }
  }
}
