/* eslint-disable no-loop-func */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import handleError from '../../shared/utils/handleError';
import {
  responseNullFactory,
  responseGenericFactory,
} from '../../shared/utils/responseErrorFactory';
import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import { DelineamentoController } from './delineamento.controller';
import { LogImportController } from '../log-import.controller';
import { SequenciaDelineamentoController } from '../sequencia-delineamento.controller';
import { ImportController } from '../import.controller';

export class ImportDelimitationController {
  static async validate(
    idLog: number,
    {
      spreadSheet, idSafra, idCulture, created_by: createdBy,
    }: ImportValidate,
  ): Promise<IReturnObject> {
    const importController = new ImportController();
    const logImportController = new LogImportController();
    const delineamentoController = new DelineamentoController();
    const sequenciaDelineamentoController = new SequenciaDelineamentoController();

    const responseIfError: Array<string> = [];
    try {
      const configModule: object | any = await importController.getAll(10);
      let sorteioAnterior: number = 0;
      let tratamentoAnterior: number = 0;
      let blocoAnterior: number = 0;
      const repeticao: number = 1;
      let repeticaoAnterior: number = 0;
      let nomeAnterior: string = '';
      let nomeAtual: string = '';
      const repeticoes: number[] = [];
      let repeticaoAtual: number = 0;
      let tratamentos: number[] = [];
      let tratamentoAtual: number = 0;
      const repeticoesTratamento: any[] = [];
      let i: number = 0;
      let verificaRepeticao: boolean = false;
      let verificaRepeticaoIndice: number = 0;

      for (const row in spreadSheet) {
        for (const column in spreadSheet[row]) {
          if (row !== '0') {
            if (configModule.response[0]?.fields[column] === 'Nome') {
              if (spreadSheet[row][column] !== '') {
                const delineamento: any = await delineamentoController.getAll(
                  { name: spreadSheet[row][column], id_culture: idCulture },
                );
                if (delineamento.total > 0) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'nome do delineamento ja cadastrado',
                  );
                } else if (nomeAnterior === '' && nomeAtual === '') {
                  nomeAnterior = spreadSheet[row][column];
                  nomeAtual = spreadSheet[row][column];
                } else {
                  nomeAnterior = nomeAtual;
                  nomeAtual = spreadSheet[row][column];
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'Repeticao') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)] += responseNullFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                );
              } else if (typeof (spreadSheet[row][column]) !== 'number') {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'repetição deve ser um número',
                );
              } else if (spreadSheet[1][column] !== 1) {
                responseIfError[Number(column)] += responseGenericFactory(
                  Number(column) + 1,
                  row,
                  spreadSheet[0][column],
                  'repetição deve iniciar com valor igual a 1',
                );
              } else {
                repeticoes.push(spreadSheet[row][column]);
                repeticaoAtual = spreadSheet[row][column];
              }
            }

            if (configModule.response[0]?.fields[column] === 'Tratamento') {
              if (repeticaoAtual === 1) {
                if (tratamentos.includes(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'tratamento não pode ser duplicado na repetição',
                  );
                } else {
                  tratamentos.push(spreadSheet[row][column]);
                  if (repeticoesTratamento.length > 0) {
                    for (let i2 = 0; i2 < repeticoesTratamento.length; i2 += 1) {
                      if (repeticoesTratamento[i2].repeticao === repeticaoAtual) {
                        verificaRepeticao = true;
                        verificaRepeticaoIndice = i2;
                      }
                    }
                    if (verificaRepeticao) {
                      repeticoesTratamento[verificaRepeticaoIndice]
                        .tratamentos.push(spreadSheet[row][column]);
                    } else {
                      repeticoesTratamento.push(
                        { repeticao: repeticaoAtual, tratamentos: [spreadSheet[row][column]] },
                      );
                    }
                    verificaRepeticao = false;
                    verificaRepeticaoIndice = 0;
                  } else {
                    repeticoesTratamento.push(
                      { repeticao: repeticaoAtual, tratamentos: [spreadSheet[row][column]] },
                    );
                  }
                }
                if (row > 1) {
                  if (spreadSheet[row - 1][column] !== spreadSheet[row][column] - 1) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'tratamento na repetição 1 deve ser sequencial',
                    );
                  } else {
                    tratamentoAtual = spreadSheet[row][column];
                  }
                }
              } else if (repeticoesTratamento.length > 0) {
                for (let i2 = 0; i2 < repeticoesTratamento.length; i2 += 1) {
                  if (repeticoesTratamento[i2].repeticao === repeticaoAtual) {
                    verificaRepeticao = true;
                    verificaRepeticaoIndice = i2;
                  }
                }
                if (verificaRepeticao) {
                  repeticoesTratamento[verificaRepeticaoIndice]
                    .tratamentos.push(spreadSheet[row][column]);
                } else {
                  repeticoesTratamento.push(
                    { repeticao: repeticaoAtual, tratamentos: [spreadSheet[row][column]] },
                  );
                }
                verificaRepeticao = false;
                verificaRepeticaoIndice = 0;
              }
              if (repeticaoAtual > 1) {
                if (tratamentos.includes(spreadSheet[row][column])) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'tratamento não pode ser duplicado na repetição',
                  );
                } else {
                  tratamentos.push(spreadSheet[row][column]);
                }
              }
            }

            if (configModule.response[0]?.fields[column] === 'Sorteio') {
              if (spreadSheet[row][column] !== '') {
                if (typeof (spreadSheet[row][column]) !== 'number') {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'o campo sorteio tem que ser um numero',
                  );
                } else {
                  if (nomeAtual !== nomeAnterior) {
                    sorteioAnterior = 0;
                  }
                  if (sorteioAnterior > spreadSheet[row][column]
                    && repeticaoAnterior === repeticaoAtual) {
                    responseIfError[Number(column)] += responseGenericFactory(
                      Number(column) + 1,
                      row,
                      spreadSheet[0][column],
                      'linha deve está em ordem crescente',
                    );
                  }
                  sorteioAnterior = spreadSheet[row][column];
                }
              }

              if (repeticaoAtual && repeticaoAnterior !== repeticaoAtual && repeticaoAnterior > 1) {
                i += 1;
              }
              if (repeticaoAtual && repeticaoAnterior !== repeticaoAtual) {
                tratamentos = [];
              }
              repeticaoAnterior = repeticaoAtual;
            }

            if (configModule.response[0]?.fields[column] === 'Bloco') {
              if (spreadSheet[row][column] !== '') {
                if (typeof (spreadSheet[row][column]) !== 'number') {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'o bloco tem que ser um numero',
                  );
                } else if (blocoAnterior !== 0 && blocoAnterior !== spreadSheet[row][column]) {
                  responseIfError[Number(column)] += responseGenericFactory(
                    Number(column) + 1,
                    row,
                    spreadSheet[0][column],
                    'os blocos não podem ser diferentes',
                  );
                } else {
                  blocoAnterior = spreadSheet[row][column];
                }
              }
            }
          }
        }
      }
      let Column;
      let validacaoNtRepeticao = [];
      if (responseIfError.length > 0) {
        Column = responseIfError.length - 1;
      } else {
        Column = 0;
      }
      if (repeticoesTratamento.length > 1) {
        for (let i3 = 1; i3 < repeticoesTratamento.length; i3 += 1) {
          repeticoesTratamento[i3].tratamentos.forEach((value: number) => {
            repeticoesTratamento[0]?.tratamentos.forEach((value2: number) => {
              if (value === value2) {
                validacaoNtRepeticao.push(value2);
              }
            });
          });
          if (repeticoesTratamento[i3].tratamentos.length
            !== repeticoesTratamento[0]?.tratamentos.length) {
            responseIfError[Column] += `<li style="text-align:left"> A quantidade de tratamentos da repetição ${String(repeticoesTratamento[i3].repeticao)} não é igual aos tratamentos da repetição 1.</li><br>`;
          }
          if (repeticoesTratamento[0]?.tratamentos.length !== validacaoNtRepeticao.length) {
            responseIfError[Column] += `<li style="text-align:left"> Os tratamentos da repetição ${String(repeticoesTratamento[i3].repeticao)} não coincidem com os tratamentos da repetição 1.</li><br>`;
          }
          validacaoNtRepeticao = [];
        }
      }
      if (responseIfError.length === 0) {
        try {
          let anteriorNome: string = '';
          let atualNome: string = '';
          let rep: number = 1;
          let countTrat = 1;
          const aux: object | any = {};
          let Lines;
          let delimit = 0;

          for (const row in spreadSheet) {
            Lines = Number(row) + 1;
            for (const column in spreadSheet[row]) {
              if (row !== '0') {
              // console.log
                if (configModule.response[0]?.fields[column] === 'Nome') {
                  if (anteriorNome === '' && atualNome === '') {
                    anteriorNome = spreadSheet[row][column];
                    atualNome = spreadSheet[row][column];
                  } else {
                    anteriorNome = atualNome;
                    atualNome = spreadSheet[row][column];
                    if (atualNome !== anteriorNome) {
                      delimit = 0;
                      await delineamentoController.update(
                        { id: aux.id_delineamento, rep, trat_repeticao: countTrat },
                      );
                    } else if (Lines === spreadSheet.length) {
                      countTrat += 1;
                      await delineamentoController.update(
                        { id: aux.id_delineamento, rep, trat_repeticao: countTrat },
                      );
                    }
                  }
                }

                if (configModule.response[0]?.fields[column] === 'Repeticao') {
                  if (atualNome !== '' && anteriorNome !== '') {
                    if (atualNome !== anteriorNome) {
                      countTrat = 1;
                      rep = 1;
                    }
                  }

                  if (spreadSheet[row][column] > repeticao) {
                    rep += 1;
                    countTrat = 1;
                    tratamentoAnterior = 0;
                  } else {
                    countTrat += 1;
                  }
                  aux.repeticao = Number(spreadSheet[row][column]);
                }

                if (configModule.response[0]?.fields[column] === 'Sorteio') {
                  aux.sorteio = Number(spreadSheet[row][column]);
                }

                if (configModule.response[0]?.fields[column] === 'Tratamento') {
                  aux.nt = Number(spreadSheet[row][column]);
                }

                if (configModule.response[0]?.fields[column] === 'Bloco') {
                  aux.bloco = Number(spreadSheet[row][column]);
                }

                if (spreadSheet[row].length === Column && aux !== []) {
                  if (atualNome === anteriorNome && delimit === 0) {
                    const delineamento: any = await delineamentoController.create({
                      id_culture: idCulture,
                      name: atualNome,
                      repeticao,
                      trat_repeticao: countTrat,
                      status: 1,
                      created_by: createdBy,
                    });
                    aux.id_delineamento = delineamento.response.id;
                    delimit = 1;
                  }
                  await sequenciaDelineamentoController.create(aux);
                }
              }
            }
          }
          await logImportController.update({ id: idLog, status: 1, state: 'SUCESSO' });
          return { status: 200, message: 'Delineamento importado com sucesso' };
        } catch (error: any) {
          await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
          handleError('Delineamento controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de Delineamento' };
        }
      }
      await logImportController.update({ id: idLog, status: 1, state: 'INVALIDA' });
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      await logImportController.update({ id: idLog, status: 1, state: 'FALHA' });
      handleError('Delineamento controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de Delineamento' };
    }
  }
}
