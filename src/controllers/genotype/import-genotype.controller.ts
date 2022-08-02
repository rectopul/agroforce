/* eslint-disable guard-for-in */
/* eslint-disable no-loop-func */
/* eslint-disable import/no-cycle */
/* eslint-disable no-await-in-loop */

import { ImportValidate, IReturnObject } from '../../interfaces/shared/Import.interface';
import handleError from '../../shared/utils/handleError';
import { responseGenericFactory, responseNullFactory, responsePositiveNumericFactory } from '../../shared/utils/responseErrorFactory';
import { CulturaController } from '../cultura.controller';
import { ImportController } from '../import.controller';
import { LoteController } from '../lote.controller';
import { SafraController } from '../safra.controller';
import { TecnologiaController } from '../technology/tecnologia.controller';
import { GenotipoController } from './genotipo.controller';

/* eslint-disable no-restricted-syntax */
export class ImportGenotypeController {
  static aux: any = {};

  static async validate({
    spreadSheet, idSafra, idCulture, created_by: createdBy,
  }: ImportValidate): Promise<IReturnObject> {
    const importController = new ImportController();
    const tecnologiaController = new TecnologiaController();
    const genotipoController = new GenotipoController();
    const loteController = new LoteController();
    const safraController = new SafraController();
    const culturaController = new CulturaController();

    const responseIfError: any = [];
    try {
      const configModule: object | any = await importController.getAll(10);
      for (const row in spreadSheet) {
        if (row !== '0') {
          for (const column in spreadSheet[row]) {
            configModule.response[0].fields.push('DT');
            // campos genotipo
            if (configModule.response[0].fields[column] === 'id_s1') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }

            if (configModule.response[0].fields[column] === 'id_dados_geno') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const genotipo: any = await genotipoController.getAll(
                  { id_dados_geno: spreadSheet[row][column] },
                );
                if (genotipo.total > 0) {
                  this.aux.id_dados_geno = genotipo.response[0].id_dados;
                }
              }
            }

            if (configModule.response[0].fields[column] === 'Genotipo') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }

            if (configModule.response[0].fields[column] === 'Cultura') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const cultura = await culturaController.getAllCulture(
                  { name: spreadSheet[row][column] },
                );
                if (cultura.total > 0) {
                  if (idCulture !== cultura.response[0].id) {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'o campo cultura tem que ser igual a cultura selecionada',
                      );
                  }
                } else {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'cultura não existe',
                    );
                }
              }
            }

            if (configModule.response[0].fields[column] === 'Tecnologia') {
              if (String(spreadSheet[row][column]) === '') {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                if (spreadSheet[row][column] < 10) {
                  // eslint-disable-next-line no-param-reassign
                  spreadSheet[row][column] = `0${spreadSheet[row][column]}`;
                }
                const tec: any = await tecnologiaController.getAll(
                  {
                    id_culture: idCulture,
                    cod_tec: String(spreadSheet[row][column]),
                  },
                );
                if (tec.total === 0) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'a tecnologia informado não existe no sistema',
                    );
                }
              }
            }

            if (configModule.response[0].fields[column] === 'GMR') {
              if (spreadSheet[row][column] !== '') {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (typeof (spreadSheet[row][column]) !== 'number') {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              }
            }

            if (configModule.response[0].fields[column] === 'BGM') {
              if (spreadSheet[row][column] !== '') {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else if (typeof (spreadSheet[row][column]) !== 'number') {
                responseIfError[Number(column)]
                  += responsePositiveNumericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                  );
              }
            }

            // Campos lote
            if (configModule.response[0].fields[column] === 'id_dados_lote') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }

            if (configModule.response[0].fields[column] === 'Ano') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
              const { status }: IReturnObject = await safraController.getAll(
                {
                  id_culture: idCulture,
                  safraName: String(spreadSheet[row][(Number(column) + 1)]),
                },
              );
              if (status === 400) {
                responseIfError[Number(column)]
                  += responseGenericFactory(
                    (Number(column) + 1),
                    row,
                    spreadSheet[0][column],
                    'ano não é igual ao ano da safra',
                  );
              }
            }
            if (configModule.response[0].fields[column] === 'Safra') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const { status, response }: IReturnObject = await safraController.getAll(
                  {
                    id_culture: idCulture,
                    safraName: String(spreadSheet[row][column]),
                  },
                );
                if (status === 400) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'safra não cadastrada',
                    );
                } else if (response[0]?.id !== Number(idSafra)) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'safra informada diferente da safra selecionada',
                    );
                }
              }
            }

            if (configModule.response[0].fields[column] === 'CodLote') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const lote: any = loteController.getAll(
                  { cod_lote: String(spreadSheet[row][column]) },
                );
                if (lote.total > 0) {
                  responseIfError[Number(column)]
                    += responseGenericFactory(
                      (Number(column) + 1),
                      row,
                      spreadSheet[0][column],
                      'código do lote deve ser um campo único no GOM',
                    );
                }
              }
            }

            if (configModule.response[0].fields[column] === 'Cruza') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }

            if (configModule.response[0].fields[column] === 'id_s2') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              }
            }

            if (configModule.response[0].fields[column] === 'NCC') {
              const nccDados: any = [];
              // eslint-disable-next-line array-callback-return
              spreadSheet.map((val: any, index: any) => {
                if (index === column) {
                  if (nccDados.includes(val)) {
                    responseIfError[Number(column)]
                      += responseGenericFactory(
                        (Number(column) + 1),
                        row,
                        spreadSheet[0][column],
                        'o campo ncc não pode ser repetido',
                      );
                  } else {
                    nccDados.push(val);
                  }
                }
              });
            }

            if (configModule.response[0].fields[column] === 'DT') {
              if (spreadSheet[row][column] === null) {
                responseIfError[Number(column)]
                  += responseNullFactory((Number(column) + 1), row, spreadSheet[0][column]);
              } else {
                const geno: any = await genotipoController.getAll({
                  id_dados: this.aux.id_dados_geno,
                });
                if (geno.response[0].dt_import > spreadSheet[row][column]) {
                  responseIfError[Number(column)]
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

      if (responseIfError.length === 0) {
        this.aux.created_by = Number(createdBy);
        this.aux.id_culture = Number(idCulture);
        try {
          for (const row in spreadSheet) {
            if (row !== '0') {
              for (const column in spreadSheet[row]) {
                this.aux.genealogy = '';
                // campos genotipo
                if (configModule.response[0].fields[column] === 'id_s1') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.id_s1 = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'id_dados_geno') {
                  if (spreadSheet[row][column] !== '') {
                    const geno: any = await genotipoController.getAll(
                      {
                        id_culture: idCulture,
                        id_dados: spreadSheet[row][column],
                        id_safra: idSafra,
                      },
                    );
                    if (geno.total > 0) {
                      this.aux.id_genotipo = geno.response[0].id;
                    }
                    this.aux.id_dados_geno = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'Genotipo') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.name_genotipo = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'NomePrincipal') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.name_main = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'NomePublico') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.name_public = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'NomeExperimental') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.name_experiment = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'NomeAlternativo') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.name_alter = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'EliteNome') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.elite_name = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'Tecnologia') {
                  if (spreadSheet[row][column] !== '') {
                    const tec: any = await tecnologiaController.getAll(
                      { id_culture: idCulture, cod_tec: String(spreadSheet[row][column]) },
                    );
                    if (tec.total > 0) {
                      this.aux.id_tecnologia = tec.response[0].id;
                    }
                  }
                }

                if (configModule.response[0].fields[column] === 'Tipo') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.type = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'gmr') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.gmr = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'bgm') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.bgm = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'Cruza') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.cruza = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'ProgenitorFdireito') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.progenitor_f_direto = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'ProgenitorMdireito') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.progenitor_m_direto = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'ProgenitorForigem') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.progenitor_f_origem = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'ProgenitorMorigem') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.progenitor_m_origem = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'ProgenitoresOrigem') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.progenitores_origem = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'ParentescoCompleto') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.parentesco_completo = spreadSheet[row][column];
                  }
                }

                // Campos lote
                if (configModule.response[0].fields[column] === 'id_s2') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.id_s2 = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'id_dados_lote') {
                  if (spreadSheet[row][column] !== '') {
                    const lote: any = await loteController.getAll(
                      { id_dados: spreadSheet[row][column] },
                    );
                    if (lote.total > 0) {
                      this.aux.id_lote = lote.response[0].id;
                    }
                    this.aux.id_dados_lote = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'Ano') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.year = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'NCC') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.ncc = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'Safra') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.id_safra = idSafra;
                  }
                }

                if (configModule.response[0].fields[column] === 'CodLote') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.cod_lote = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'Fase') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.fase = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'Peso') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.peso = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'QuantidadeSementes') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.quant_sementes = spreadSheet[row][column];
                  }
                }

                if (configModule.response[0].fields[column] === 'DT') {
                  if (spreadSheet[row][column] !== '') {
                    this.aux.dt_import = spreadSheet[row][column];
                  }
                }

                if (spreadSheet[row].length === (Number(column) + 1) && this.aux !== []) {
                  if (this.aux.id_genotipo && this.aux.id_genotipo > 0) {
                    await genotipoController.update({
                      id: this.aux.id_genotipo,
                      id_tecnologia: Number(this.aux.id_tecnologia),
                      id_s1: this.aux.id_s1,
                      id_dados: String(this.aux.id_dados_geno),
                      name_genotipo: this.aux.name_genotipo,
                      name_main: this.aux.name_main,
                      name_public: this.aux.name_public,
                      name_experiment: this.aux.name_experiment,
                      name_alter: this.aux.name_alter,
                      elit_name: this.aux.elit_name,
                      type: this.aux.type,
                      gmr: this.aux.gmr,
                      bgm: this.aux.bgm,
                      cruza: this.aux.cruza,
                      progenitor_f_direto: this.aux.progenitor_f_direto,
                      progenitor_m_direto: this.aux.progenitor_m_direto,
                      progenitor_f_origem: this.aux.progenitor_f_origem,
                      progenitor_m_origem: this.aux.progenitor_m_origem,
                      progenitores_origem: this.aux.progenitores_origem,
                      parentesco_completo: this.aux.parentesco_completo,
                      dt_import: this.aux.dt_import,
                      created_by: this.aux.created_by,
                    });
                  } else {
                    delete this.aux.id_genotipo;
                    const genotipo: any = await genotipoController.create({
                      id_culture: this.aux.id_culture,
                      id_tecnologia: this.aux.id_tecnologia,
                      id_s1: this.aux.id_s1,
                      id_dados: String(this.aux.id_dados_geno),
                      name_genotipo: this.aux.name_genotipo,
                      name_main: this.aux.name_main,
                      name_public: this.aux.name_public,
                      name_experiment: this.aux.name_experiment,
                      name_alter: this.aux.name_alter,
                      elit_name: this.aux.elit_name,
                      type: this.aux.type,
                      gmr: this.aux.gmr,
                      bgm: this.aux.bgm,
                      cruza: this.aux.cruza,
                      progenitor_f_direto: this.aux.progenitor_f_direto,
                      progenitor_m_direto: this.aux.progenitor_m_direto,
                      progenitor_f_origem: this.aux.progenitor_f_origem,
                      progenitor_m_origem: this.aux.progenitor_m_origem,
                      progenitores_origem: this.aux.progenitores_origem,
                      parentesco_completo: this.aux.parentesco_completo,
                      dt_import: this.aux.dt_import,
                      created_by: this.aux.created_by,
                    });
                    this.aux.id_genotipo = genotipo.response.id;
                  }

                  if (this.aux.id_genotipo) {
                    if (this.aux.id_lote) {
                      await loteController.update({
                        id: Number(this.aux.id_lote),
                        id_genotipo: Number(this.aux.id_genotipo),
                        id_safra: Number(this.aux.id_safra),
                        cod_lote: String(this.aux.cod_lote),
                        id_s2: Number(this.aux.id_s2),
                        id_dados: Number(this.aux.id_dados_lote),
                        year: Number(this.aux.year),
                        ncc: Number(this.aux.ncc),
                        fase: this.aux.fase,
                        peso: this.aux.peso,
                        quant_sementes: this.aux.quant_sementes,
                        created_by: this.aux.created_by,
                      });
                      delete this.aux.id_lote;
                      delete this.aux.id_genotipo;
                    } else {
                      await loteController.create({
                        id_genotipo: Number(this.aux.id_genotipo),
                        id_safra: Number(this.aux.id_safra),
                        cod_lote: String(this.aux.cod_lote),
                        id_s2: Number(this.aux.id_s2),
                        id_dados: Number(this.aux.id_dados_lote),
                        year: Number(this.aux.year),
                        ncc: Number(this.aux.ncc),
                        fase: this.aux.fase,
                        peso: this.aux.peso,
                        quant_sementes: this.aux.quant_sementes,
                        created_by: this.aux.created_by,
                      });
                      delete this.aux.id_genotipo;
                    }
                  }
                }
              }
            }
          }
          return { status: 200, message: 'Genótipo importado com sucesso' };
        } catch (error: any) {
          handleError('Genótipo controller', 'Save Import', error.message);
          return { status: 500, message: 'Erro ao salvar planilha de Genótipo' };
        }
      }
      const responseStringError = responseIfError.join('').replace(/undefined/g, '');
      return { status: 400, message: responseStringError };
    } catch (error: any) {
      handleError('Genótipo controller', 'Validate Import', error.message);
      return { status: 500, message: 'Erro ao validar planilha de Genótipo' };
    }
  }
}
