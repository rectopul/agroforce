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
import { ExperimentController } from '../experiment/experiment.controller';
import { ExperimentGenotipeController } from '../experiment_genotipe.controller';
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
    // const assayListController = new AssayListController();
    const logImportController = new LogImportController();
    const genotypeTreatmentController = new GenotypeTreatmentController();
    const historyGenotypeTreatmentController = new HistoryGenotypeTreatmentController();
    const experimentController = new ExperimentController();
    const experimentGenotipeController = new ExperimentGenotipeController();

    
    const responseIfError: Array<string> = [];

    try {

      const value_hold : any = {};

      if(spreadSheet.length == 0){
        responseIfError[0]
        += `<li style="text-align:left"> Não há registros por favor verifique. </li> <br>`;
      }

      for (const row in spreadSheet) {
        // console.log("row ",row);

        if (row !== '0') { 
          // experiments
          if(spreadSheet[row][5] != null){
           const experiments : any = await experimentController.getFromExpName(spreadSheet[row][5]);

           if (experiments.status== 200 && experiments.response.length > 0){
            
            value_hold.idExperiment = experiments.response[0]?.id;

            if (experiments.response[0]?.local.name_local_culture != spreadSheet[row][6]) {
              responseIfError[0]
                += `<li style="text-align:left"> A ${row}ª linha esta incorreta, a Lugar de plantio e diferente da cadastrada no experimento. </li> <br>`;
            }

            if (experiments.response[0]?.delineamento.name != spreadSheet[row][7]) {
              responseIfError[0]
                += `<li style="text-align:left"> A ${row}ª linha esta incorreta, a delineamento e diferente da cadastrada no experimento. </li> <br>`;
            }


          }else{
            responseIfError[0]
                += `<li style="text-align:left"> A ${row}ª linha está incorreta, o experimento é diferente do registrado no experimento </li> <br>`;
          }
          }
          else{
            responseIfError[0]
            += `<li style="text-align:left"> A ${row}ª linha está vazia para para o experimento </li> <br>`;
          }
         
         
          for (const column in spreadSheet[row]) {
            if (column === '0') { // SAFRA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }

              const { response: treatment } = await experimentGenotipeController.getAll({
                safraName: spreadSheet[row][0], 
              });
            
              if(treatment.length == 0){

                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'está incorreta, o Safra é diferente do registrado no experimento',
                );
           
              }
            }
            if (column === '1') { // FOCO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }

              const { response: treatment } = await experimentGenotipeController.getAll({
                filterFoco: spreadSheet[row][1], 
              });
              
              if(treatment.length == 0){  

                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'está incorreta, o foco é diferente do registrado no experimento',
                );

              }

            }
            if (column === '2') { // ENSAIO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }

              const { response: treatment } = await experimentGenotipeController.getAll({
                ensaio: spreadSheet[row][2], 
              });
              
              if(treatment.length == 0){  

                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'está incorreta, o ensaio é diferente do registrado no experimento',
                );

              }


            }
            if (column === '3') { // TECNOLOGIA
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              else{
                const { response: treatment } = await experimentGenotipeController.getAll({
                  filterCodTec: spreadSheet[row][3], 
                });

                if(treatment.length == 0){  

                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    ' está incorreta, o Cód Tecnologia é diferente do registrado no experimento ',
                  );
              
                }
              }
            }
            if (column === '4') { // GLI
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              const { response: treatment } = await experimentGenotipeController.getAll({
                gli: spreadSheet[row][4], 
              });

              if(treatment.length == 0){  

                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'está incorreta, o GLI é diferente do registrado no experimento ',
                );

              }
            }
          
            if (column === '9') { // NT
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              else{

            //     console.log("dsfsd  ",
            //  {   nt: Number(spreadSheet[row][9]), 
            //     gli: spreadSheet[row][4],
            //     // treatments_number: spreadSheet[row][8], //Nt Value
            //     idExperiment : value_hold.idExperiment,
            //     npe:  spreadSheet[row][10],                 
            //     rep: spreadSheet[row][8],
            // })

                const { response: treatment } = await experimentGenotipeController.getAll({
                    nt: Number(spreadSheet[row][9]), 
                    gli: spreadSheet[row][4],
                    // treatments_number: spreadSheet[row][8], //Nt Value
                    idExperiment : value_hold.idExperiment,
                    npe:  spreadSheet[row][10],                 
                    rep: spreadSheet[row][8],
                });
              
               
                if(treatment.length == 0){  

                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    ' está incorreta, o NT é diferente do registrado no experimento',
                  );

                }

                value_hold.nt = spreadSheet[row][9];
              }


            
            }


            if (column === '10') { // NPE
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              else{

                const { response: treatment } = await experimentGenotipeController.getAll({
                  npe: spreadSheet[row][10], 
                });
              
              
                if(treatment.length == 0){

                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    ' está incorreta, o NPE é diferente do registrado no experimento',
                  );
                  
                }

                value_hold.npe = spreadSheet[row][10];
  
              }
            }

            if (column === '11') { // STATUS_T
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              
            }
            if (column === '12') { // GENOTIPO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
              
                const { status }: any = await genotipoController.getOneByName(spreadSheet[row][12]);

                if (status === 400) {
                  responseIfError[Number(column)]
                    += responseDoesNotExist((Number(column) + 1), row, spreadSheet[0][column]);
                }
              }
            }
            if (column === '13') { // NCA
             
              if(spreadSheet[row][column] != null) {
                const { status,response } = await loteController.getAll({
                  ncc: String(spreadSheet[row][column]),
                  filterGenotipo: String(spreadSheet[row][12]),
                });
              
                if (status === 400) {
               
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    ' não pertence ao nome genérico',
                  );
                } 
                value_hold.idLote = response[0]?.id;
              }
            }
           
            if (column === '14') { // STATUS T NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (spreadSheet[row][column] !== 'L' && spreadSheet[row][column] !== 'T') {
                responseIfError[Number(column)]
                  += responseGenericFactory((Number(column) + 1), row, spreadSheet[0][column], 'Valor só pode ser  "T" ou "L"');
              }
            }

            if (column === '15') { // GENOTIPO NOVO
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

            if (column === '16') { // NCA NOVO
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                
                const { response: lote } = await loteController.getAll({
                  ncc: spreadSheet[row][16],   //NEW NCA
                  filterGenotipo: spreadSheet[row][15], // new geneticName
                });

                
                if(lote.length == 0)
                {                     
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'não está correto para este novo nome genético',
                  );

                }
               
              }
            }
          }
        }
        // else if(row === '0'){
        //   responseIfError[0]
        //   += `<li style="text-align:left"> A ${row}ª Não há registros por favor verifique. </li> <br>`;
        // }
      }


      
      // return false;
      if (responseIfError.length === 0) {
        try {
          for (const row in spreadSheet) {
            if (row !== '0') {

              const { response: treatment } = await experimentGenotipeController.getAll({
                  nt: Number(spreadSheet[row][9]), 
                  gli: spreadSheet[row][4],
                  treatments_number: spreadSheet[row][8], //Nt Value
                  idExperiment : value_hold.idExperiment,
                  npe:  spreadSheet[row][10],                 
                  rep: spreadSheet[row][8],
                });

              const { response: genotipo } = await genotipoController.getAll({
                name_genotipo: spreadSheet[row][15], //New genetic Name
              });

              const { response: lote } = await loteController.getAll({
                ncc: spreadSheet[row][16],   //NEW NCA
                filterGenotipo: spreadSheet[row][15], // new geneticName
              });

             

              const response12  = await experimentGenotipeController.updateData({
              id: treatment[0]?.id,
              gli: spreadSheet[row][4],
              idExperiment : value_hold.idExperiment,
              nt:   Number(spreadSheet[row][9]),
              rep: spreadSheet[row][8],
              status_t: spreadSheet[row][14],
              idGenotipo : lote[0]?.id_genotipo,
              idLote : lote[0]?.id,
              nca :  spreadSheet[row][16].toString()
              }); 
              
              // console.log("response---- ",{
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
              // console.log("response12   ",response12);
           
            }
          }
          return { status: 200, message: 'Genotic de genótipo importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
          handleError('Tratamento de genótipo controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha Experiment de genótipo' };
        }
      }
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('Experimento de genótipo controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de tratamento de genótipo' };
    }
  }
}
