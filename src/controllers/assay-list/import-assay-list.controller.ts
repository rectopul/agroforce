/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import handleError from '../../shared/utils/handleError';
import { validateInteger } from '../../shared/utils/numberValidate';
import { responseGenericFactory, responseNullFactory } from '../../shared/utils/responseErrorFactory';
import { CulturaController } from '../cultura.controller';
import { FocoController } from '../foco.controller';
import { GenotypeTreatmentController } from '../genotype-treatment/genotype-treatment.controller';
import { GenotipoController } from '../genotype/genotipo.controller';
import { LogImportController } from '../log-import.controller';
import { LoteController } from '../lote.controller';
import { SafraController } from '../safra.controller';
import { TecnologiaController } from '../technology/tecnologia.controller';
import { TypeAssayController } from '../tipo-ensaio.controller';
import { AssayListController } from './assay-list.controller';

export class ImportAssayListController {
  static async validate(
    idLog: number,
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
    const genotypeTreatmentController = new GenotypeTreatmentController();

    const responseIfError: any = [];
    try {


      for (const row in spreadSheet) {
        if (row !== '0') {
          for (const column in spreadSheet[row]) {
            // Validação do campo Cultura
            if (column === '0') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              const {
                response,
              }: any = await culturaController.getOneCulture(Number(idCulture));
              if (response?.name !== spreadSheet[row][column]) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'a cultura e diferente da selecionada',
                );
              }
            }

            // Validação do campo Safra
            if (column === '1') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              const { response }: IReturnObject = await safraController.getOne(idSafra);
              if (response?.safraName !== String(spreadSheet[row][column])) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'a safra informada e diferente da selecionada',
                  );
              }
            }
            // Validação do campo Foco
            if (column === '2') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              const { response }: IReturnObject = await focoController.getAll({
                name: spreadSheet[row][column],
                id_culture: idCulture,
              });
              if (response?.length === 0) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'o foco informado não existe no sistema',
                  );
              }
            }
            // Validação do campo Tipo de Ensaio
            if (column === '3') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              const { response }: IReturnObject = await typeAssayController.getAll({
                filterName: spreadSheet[row][column],
                id_culture: idCulture,
              });
              if (response?.length === 0) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'o tipo de ensaio informado não existe no sistema',
                  );
              }
            }
            // Validação GLI
            if (column === '4') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              const { response }: IReturnObject = await assayListController.getAll({
                filterGli: spreadSheet[row][4],
                id_safra: idSafra,
              });
              if (response[0]?.status === 'UTILIZADO') {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'o ensaio já foi utilizado, não e possível alterar',
                  );
              }
            }
            // Validação do campo código da tecnologia
            if (column === '5') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              if ((typeof (spreadSheet[row][column])) === 'number' && spreadSheet[row][column].toString().length < 2) {
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
                    row,
                    spreadSheet[0][column],
                    'a tecnologia informado não existe no sistema',
                  );
              }
            }
            // Validação do campo BGM
            if (column === '6') {
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
            // Validação do campo PRJ
            if (column === '7') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            // Validação do campo número de tratamento
            if (column === '8') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              if (row === '1') {
                if (Number(spreadSheet[row][column]) !== 1) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
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
                    row,
                    spreadSheet[0][column],
                    'o número de tratamento não está sequencial',
                  );
              } else if (spreadSheet[Number(row) - 1][4] !== spreadSheet[row][4]
               && Number(spreadSheet[row][column]) !== 1) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'cada ensaio deve ter tratamentos sequenciais começados em 1',
                  );
              }
            }
            // Validação do campo status
            if (column === '9') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              if ((spreadSheet[row][column] !== 'T' && spreadSheet[row][column] !== 'L')) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    row,
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
                      row,
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
        let productivity: number = 0;
        let advance: number = 0;
        let register: number = 0;
        let verifyToDelete: boolean = false;
        try {
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
              console.log("spreadSheet[row][11]  ",spreadSheet[row][11]);
              console.log("technology  ",technology);
              console.log("idCulture  ",idCulture );
              console.log("genotype  ",genotype[0]?.id );

              const { response: lote }: IReturnObject = await loteController.getAll({
                filterNcc: spreadSheet[row][11] || '0',
              });

              // console.log("lote   ",lote);
              // return false;
              const { response: assayList }: IReturnObject = await assayListController.getAll({
                filterGli: spreadSheet[row][4],
                id_safra: idSafra,
              });
              let savedAssayList: any;
              if (assayList.length === 0) {
                savedAssayList = await assayListController.create({
                  id_safra: idSafra,
                  id_foco: foco[0]?.id,
                  id_type_assay: typeAssay[0]?.id,
                  id_tecnologia: technology[0]?.id,
                  gli: spreadSheet[row][4],
                  bgm: String(spreadSheet[row][6]),
                  project: String(spreadSheet[row][7]),
                  created_by: createdBy,
                });
                await genotypeTreatmentController.create({
                  id_safra: idSafra,
                  id_assay_list: savedAssayList.response?.id,
                  id_genotipo: genotype[0]?.id,
                  id_lote: lote[0]?.id,
                  treatments_number: spreadSheet[row][8],
                  status: spreadSheet[row][9],
                  comments: spreadSheet[row][14] || '',
                  created_by: createdBy,
                });
              } else {
                if (Number(spreadSheet[row][8]) === 1) {
                  verifyToDelete = true;
                }
                savedAssayList = await assayListController.update({
                  id: assayList[0]?.id,
                  id_safra: idSafra,
                  id_foco: foco[0]?.id,
                  id_type_assay: typeAssay[0]?.id,
                  id_tecnologia: technology[0]?.id,
                  gli: spreadSheet[row][4],
                  bgm: String(spreadSheet[row][6]),
                  project: String(spreadSheet[row][7]),
                  created_by: createdBy,
                });
                if (verifyToDelete) {
                  await genotypeTreatmentController.deleteAll(Number(savedAssayList.response?.id));
                  verifyToDelete = false;
                }
                await genotypeTreatmentController.create({
                  id_safra: idSafra,
                  id_assay_list: savedAssayList.response?.id,
                  id_genotipo: genotype[0]?.id,
                  id_lote: lote[0]?.id,
                  treatments_number: spreadSheet[row][8],
                  comments: spreadSheet[row][14] || '',
                  status: spreadSheet[row][9],
                  created_by: createdBy,
                });
              }
              if (savedAssayList.status === 200) {
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
          await logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' });
          return { status: 200, message: `Ensaios importados (${String(register)}). Produtividade x Avanço (${String(productivity)} x ${String(advance)}) ` };
        } catch (error: any) {
          await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
          handleError('Lista de ensaio controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de Lista de ensaio' };
        }
      }
      await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('Lista de ensaio controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de Lista de ensaio' };
    }
  }
}
