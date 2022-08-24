/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import handleError from '../../shared/utils/handleError';
import {
  responseNullFactory,
  responseGenericFactory,
  responseDoesNotExist,
} from '../../shared/utils/responseErrorFactory';
import { AssayListController } from '../assay-list/assay-list.controller';
import { GenotipoController } from '../genotype/genotipo.controller';
import { LogImportController } from '../log-import.controller';
import { LoteController } from '../lote.controller';
import { GenotypeTreatmentController } from './genotype-treatment.controller';
import { HistoryGenotypeTreatmentController } from './history-genotype-treatment.controller';

export class ImportGenotypeTreatmentController {
  static async validate(
    idLog: number,
    { spreadSheet, created_by: createdBy }: ImportValidate,
  ): Promise<IReturnObject> {
    const loteController = new LoteController();
    const genotipoController = new GenotipoController();
    const assayListController = new AssayListController();
    const logImportController = new LogImportController();
    const genotypeTreatmentController = new GenotypeTreatmentController();
    const historyGenotypeTreatmentController = new HistoryGenotypeTreatmentController();

    const responseIfError: Array<string> = [];

    try {
      for (const row in spreadSheet) {
        if (row !== '0') { // LINHA COM TITULO DAS COLUNAS
          const { status: code, response: assayList } = await assayListController.getAll({
            gli: spreadSheet[row][0],
          });
          if (code !== 400) {
            if ((assayList[0]?.status) !== 'IMPORTADO') {
              responseIfError[0]
                += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o ensaio já foi sorteado </li> <br>`;
            }
          }
          const treatments: any = await genotypeTreatmentController.getAll({
            gli: spreadSheet[row][0],
            treatments_number: spreadSheet[row][6],
            name_genotipo: spreadSheet[row][7],
            nca: spreadSheet[row][8],
          });
          if (treatments.status === 400) {
            responseIfError[0]
              += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o tratamento de genótipo não encontrado </li> <br>`;
          }
          if (treatments.response[0]?.assay_list.foco.name !== spreadSheet[row][2]
            || treatments.response[0]?.assay_list.type_assay.name !== spreadSheet[row][3]
            || treatments.response[0]?.assay_list.tecnologia.name !== spreadSheet[row][4]
            || treatments.response[0]?.assay_list.bgm !== spreadSheet[row][5]
          ) {
            responseIfError[0]
              += `<li style="text-align:left"> A ${row}ª linha esta incorreta, as informações são diferentes das cadastradas. </li> <br>`;
          }
          for (const column in spreadSheet[row]) {
            if (column === '0') { // GLI
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '1') { // SAFRA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '2') { // FOCO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '3') { // ENSAIO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '4') { // TECNOLOGIA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '5') { // BGM
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '6') { // NT
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }
            if (column === '7') { // GENOTIPO
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
            if (column === '8') { // NCA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status } = await genotypeTreatmentController.getAll({
                  nca: String(spreadSheet[row][column]),
                });
                if (status === 400) {
                  responseIfError[Number(column)]
                    += responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                }
              }
            }
            if (column === '9') { // GENOTIPO NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
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
            if (column === '10') { // STATUS T NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] !== 'L' && spreadSheet[row][column] !== 'T') {
                responseIfError[Number(column)]
                  += responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'Valor só pode ser  "T" ou "L"');
              }
            }
            if (column === '11') { // NCA NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status } = await loteController.getAll({
                  ncc: Number(spreadSheet[row][column]),
                });
                if (status === 400) {
                  responseIfError[Number(column)]
                    += responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                }
              }
            }
          }
        }
      }

      if (responseIfError.length === 0) {
        try {
          for (const row in spreadSheet) {
            if (row !== '0') {
              const { response: treatment } = await genotypeTreatmentController.getAll({
                gli: spreadSheet[row][0],
                treatments_number: spreadSheet[row][6],
                name_genotipo: spreadSheet[row][7],
                nca: spreadSheet[row][8],
              });
              const { response: genotipo } = await genotipoController.getAll({
                name_genotipo: spreadSheet[row][9],
              });
              const { response: lote } = await loteController.getAll({
                ncc: spreadSheet[row][11],
              });
              await genotypeTreatmentController.update(
                {
                  id: treatment[0]?.id,
                  id_genotipo: genotipo[0]?.id,
                  id_lote: lote[0]?.id,
                },
              );
              await historyGenotypeTreatmentController.create({
                gli: spreadSheet[row][0],
                safra: spreadSheet[row][1],
                foco: spreadSheet[row][2],
                ensaio: spreadSheet[row][3],
                tecnologia: spreadSheet[row][4],
                bgm: Number(spreadSheet[row][5]),
                nt: Number(spreadSheet[row][6]),
                genotipo: spreadSheet[row][7],
                nca: Number(spreadSheet[row][8]),
                created_by: createdBy,
              });
            }
          }
          await logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' });
          return { status: 200, message: 'Tratamento de genótipo importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
          handleError('Tratamento de genótipo controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de tratamento de genótipo' };
        }
      }
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('Tratamento de genótipo controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de tratamento de genótipo' };
    }
  }
}
