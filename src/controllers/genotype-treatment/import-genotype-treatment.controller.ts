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
import { AssayListController } from '../assay-list.controller';
import { GenotipoController } from '../genotype/genotipo.controller';
import { LoteController } from '../lote.controller';
import { GenotypeTreatmentController } from './genotype-treatment.controller';
import { HistoryGenotypeTreatmentController } from './history-genotype-treatment.controller';

export class ImportGenotypeTreatmentController {
  static async validate({
    spreadSheet, created_by: createdBy,
  }: ImportValidate): Promise<IReturnObject> {
    const genotipoController = new GenotipoController();
    const loteController = new LoteController();
    const assayListController = new AssayListController();
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
            if ((assayList?.status.toUpperCase()) !== 'IMPORTADO') {
              responseIfError[0]
                += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o ensaio já foi sorteado </li> <br>`;
            }
          }
          const treatments: any = await genotypeTreatmentController.getAll({
            gli: spreadSheet[row][0],
            treatments_number: spreadSheet[row][6],
            status: 'IMPORTADO',
            name_genotipo: spreadSheet[row][7],
            nca: spreadSheet[row][8],
          });
          if (treatments.status === 400) {
            responseIfError[0]
              += `<li style="text-align:left"> A ${row}ª linha esta incorreta, o tratamento de genótipo não encontrado </li> <br>`;
          }
          if (treatments[0]?.assay_list.foco.name !== spreadSheet[row][2]
            || treatments[0]?.assay_list.type_assay.name !== spreadSheet[row][3]
            || treatments[0]?.assay_list.tecnologia.name !== spreadSheet[row][4]
            || treatments[0]?.assay_list.bgm !== spreadSheet[row][5]
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
              } else {
                const { status } = await genotypeTreatmentController.getAll({
                  status: spreadSheet[row][column],
                });
                if (status === 400) {
                  responseIfError[Number(column)]
                    += responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                }
              }
            }
            if (column === '11') { // NCA NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status } = await loteController.getAll({
                  ncc: spreadSheet[row][column],
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
              const { response: genotipo } = await genotipoController.getAll({
                name_genotipo: spreadSheet[row][9],
              });
              const { response: lote } = await loteController.getAll({
                ncc: spreadSheet[row][11],
              });
              await genotypeTreatmentController.update(
                {
                  id_genotipo: genotipo.id,
                  nca: lote.id,
                },
              );
              await historyGenotypeTreatmentController.create({
                gli: spreadSheet[row][0],
                safra: spreadSheet[row][1],
                foco: spreadSheet[row][2],
                ensaio: spreadSheet[row][3],
                tecnologia: spreadSheet[row][4],
                bgm: spreadSheet[row][5],
                nt: spreadSheet[row][6],
                genotipo: spreadSheet[row][7],
                nca: spreadSheet[row][8],
                created_by: createdBy,
              });
            }
          }
          return { status: 200, message: 'Tratamento de genótipo importado com sucesso' };
        } catch (error: any) {
          handleError('Tratamento de genótipo controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de tratamento de genótipo' };
        }
      }
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      handleError('Tratamento de genótipo controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de tratamento de genótipo' };
    }
  }
}
