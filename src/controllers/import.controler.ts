import { ImportRepository } from 'src/repository/import.repository';
import { saveDegreesCelsius } from "src/shared/utils/formatDegreesCelsius";
import { SafraController } from '../controllers/safra.controller';
import { LocalController } from '../controllers/local.controller';
import { FocoController } from '../controllers/foco.controller';
import { TypeAssayController } from '../controllers/tipo-ensaio.controller';
import { TecnologiaController } from '../controllers/tecnologia.controller';
import { NpeController } from '../controllers/npe.controller';
import { DelineamentoController } from '../controllers/delineamento.controller';
import { SequenciaDelineamentoController } from '../controllers/sequencia-delineamento.controller';
import { GenotipoController } from '../controllers/genotipo.controller';
import { LoteController } from '../controllers/lote.controller';
import { QuadraController } from '../controllers/quadra.controller';
import { DisparosController } from '../controllers/disparos.controller';
import { CulturaController } from '../controllers/cultura.controller';
import { LayoutQuadraController } from '../controllers/layout-quadra.controller';
import { LayoutChildrenController } from '../controllers/layout-children.controller';
import { GrupoController } from '../controllers/grupo.controller';
import { UnidadeCulturaController } from './unidade-cultura.controller';

export class ImportController {
  importRepository = new ImportRepository();
  safraController = new SafraController();
  localController = new LocalController();
  focoController = new FocoController();
  typeAssayController = new TypeAssayController();
  ogmController = new TecnologiaController();
  npeController = new NpeController();
  delineamentoController = new DelineamentoController();
  sequenciaDelineamentoController = new SequenciaDelineamentoController();
  genotipoController = new GenotipoController();
  loteController = new LoteController();
  quadraController = new QuadraController();
  disparosController = new DisparosController();
  culturaController = new CulturaController();
  layoutQuadraController = new LayoutQuadraController();
  layoutChildrenController = new LayoutChildrenController();
  groupoController = new GrupoController();
  tecnologiaController = new TecnologiaController();
  unidadeCulturaController = new UnidadeCulturaController();
  aux: object | any = {};

  async getAll(moduleId: number) {
    try {
      const response = await this.importRepository.findAll({ moduleId: moduleId });
      if (response) {
        return { response, status: 200 }
      } else {
        return { status: 200, message: "ainda não há configuração de planilha para esse modulo!" };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async post(data: object | any) {
    try {
      if (data != null && data != undefined) {
        const parameters: object | any = new Object();
        await this.delete(parseInt(data.moduleId));
        parameters.moduleId = parseInt(data.moduleId);
        parameters.fields = data.fields;
        const response = await this.importRepository.create(parameters);
        if (response.count > 0) {
          return { status: 200, message: "Configuração da planilha foi salva" }
        } else {
          return { status: 400, message: "erro" }
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  async delete(moduleId: number) {
    try {
      if (moduleId) {
        const response: object | any = await this.importRepository.delete({ moduleId: moduleId });
        return { status: 200, response }

      } else {
        return { status: 400, message: "id não informado" }
      }
    } catch (err) {
      return { status: 400, message: err }
    }
  }

  async validateGeneral(data: object | any) {
    try {
      if (data != null && data != undefined) {

        if (!data.moduleId) return { status: 400, message: "precisa ser informado o modulo que está sendo acessado!" };

        const configModule: object | any = await this.getAll(parseInt(data.moduleId));

        if (configModule.response == "") return { status: 200, message: "Primeiro é preciso configurar o modelo de planilha para esse modulo!" };

        let response: any;
        let erro: any = false;

        // Validação do modulo Local
        if (data.moduleId == 4) {
          response = await this.validateLocal(data);
          if (response == 'save') {
            response = "Itens cadastrados com sucesso!";
          } else {
            erro = true;
          }
        }

        // Validação do modulo Layout Quadra
        if (data.moduleId == 5) {
          response = await this.validateLayoutQuadra(data);
          if (response == 'save') {
            response = "Itens cadastrados com sucesso!";
          } else {
            erro = true;
          }
        }

        // Validação do modulo Delineamento
        if (data.moduleId == 7) {
          response = await this.validateDelineamento(data);
          if (response == 'save') {
            response = "Itens cadastrados com sucesso!";
          } else {
            erro = true;
          }
        }

        // Validação do modulo Genotipo
        if (data.moduleId == 10) {
          response = await this.validateGenotipo(data);
          if (response == 'save') {
            response = "Itens cadastrados com sucesso!";
          } else {
            erro = true;
          }
        }

        // Validação do modulo Lote
        if (data.moduleId == 12) {
          response = await this.validateLote(data);
          if (response == 'save') {
            response = "Itens cadastrados com sucesso!";
          } else {
            erro = true;
          }
        }

        // Validação do modulo NPE
        if (data.moduleId == 14) {
          response = await this.validateNPE(data);
          if (response == 'save') {
            response = "Itens cadastrados com sucesso!";
          } else {
            erro = true;
          }
        }

        // Validação do modulo quadra
        if (data.moduleId == 17) {
          response = await this.validateQuadra(data);
          if (response == 'save') {
            response = "Itens cadastrados com sucesso!";
          } else {
            erro = true;
          }
        }

        // Validação do modulo tecnologia
        if (data.moduleId === 18) {
          response = await this.validateTechnology(data);
          if (response === 'save') {
            response = "Itens cadastrados com sucesso!";
          } else {
            erro = true;
          }
        }

        return { status: 200, message: response, error: erro };
      }
    } catch (err) {
      console.log(err)
    }
  }

  async validateTechnology(data: object | any) {
    const responseIfError: any = [];
    const spreadSheet = data.spreadSheet
    try {
      const configModule: object | any = await this.getAll(parseInt(data.moduleId));
      for (let row in spreadSheet) {
        for (let column in spreadSheet[row]) {
          if (row === '0') {
            if (!(spreadSheet[row][column].toUpperCase()).includes(configModule.response[0].fields[column].toUpperCase())) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, a sequencia de colunas da planilha esta incorreta. </li> <br>`;
            }
          }
          else if (column === '0') {

            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Código da tecnologia é obrigatório. </li> <br>`;
            } else {
              if ((spreadSheet[row][column]).toString().length > 2) {
                responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o limite de caracteres para o Código da tecnologia e 2. </li> <br>`;
              }
              if ((spreadSheet[row][column]).toString().length == 1) {
                spreadSheet[row][column] = '0' + (spreadSheet[row][column].toString())
              } else {
                const { response: responseCulture } = await this.culturaController.getAllCulture({ name: spreadSheet[row][3] })
                const technology = await this.tecnologiaController.getAll({ id_culture: responseCulture[0].id, cod_tec: (spreadSheet[row][0].toString()) })
                if (technology.total > 0) {
                  responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, tecnologia já cadastrada nessa cultura. </li> <br>`
                }
              }

            }

          }
          else if (column === '1') {

            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome da tecnologia é obrigatório. </li> <br>`;
            }

          } else if (column === '3') {

            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Cultura é obrigatório. </li> <br>`;
            } else {
              const cultureExist = await this.culturaController.getAllCulture({ name: spreadSheet[row][column] })
              if (cultureExist.status !== 200) {
                responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, a cultura não esta cadastrada. </li> <br>`;
              }
            }

          }
        }
      }

      if (responseIfError.length === 0) {
        try {
          for (let row in spreadSheet) {
            if (row !== "0") {
              const { response } = await this.culturaController.getAllCulture({ name: spreadSheet[row][3] })
              await this.tecnologiaController.post({ id_culture: response[0].id, name: spreadSheet[row][1], cod_tec: (spreadSheet[row][0].toString()), desc: spreadSheet[row][2], created_by: 23 })
            }
          }
          return "save"
        } catch (err) {
          console.log(err)
        }
      }

      const responseStringError = responseIfError.join("").replace(/undefined/g, "")
      return responseStringError;

    } catch (error) {

      console.log("Error", error)

    }
  }

  async validateNPE(data: object | any) {
    const responseIfError: any = []
    let Column: number;
    try {
      let configModule: object | any = await this.getAll(parseInt(data.moduleId));

      if (data != null && data != undefined) {
        let Line: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              this.aux.status = 1;
              this.aux.created_by = data.created_by;
              this.aux.npef = 0;
              this.aux.prox_npe = 0;
              if (configModule.response[0].fields[sheet] == 'Local') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) == 'string') {
                    let local: any = await this.localController.getAllLocal({ cod_local: data.spreadSheet[keySheet][sheet] });
                    if (local.total == 0) {
                      // console.log('aqui Local');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o local não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_local = local.response[0].id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, local deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do local é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Safra') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) == 'string') {
                    let validateSafra: any = await this.safraController.getOneSafra(Number(data.safra));
                    if (data.spreadSheet[keySheet][sheet] != validateSafra.response.safraName) {
                      return "A safra a ser importada tem que ser a mesma selecionada!";
                    }
                    let safras: any = await this.safraController.getAllSafra({ safraName: data.spreadSheet[keySheet][sheet] });
                    if (safras.total == 0) {
                      // console.log('aqui Safra');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a safra não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_safra = safras.response[0].id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, safra deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome da safra é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'OGM') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  let ogm: any = await this.ogmController.getAll({ name: String(data.spreadSheet[keySheet][sheet]) });
                  if (ogm.total == 0) {
                    // console.log('aqui OGM');
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o tecnologia informado não existe no sistema.</li><br>`;
                  } else {
                    this.aux.id_ogm = ogm.response[0].id;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do tecnologia é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Foco') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) == 'string') {

                    let foco: any = await this.focoController.listAllFocos({ name: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                    if (foco.total == 0) {
                      // console.log('aqui Foco');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o foco não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_foco = foco.response[0].id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, foco deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do foco é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Ensaio') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) == 'string') {
                    let ensaio: any = await this.typeAssayController.getAll({ name: data.spreadSheet[keySheet][sheet] });
                    if (ensaio.total == 0) {
                      // console.log('aqui Ensaio');
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta,o tipo de ensaio não existe no sistema.</li><br>`;
                    } else {
                      this.aux.id_type_assay = ensaio.response[0].id;
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, tipo de ensaio deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do tipo de ensaio é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == "NPEI") {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) == 'number') {
                    if (typeof (this.aux.id_foco) == 'undefined') {
                      return 'O foco precisa ser importado antes da NPEI';
                    }
                    responseIfError[Column - 1] += await this.npeController.validateNpeiDBA({ Column: Column, Line: Line, safra: data.safra, foco: this.aux.id_foco, npei: data.spreadSheet[keySheet][sheet] });
                    if (responseIfError == "") {
                      this.aux.npei = data.spreadSheet[keySheet][sheet];
                    }
                  } else {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, NPEI deve ser um campo de texto.</li><br>`;
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do NPEI é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == "Epoca") {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) != 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, época deve ser um campo numerico.</li><br>`;
                  } else {
                    if (data.spreadSheet[keySheet][sheet] <= 0) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, época deve ser um número positivo.</li><br>`;
                    }
                  }
                } else {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, campo a época é obrigatorio.</li><br>`;

                }
              }

              if (Column == configModule.lenght) {
                let npe: any = await this.npeController.getAll({
                  id_safra: data.safra,
                  id_foco: this.aux.id_foco,
                  id_type_assay: this.aux.id_type_assay,
                  id_ogm: this.aux.id_ogm,
                  epoca: this.aux.epoca
                });
                if (npe.total > 0) {
                  responseIfError[Column - 1] = `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, dados já cadastrado no banco, para atualizar inative o que já está cadastrado`;
                }
              }
            }
          }
        }
      }

      if (responseIfError == "") {
        // console.log('AQUI R');
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              this.aux.status = 1;
              this.aux.created_by = data.created_by;
              this.aux.npef = 0;
              this.aux.prox_npe = 0;
              if (configModule.response[0].fields[sheet] == 'Local') {
                // console.log("Local R");
                let local: any = await this.localController.getAllLocal({ cod_local: data.spreadSheet[keySheet][sheet] });
                this.aux.id_local = local.response[0].id;
              }

              if (configModule.response[0].fields[sheet] == 'Safra') {
                // console.log("Safra R");
                this.aux.id_safra = Number(data.safra);
              }

              if (configModule.response[0].fields[sheet] == 'OGM') {
                // console.log("OGM R");
                let ogm: any = await this.ogmController.getAll({ name: String(data.spreadSheet[keySheet][sheet]) });
                this.aux.id_ogm = ogm.response[0].id;
              }

              if (configModule.response[0].fields[sheet] == 'Foco') {
                // console.log("FOCO R");
                let foco: any = await this.focoController.listAllFocos({ name: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                this.aux.id_foco = Number(foco.response[0].id);
              }

              if (configModule.response[0].fields[sheet] == 'Ensaio') {
                // console.log("Ensaio R");
                let ensaio: any = await this.typeAssayController.getAll({ name: data.spreadSheet[keySheet][sheet] });
                this.aux.id_type_assay = ensaio.response[0].id;
              }

              if (configModule.response[0].fields[sheet] == 'Epoca') {
                this.aux.epoca = String(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0].fields[sheet] == "NPEI") {
                this.aux.npei = data.spreadSheet[keySheet][sheet];
              }

              if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                let group: any = await this.groupoController.listAll({ id_safra: data.safra, id_foco: this.aux.id_foco });
                this.aux.group = group.response[0].grupo;
                this.npeController.post(this.aux);
              }
            }
          }
        }
        return "save";
      }
      const responseStringError = responseIfError.join("").replace(/undefined/g, "")
      return responseStringError;
    } catch (err) {
      console.log(err)
    }
  }

  async validateDelineamento(data: object | any) {
    const responseIfError: any = []
    let Column: number;

    try {
      let configModule: object | any = await this.getAll(parseInt(data.moduleId));
      let sorteio_anterior: number = 0;
      let tratamento_anterior: number = 0;
      let bloco_anterior: number = 0;
      let repeticao: number = 1;
      let repeticao_ini: number = 1;
      let repeticao_anterior: number = 0;
      let name_anterior: string = '';
      let name_atual: string = '';
      let count_trat: number = 0;
      let count_trat_ant: number = 0;
      let count_linhas: number = 0;

      if (data != null && data != undefined) {
        let Line: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {

              if (configModule.response[0].fields[sheet] == 'Nome') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  let delineamento: any = await this.delineamentoController.getAll({ name: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                  if (delineamento.total > 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, nome do delineamento ja cadastrado.</li><br>`;
                  } else {
                    if (name_anterior == '' && name_atual == '') {
                      name_anterior = data.spreadSheet[keySheet][sheet];
                      name_atual = data.spreadSheet[keySheet][sheet];
                    } else {
                      name_anterior = name_atual;
                      name_atual = data.spreadSheet[keySheet][sheet];
                    }
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Repeticao') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) != 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a repetição tem que ser um numero.</li><br>`;
                  } else {
                    if (repeticao_ini == 1) {
                      repeticao_ini++;
                      if (data.spreadSheet[keySheet][sheet] != 1) {
                        return 'A repetição deve iniciar com 1';
                      }
                      repeticao_anterior = data.spreadSheet[keySheet][sheet];
                      repeticao = data.spreadSheet[keySheet][sheet];
                    } else {
                      if (name_atual != name_anterior) {
                        repeticao = 1;
                        repeticao_ini = 1;
                      } else {
                        repeticao_anterior = repeticao;
                        repeticao = data.spreadSheet[keySheet][sheet];
                      }
                    }

                    if (data.spreadSheet[keySheet][sheet] < repeticao) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a repetição está incorreta.</li><br>`;
                    }
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Sorteio') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) != 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo sorteio tem que ser um numero.</li><br>`;
                  } else {
                    if (name_atual != name_anterior) {
                      sorteio_anterior = 0;
                    }
                    if (sorteio_anterior > data.spreadSheet[keySheet][sheet]) {
                      return 'A coluna de sorteio deve está em ordem crescente.';
                    } else {
                      sorteio_anterior = data.spreadSheet[keySheet][sheet];
                    }
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Tratamento') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) != 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o tratamento tem que ser um numero.</li><br>`;
                  } else {

                    if ((name_atual != name_anterior) || (repeticao != repeticao_anterior)) {
                      if (repeticao != repeticao_anterior) {
                        if (count_trat == 0) {
                          count_trat_ant = count_trat;
                          count_trat = tratamento_anterior;
                        } else {
                          count_trat_ant = count_trat;
                          count_trat = tratamento_anterior;
                          if (count_trat != count_trat_ant) {
                            return 'O número de tratamento deve ser igual para todas repetições';
                          }
                        }
                      }
                      tratamento_anterior = 0;
                    }

                    if (data.spreadSheet.length == Line) {
                      if (data.spreadSheet[keySheet][sheet] != count_trat) {
                        return 'O número de tratamento deve ser igual para todas repetições';
                      }
                    }

                    if (tratamento_anterior == 0) {
                      tratamento_anterior = data.spreadSheet[keySheet][sheet];
                      if (data.spreadSheet[keySheet][sheet] != 1) {
                        return 'O número de tratamento deve iniciar com 1';
                      }
                    } else {
                      if (tratamento_anterior >= data.spreadSheet[keySheet][sheet]) {
                        return 'A coluna de tratamento deve está em ordem crescente para cada repetição.';
                      } else {
                        tratamento_anterior = data.spreadSheet[keySheet][sheet];
                      }
                    }
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Bloco') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) != 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o bloco tem que ser um numero.</li><br>`;
                  } else {
                    if (bloco_anterior != 0 && bloco_anterior != data.spreadSheet[keySheet][sheet]) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, os blocos não podem ser diferentes.</li><br>`;
                    } else {
                      bloco_anterior = data.spreadSheet[keySheet][sheet];
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (responseIfError == "") {

        let name_anterior: string = '';
        let name_atual: string = '';
        let repeticao: number = 1;
        let countTrat = 1;
        let aux: object | any = {};
        let Column;
        let Lines;
        let delimit = 0;

        aux.created_by = data.created_by;

        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Lines = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              if (configModule.response[0].fields[sheet] == 'Nome') {
                if (name_anterior == '' && name_atual == '') {
                  console.log('entrou name1')
                  name_anterior = data.spreadSheet[keySheet][sheet];
                  name_atual = data.spreadSheet[keySheet][sheet];
                } else {
                  name_anterior = name_atual;
                  name_atual = data.spreadSheet[keySheet][sheet];
                  if (name_atual != name_anterior) {
                    delimit = 0;
                    await this.delineamentoController.update({ id: aux.id_delineamento, repeticao: repeticao, trat_repeticao: countTrat });
                  } else {
                    if (Lines == data.spreadSheet.length) {
                      countTrat++;
                      await this.delineamentoController.update({ id: aux.id_delineamento, repeticao: repeticao, trat_repeticao: countTrat });
                    }
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Repeticao') {

                if (name_atual != '' && name_anterior != '') {
                  if (name_atual != name_anterior) {
                    countTrat = 1;
                    repeticao = 1;
                  }
                }

                if (data.spreadSheet[keySheet][sheet] > repeticao) {
                  repeticao++;
                  countTrat = 1;
                  tratamento_anterior = 0;
                } else {
                  countTrat++;
                }
                aux.repeticao = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0].fields[sheet] == 'Sorteio') {
                aux.sorteio = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0].fields[sheet] == 'Tratamento') {
                aux.nt = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (configModule.response[0].fields[sheet] == 'Bloco') {
                aux.bloco = Number(data.spreadSheet[keySheet][sheet]);
              }

              if (data.spreadSheet[keySheet].length == Column && aux != []) {
                if (name_atual == name_anterior && delimit == 0) {
                  let delineamento: any = await this.delineamentoController.post({ id_culture: data.id_culture, name: name_atual, repeticao: repeticao, trat_repeticao: countTrat, status: 1, created_by: data.created_by });
                  aux.id_delineamento = delineamento.response.id
                  delimit = 1;
                } else {
                  await this.sequenciaDelineamentoController.create(aux);
                }
              }
            }
          }
        }
        return "save";
      } else {
        const responseStringError = responseIfError.join("").replace(/undefined/g, "")
        return responseStringError;
      }
    } catch (err) {
      console.log(err)
    }
    return "save";
  }

  async validateGenotipo(data: object | any) {
    const responseIfError: any = [];
    let Column: number;
    let year_safra: any;
    let year_lote: any;
    try {
      let configModule: object | any = await this.getAll(parseInt(data.moduleId));

      if (data != null && data != undefined) {

        let Line: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              // campos genotipo
              if (configModule.response[0].fields[sheet] == 'id_s1') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo id_s1 é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'id_dados_geno') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo identificador de dados do genótipo é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Genotipo') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo genótipo é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Cultura') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo cultura é obrigatorio.</li><br>`;
                } else {
                  if (data.spreadSheet[keySheet][sheet] != data.id_culture) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo cultura tem que ser igual a cultura filtrada no software.</li><br>`;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Tecnologia') {
                if (String(data.spreadSheet[keySheet][sheet]) == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo tecnologia é obrigatorio.</li><br>`;
                } else {
                  let tec: any = await this.ogmController.getAll({ id_culture: data.id_culture, name: String(data.spreadSheet[keySheet][sheet]) });

                  if (tec.total == 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a tecnologia informado não existe no sistema.</li><br>`;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'GMR') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) != 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo gmr deve ser numerico.</li><br>`;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'BGM') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if (typeof (data.spreadSheet[keySheet][sheet]) != 'number') {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo bgm deve ser numerico.</li><br>`;
                  }
                }
              }

              //Campos lote

              if (configModule.response[0].fields[sheet] == 'id_dados_lote') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo identificador de dados do lote é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Ano') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo ano lote é obrigatorio.</li><br>`;
                } else {
                  if (year_safra && year_safra != '') {
                    if (year_safra != data.spreadSheet[keySheet][sheet]) {
                      console.log(year_safra);
                      console.log(data.spreadSheet[keySheet][sheet]);
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, ano diferente do ano cadastrado na safra.</li><br>`;
                    }
                    year_safra = '';
                  } else {
                    year_lote = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Safra') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo safra é obrigatorio.</li><br>`;
                } else {
                  let safra: any = this.safraController.getAllSafra({ id_culture: data.id_culture });
                  if (safra.count == 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, safra não cadastrada.</li><br>`;
                  } else {
                    if (year_lote && year_lote != '') {
                      if (year_lote != safra.response[0].year) {
                        responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, ano diferente do ano cadastrado na safra.</li><br>`;
                      }
                      year_lote = '';
                    } else {
                      year_safra = safra.response[0].year;
                    }
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'CodLote') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo genótipo é obrigatorio.</li><br>`;
                } else {
                  let lote: any = this.loteController.listAll({ cod_lote: data.spreadSheet[keySheet][sheet] });
                  if (lote.total > 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, código do lote deve ser um campo unico no GOM.</li><br>`;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Cruza') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo cruza é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'id_s2') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo id_s2 é obrigatorio.</li><br>`;
                }
              }
            }
          }
        }
      }

      if (responseIfError == "") {
        let genotipo_atual: any = '';
        let genotipo_anterior: any = '';
        this.aux.created_by = Number(data.created_by);
        this.aux.id_culture = Number(data.id_culture);
        this.aux.status = 1;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              this.aux.genealogy = "";
              // campos genotipo
              if (configModule.response[0].fields[sheet] == 'id_s1') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.id_s1 = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'id_dados_geno') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  let geno: any = this.genotipoController.listAllGenotipos({ id_culture: data.id_culture, id_dados: data.spreadSheet[keySheet][sheet] });
                  if (geno.total > 0) {
                    this.aux.id_genotipo = geno.response[0].id;
                    this.aux.id_dados = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Genotipo') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.name_genotipo = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'NomePrincipal') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.name_main = data.spreadSheet[keySheet][sheet];
                }
              }


              if (configModule.response[0].fields[sheet] == 'NomePublico') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.name_public = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'NomeExperimental') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.name_experiment = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'NomeAlternativo') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.name_alter = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'NomeElite') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.elite_name = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Tecnologia') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  let tec: any = await this.ogmController.getAll({ id_culture: data.id_culture, name: String(data.spreadSheet[keySheet][sheet]) });
                  if (tec.total > 0) {
                    this.aux.id_tecnologia = tec.response[0].id;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Tipo') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.type = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'GMR') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.gmr = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'bgm') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.bgm = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Cruza') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.cruza = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'ProgenitorFdireito') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.progenitor_f_direto = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'ProgenitorMdireito') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.progenitor_m_direto = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'ProgenitorForigem') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.progenitor_f_origem = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'ProgenitorMorigem') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.progenitor_m_origem = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'ProgenitoresOrigem') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.progenitores_origem = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'ParentescoCompleto') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.parentesco_completo = data.spreadSheet[keySheet][sheet];
                }
              }

              //Campos lote
              if (configModule.response[0].fields[sheet] == 'id_s2') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.id_s2 = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'id_dados_lote') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  let lote: any = this.loteController.listAll({ id_dados: data.spreadSheet[keySheet][sheet] });
                  if (lote.total > 0) {
                    this.aux.id_lote = lote.response[0].id;
                    this.aux.id_dados_lote = data.spreadSheet[keySheet][sheet];
                  } else {
                    this.aux.id_dados_lote = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Ano') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.year = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'NCC') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.ncc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Safra') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.id_safra = data.id_safra;
                }
              }

              if (configModule.response[0].fields[sheet] == 'CodLote') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.cod_lote = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Fase') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.fase = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Peso') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.peso = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'QuantidadeSementes') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.quant_sementes = data.spreadSheet[keySheet][sheet];
                }
              }

              if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                if (this.aux.id_genotipo && this.aux.id_genotipo > 0) {
                  await this.genotipoController.updategenotipo({
                    id: this.aux.id_genotipo,
                    id_culture: Number(this.aux.id_culture),
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
                    created_by: this.aux.created_by,
                  });
                } else {
                  delete this.aux.id_genotipo;
                  let genotipo: any = await this.genotipoController.createGenotipo({
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
                    created_by: this.aux.created_by,
                  });
                  this.aux.id_genotipo = genotipo.response.id;
                }

                if (this.aux.id_genotipo) {
                  if (this.aux.id_lote) {
                    await this.loteController.update({
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
                      status: this.aux.status,
                      created_by: this.aux.created_by,
                    });
                    delete this.aux.id_lote;
                    delete this.aux.id_genotipo;
                  } else {
                    await this.loteController.create({
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
                      status: this.aux.status,
                      created_by: this.aux.created_by,
                    });
                    delete this.aux.id_genotipo;
                  }
                } else {
                  console.log('DROOOOOOGA');
                }
              }
            }
          }
        }
        return "save";
      }
      const responseStringError = responseIfError.join("").replace(/undefined/g, "")
      return responseStringError;
    } catch (err) {
      console.log(err)
    }
  }

  async validateLote(data: object | any) {
    const responseIfError: any = [];
    let Column: number;
    try {
      let configModule: object | any = await this.getAll(parseInt(data.moduleId));

      if (data != null && data != undefined) {
        let Line: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {

              if (configModule.response[0].fields[sheet] == 'Genotipo') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo genótipo é obrigatorio.</li><br>`;
                } else {
                  let geno = await this.genotipoController.listAllGenotipos({ genotipo: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                  if (geno.total == 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, genótipo não existe no sistema.</li><br>`;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Lote') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo Lote é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0].fields[sheet] == 'Volume') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo volume é obrigatorio.</li><br>`;
                } else {

                }
              }
            }
          }
        }
      }

      if (responseIfError == "") {
        this.aux.created_by = Number(data.created_by);
        this.aux.status = 1;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {

              if (configModule.response[0].fields[sheet] == 'Genotipo') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  let geno = await this.genotipoController.listAllGenotipos({ genotipo: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture });
                  if (geno.total > 0) {
                    this.aux.id_genotipo = geno.response[0].id;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Lote') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  let lote = await this.loteController.listAll({ name: data.spreadSheet[keySheet][sheet] });
                  if (lote.total > 0) {
                    this.aux.name = data.spreadSheet[keySheet][sheet];
                    this.aux.id = lote.response[0].id;
                  }
                  this.aux.name = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Volume') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.volume = data.spreadSheet[keySheet][sheet];
                }
              }

              if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                if (this.aux.id) {
                  await this.loteController.update(this.aux);
                } else {
                  await this.loteController.create(this.aux);
                }
              }
            }
          }
        }
        return "save";
      }
      const responseStringError = responseIfError.join("").replace(/undefined/g, "")
      return responseStringError;
    } catch (err) {
      console.log(err)
    }
  }

  async validateLocal({ spreadSheet, moduleId, id_safra, created_by }: object | any) {
    const responseIfError: any = [];
    try {
      const configModule: object | any = await this.getAll(parseInt(moduleId));
      for (let row in spreadSheet) {
        for (let column in spreadSheet[row]) {
          if (row === '0') {
            if (!(spreadSheet[row][column].toUpperCase()).includes(configModule.response[0].fields[column].toUpperCase())) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, a sequencia de colunas da planilha esta incorreta. </li> <br>`;
            }
          }
          else if (spreadSheet[0][column].includes('ID da unidade de cultura')) {

            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo ID da unidade de cultura é obrigatório. </li> <br>`;
            } else {
              const unidadeCulturaAlreadyExist = await this.unidadeCulturaController.listAll({ id_culture_unity: spreadSheet[row][column] })
              if (unidadeCulturaAlreadyExist.response.length > 0) responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo ID da unidade de cultura já esta cadastrado. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('Ano')) {

            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Ano é obrigatório. </li> <br>`;
            } else {
              const safraYearValidate = await this.safraController.getOneSafra((id_safra).toString())
              if (safraYearValidate.response?.year !== spreadSheet[row][column]) {
                responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Ano não corresponde ao ano da safra selecionada. </li> <br>`;
              }
            }

          }

          else if (spreadSheet[0][column].includes('Nome da unidade de cultura')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome da unidade de cultura é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('ID do lugar de cultura')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo ID do Lugar da cultura é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('Nome do lugar de cultura')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome do lugar de cultura é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('Rótulo')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Rótulo é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('MLOC')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo MLOC é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('Endereço')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Endereço é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('Identificador de localidade')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Identificador de localidade é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('Nome da localidade')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome da localidade é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('Identificador de região')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Identificador de região é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('Nome da região')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome da região é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('REG_LIBELLE')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Rótulo é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('ID do País')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo ID do País é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('Nome do país')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Nome do páis é obrigatório. </li> <br>`;
            }
          }

          else if (spreadSheet[0][column].includes('CNTR_LIBELLE')) {
            if (spreadSheet[row][column] === null) {
              responseIfError[Number(column)] += `<li style="text-align:left"> A ${Number(column) + 1}º coluna da ${row}º linha está incorreta, o campo Rótulo é obrigatório. </li> <br>`;
            }
          }
        }
      }

      if (responseIfError.length === 0) {
        try {
          const localCultureDTO: object | any = {}
          const unityCultureDTO: object | any = {}
          for (let row in spreadSheet) {
            if (row !== '0') {
              for (let column in spreadSheet[row]) {
                if (spreadSheet[0][column].includes('ID da unidade de cultura')) {
                  unityCultureDTO.id_culture_unity = spreadSheet[row][column]
                }
                else if (spreadSheet[0][column].includes('Ano')) {
                  unityCultureDTO.year = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('Nome da unidade de cultura')) {
                  unityCultureDTO.culture_unity_name = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('ID do lugar de cultura')) {
                  localCultureDTO.id_local_culture = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('Nome do lugar de cultura')) {
                  localCultureDTO.name_local_culture = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('CP_LIBELLE')) {
                  localCultureDTO.label = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('MLOC')) {
                  localCultureDTO.mloc = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('Endereço')) {
                  localCultureDTO.adress = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('Identificador de localidade')) {
                  localCultureDTO.id_locality = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('Nome da localidade')) {
                  localCultureDTO.name_locality = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('Identificador de região')) {
                  localCultureDTO.id_region = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('Nome da região')) {
                  localCultureDTO.name_region = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('REG_LIBELLE')) {
                  localCultureDTO.label_region = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('ID do País')) {
                  localCultureDTO.id_country = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('Nome do país')) {
                  localCultureDTO.name_country = spreadSheet[row][column]
                }

                else if (spreadSheet[0][column].includes('CNTR_LIBELLE')) {
                  localCultureDTO.label_country = spreadSheet[row][column]
                }
              }
              localCultureDTO.created_by = created_by
              unityCultureDTO.created_by = created_by
              const localAlreadyExists = await this.localController.getAllLocal({ id_local_culture: localCultureDTO.id_local_culture })
              if (localAlreadyExists.response?.length > 0) {
                // const unityCultureResponse = await this.unidadeCulturaController.listAll({ id_local: localAlreadyExists.response[0].id })
                // unityCultureDTO.id = unityCultureResponse.response[0].id
                localCultureDTO.id = localAlreadyExists.response[0].id
                unityCultureDTO.id_local = localAlreadyExists.response[0].id
                await this.localController.updateLocal(localCultureDTO)
                const response = await this.unidadeCulturaController.create(unityCultureDTO)
                console.log("Response")
                console.log(response)
              } else {
                const response = await this.localController.postLocal(localCultureDTO)
                unityCultureDTO.id_local = response?.response?.id
                await this.unidadeCulturaController.create(unityCultureDTO)
              }

            }
          }
          return "save"
        } catch (err) {
          console.log(err)
        }
      }

      const responseStringError = responseIfError.join("").replace(/undefined/g, "")
      return responseStringError;

    } catch (error) {

      console.log("Error", error)

    }
  }

  async saveDelineamento(data: any, id_delineamento: number, configModule: any) {
    let aux: object | any = {};
    let Column;

    aux.id_delineamento = id_delineamento;
    aux.created_by = data.created_by;

    for (const [keySheet, lines] of data.spreadSheet.entries()) {
      for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
        Column = Number(sheet) + 1;
        if (keySheet != '0') {
          if (configModule.response[0].fields[sheet] == 'Repeticao') {
            aux.repeticao = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (configModule.response[0].fields[sheet] == 'Sorteio') {
            aux.sorteio = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (configModule.response[0].fields[sheet] == 'Tratamento') {
            aux.nt = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (configModule.response[0].fields[sheet] == 'Bloco') {
            aux.bloco = Number(data.spreadSheet[keySheet][sheet]);
          }

          if (data.spreadSheet[keySheet].length == Column && aux != []) {
            await this.sequenciaDelineamentoController.create(aux);
          }
        }
      }
    }
  }

  async validateQuadra(data: object | any) {
    const responseIfError: any = [];
    let Column: number;

    try {
      let configModule: object | any = await this.getAll(parseInt(data.moduleId));

      if (data != null && data != undefined) {
        let larg_q: any, comp_p: any;
        let df: any = 0, cod_quadra: any, cod_quadra_anterior: any, t4_i: any = 0, t4_f: any = 0;
        let divisor_anterior: any = 0;
        let Line: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {

              if (configModule.response[0].fields[sheet] == 'Safra') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo safra é obrigatorio.</li><br>`;
                } else {
                  if (data.spreadSheet[keySheet][sheet] != data.safra) {
                    return 'A safra importada precisa ser igual a safra selecionada';
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Cultura') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo cultura é obrigatorio.</li><br>`;
                } else {
                  let culture: any = await this.culturaController.getOneCulture(Number(data.id_culture));

                  if (data.spreadSheet[keySheet][sheet].toUpperCase() != culture.response.name.toUpperCase()) {
                    return 'A cultura importada precisa ser igual a cultura selecionada';
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'LocalPrep') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o localprep cruza é obrigatorio.</li><br>`;
                } else {
                  let local: any = await this.localController.getAllLocal({ cod_local: data.spreadSheet[keySheet][sheet] });
                  if (local.total == 0) {
                    // console.log('aqui Local');
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o local não existe no sistema.</li><br>`;
                  } else {
                    this.aux.local_preparo = local.response[0].id;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'CodigoQuadra') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo código quadra é obrigatorio.</li><br>`;
                } else {
                  let quadra: any = this.quadraController.listAll({ cod_quadra: data.spreadSheet[keySheet][sheet], filterStatus: 1 });
                  if (quadra.total > 0) {
                    return 'Código quadra já existe, para poder atualiza-lo você precisa inativar o existente';
                  } else {
                    cod_quadra_anterior = cod_quadra;
                    cod_quadra = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'LargQ') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a largq é obrigatorio.</li><br>`;
                } else {
                  if (larg_q != '') {
                    if (cod_quadra == cod_quadra_anterior) {
                      if (data.spreadSheet[keySheet][sheet] != larg_q) {
                        responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a largQ precisa ser igual na planilha inteira.</li><br>`;
                        larg_q = data.spreadSheet[keySheet][sheet];
                      } else {
                        larg_q = data.spreadSheet[keySheet][sheet];
                      }
                    } else {
                      larg_q = data.spreadSheet[keySheet][sheet];
                    }
                  }

                }
              }

              if (configModule.response[0].fields[sheet] == 'CompP') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a compp é obrigatorio.</li><br>`;
                } else {
                  if (cod_quadra == cod_quadra_anterior) {
                    if (data.spreadSheet[keySheet][sheet] != comp_p) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o compP precisa ser igual na planilha inteira.</li><br>`;
                      comp_p = data.spreadSheet[keySheet][sheet];
                    } else {
                      comp_p = data.spreadSheet[keySheet][sheet];
                    }
                  } else {
                    comp_p = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'LinhaP') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a linhap é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0].fields[sheet] == 'CompC') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a compc é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0].fields[sheet] == 'Esquema') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o esquema é obrigatorio.</li><br>`;
                } else {
                  let layoutQuadra: any = this.layoutQuadraController.getAll({ esquema: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture, filterStatus: 1 });
                  if (layoutQuadra.total == 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o esquema do layout ainda não foi cadastrado.</li><br>`;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Divisor') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a divisor é obrigatorio.</li><br>`;
                } else {
                  if (cod_quadra == cod_quadra_anterior) {
                    if (divisor_anterior == 0) {
                      if (data.spreadSheet[keySheet][sheet] <= 0) {
                        responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o divisor precisa começar com 1 e ser positivo.</li><br>`;
                      } else {
                        divisor_anterior = data.spreadSheet[keySheet][sheet];
                      }
                    } else {
                      if (data.spreadSheet[keySheet][sheet] > divisor_anterior) {
                        if ((divisor_anterior + 1) != data.spreadSheet[keySheet][sheet]) {
                          responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, não pode ter intersecção de parcelas.</li><br>`;
                        }
                        divisor_anterior = data.spreadSheet[keySheet][sheet];
                      } else {
                        divisor_anterior = data.spreadSheet[keySheet][sheet];
                        responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a coluna dos divisores precisa está em sequencia.</li><br>`;
                      }
                    }
                  } else {
                    if (divisor_anterior == 0) {
                      if (data.spreadSheet[keySheet][sheet] <= 0) {
                        responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o divisor precisa começar com 1 e ser positivo.</li><br>`;
                      }
                      divisor_anterior = data.spreadSheet[keySheet][sheet];
                    } else {
                      divisor_anterior = data.spreadSheet[keySheet][sheet];
                    }
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Semente') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a semmetro é obrigatorio.</li><br>`;
                } else {
                  if (data.spreadSheet[keySheet][sheet] <= 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a semmetro precisar ser maior que 0.</li><br>`;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'T4I') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a t4i é obrigatorio.</li><br>`;
                } else {
                  if (cod_quadra == cod_quadra_anterior) {
                    if (t4_i == 0) {
                      if (data.spreadSheet[keySheet][sheet] != 1) {
                        responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o t4i precisa começar com 1.</li><br>`;
                      }
                      t4_i = data.spreadSheet[keySheet][sheet];
                    } else {
                      if (data.spreadSheet[keySheet][sheet] <= t4_f) {
                        responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o t4i precisa ser maior que a t4f anterior.</li><br>`;
                      }
                      t4_i = data.spreadSheet[keySheet][sheet];
                    }
                  } else {
                    if (data.spreadSheet[keySheet][sheet] != 1) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o t4i precisa começar com 1.</li><br>`;
                    }
                    t4_i = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'T4F') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a t4f é obrigatorio.</li><br>`;
                } else {
                  if (cod_quadra == cod_quadra_anterior) {
                    if (t4_i == 0) {
                      return 'A coluna t4f precisa está depois da coluna t4i';
                    } else {
                      if (t4_i > data.spreadSheet[keySheet][sheet]) {
                        responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o t4i e o t4f precisam estar em ordem crescente.</li><br>`;
                      } else {
                        t4_f = data.spreadSheet[keySheet][sheet];
                      }
                    }
                  } else {
                    if (t4_i == 0) {
                      return 'A coluna t4f precisa está depois da coluna t4i';
                    } else {
                      if (t4_i > data.spreadSheet[keySheet][sheet]) {
                        responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o t4i e o t4f precisam estar em ordem crescente.</li><br>`;
                      } else {
                        t4_f = data.spreadSheet[keySheet][sheet];
                      }
                    }
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'DI') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a di é obrigatorio.</li><br>`;
                } else {
                  if (data.spreadSheet[keySheet][sheet] != 1) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o di precisa ser 1. </li><br>`;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'DF') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a df é obrigatorio.</li><br>`;
                } else {
                  if (df == 0) {
                    df = data.spreadSheet[keySheet][sheet];
                  } else {
                    df = data.spreadSheet[keySheet][sheet];
                    if (cod_quadra == cod_quadra_anterior) {
                      if (df != data.spreadSheet[keySheet][sheet]) {
                        responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a coluna df deve ser igual para este pai.</li><br>`;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (responseIfError == "") {
        // this.aux = "";
        this.aux.created_by = Number(data.created_by);
        this.aux.id_culture = Number(data.id_culture);
        this.aux.status = 1;
        let count = 1;
        let tiro_fixo, disparo_fixo;

        let safra = await this.safraController.getAllSafra({ safraName: data.safra });
        this.aux.id_safra = Number(safra.response[0].id);
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {

              if (configModule.response[0].fields[sheet] == 'LocalPrep') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  // this.aux.local_preparo = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'CodigoQuadra') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if ((this.aux.cod_quadra) && this.aux.cod_quadra != data.spreadSheet[keySheet][sheet]) {
                    this.aux.disparo_fixo = this.aux.t4_f;
                    count = 1;
                  }
                  this.aux.cod_quadra = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'LargQ') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.larg_q = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'CompP') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.comp_p = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'LinhaP') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.linha_p = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'CompC') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.comp_c = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Esquema') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.esquema = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Divisor') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.divisor = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Semente') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.sem_metros = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'T4I') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.t4_i = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'T4F') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.t4_f = data.spreadSheet[keySheet][sheet];

                }
              }

              if (configModule.response[0].fields[sheet] == 'DI') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.di = data.spreadSheet[keySheet][sheet];

                }
              }

              if (configModule.response[0].fields[sheet] == 'DF') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.df = data.spreadSheet[keySheet][sheet];
                }
              }


              if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                if (count == 1) {
                  this.aux.tiro_fixo = this.aux.t4_i;

                  if (this.aux.id_quadra) {
                    let update = await this.quadraController.update({ id: this.aux.id_quadra, tiro_fixo: this.aux.tiro_fixo, disparo_fixo: this.aux.disparo_fixo });
                  }

                  let saveQuadra: any = await this.quadraController.create({
                    cod_quadra: this.aux.cod_quadra,
                    id_culture: this.aux.id_culture,
                    id_safra: this.aux.id_safra,
                    local_preparo: this.aux.local_preparo,
                    larg_q: this.aux.larg_q,
                    comp_p: this.aux.comp_p,
                    linha_p: this.aux.linha_p,
                    comp_c: this.aux.comp_c,
                    esquema: this.aux.esquema,
                    status: this.aux.status,
                    created_by: this.aux.created_by,
                  });
                  this.aux.id_quadra = saveQuadra.response.id;
                  count++;
                }

                await this.disparosController.create({
                  id_quadra: this.aux.id_quadra,
                  t4_i: this.aux.t4_i,
                  t4_f: this.aux.t4_f,
                  di: this.aux.di,
                  divisor: this.aux.divisor,
                  df: this.aux.df,
                  sem_metros: this.aux.sem_metros,
                  status: this.aux.status,
                  created_by: this.aux.created_by,
                });
              }
            }
          }
        }
        return "save";
      }
      const responseStringError = responseIfError.join("").replace(/undefined/g, "")
      return responseStringError;
    } catch (err) {
      console.log(err)
    }
  }

  async validateLayoutQuadra(data: object | any) {
    const responseIfError: any = [];
    let Column: number;

    try {
      let configModule: object | any = await this.getAll(parseInt(data.moduleId));

      if (data != null && data != undefined) {
        let cod_esquema: any = '', cod_esquema_anterior: any = '', disparo: any = 0;
        let sl: any = 0, sc: any, s_aloc: any, scolheita: any = 0, tiro: any = 0;
        let combinacao: any = '', combinacao_anterior: any = '';
        let count_linhas = 0;
        let auxTiros: object = {};
        let Line: number;
        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          Line = Number(keySheet) + 1;
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              if (configModule.response[0].fields[sheet] == 'Esquema') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o esquema é obrigatorio.</li><br>`;
                } else {
                  let esquema: any = await this.layoutQuadraController.getAll({ id_culture: data.id_culture, esquema: data.spreadSheet[keySheet][sheet], filterStatus: 1 });
                  if (esquema.total > 0) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, ja existe um esquema ativo com esse código.</li><br>`;
                  } else {
                    cod_esquema_anterior = cod_esquema;
                    cod_esquema = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Plantadeiras') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a plantadeira é obrigatorio.</li><br>`;
                } else {
                  if (Number(data.spreadSheet[keySheet][sheet]) != 4 && Number(data.spreadSheet[keySheet][sheet]) != 8 && Number(data.spreadSheet[keySheet][sheet] != 12)) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a plantadeira deve estar dentro desses numeros 4,8 e 12.</li><br>`;
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Tiro') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o tiro é obrigatorio.</li><br>`;
                } else {
                  if (tiro == 0) {
                    if (data.spreadSheet[keySheet][sheet] != 1) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o tiro precisa começar com 1.</li><br>`;
                    }
                    tiro = data.spreadSheet[keySheet][sheet];
                  } else {
                    tiro = data.spreadSheet[keySheet][sheet];
                  }
                }
              }

              if (configModule.response[0].fields[sheet] == 'Disparo') {
                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo disparos é obrigatorio.</li><br>`;
                } else {
                  if (tiro == 0) {
                    return 'O campo tiro precisa vir antes que a campo disparo';
                  } else {
                    combinacao_anterior = combinacao;
                    combinacao = tiro + 'x' + data.spreadSheet[keySheet][sheet];
                    if (combinacao == combinacao_anterior) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a combinacao de tiros e disparos deve ser unica dentro do esquema.</li><br>`;
                    }
                  }

                }
              }


              if (configModule.response[0].fields[sheet] == 'SL') {

                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo sl é obrigatorio.</li><br>`;
                } else {
                  if (cod_esquema == cod_esquema_anterior) {
                    if (data.spreadSheet[keySheet][sheet] == sl) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o sl não pode se repetir no mesmo esquema.</li><br>`;
                    }
                    count_linhas++;
                  } else {
                    tiro = 0;
                    count_linhas = 0;

                  }
                  sl = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'SC') {

                if (data.spreadSheet[keySheet][sheet] == "") {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo sc é obrigatorio.</li><br>`;
                } else {
                  if (cod_esquema == cod_esquema_anterior) {
                    if (data.spreadSheet[keySheet][sheet] == sc) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o sc não pode se repetir no mesmo esquema.</li><br>`;
                    }
                  }
                  sc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'SALOC') {
                if (data.spreadSheet[keySheet][sheet] == "" || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo saloc é obrigatorio.</li><br>`;
                } else {
                  if (cod_esquema == cod_esquema_anterior) {
                    if (data.spreadSheet[keySheet][sheet] == s_aloc) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o saloc não pode se repetir no mesmo esquema.</li><br>`;
                    }
                  }
                  s_aloc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'CJ') {
                console.log(data.spreadSheet[keySheet][sheet])
                if (data.spreadSheet[keySheet][sheet] == "" || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo cj é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'Dist') {
                console.log(data.spreadSheet[keySheet][sheet])

                if (data.spreadSheet[keySheet][sheet] == "" || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o campo dist é obrigatorio.</li><br>`;
                }
              }

              if (configModule.response[0].fields[sheet] == 'ST') {
                if (data.spreadSheet[keySheet][sheet] == "" || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a st é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0].fields[sheet] == 'SPC') {
                if (data.spreadSheet[keySheet][sheet] == "" || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a spc é obrigatorio.</li><br>`;
                } else {

                }
              }

              if (configModule.response[0].fields[sheet] == 'SColheita') {
                if (String(data.spreadSheet[keySheet][sheet]) == "" || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a scolheita é obrigatorio.</li><br>`;
                } else {
                  if (cod_esquema == cod_esquema_anterior) {
                    if (data.spreadSheet[keySheet][sheet] == scolheita) {
                      responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, o scolheita não pode se repetir no mesmo esquema.</li><br>`;
                    }
                  }
                  scolheita = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'TipoParcela') {
                if (data.spreadSheet[keySheet][sheet] == "" || data.spreadSheet[keySheet][sheet] == null) {
                  responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, a tipo parcela é obrigatorio.</li><br>`;
                } else {
                  if ((data.spreadSheet[keySheet][sheet] != "P" && data.spreadSheet[keySheet][sheet] != "p") && (data.spreadSheet[keySheet][sheet] != 'V' && data.spreadSheet[keySheet][sheet] != 'v')) {
                    responseIfError[Column - 1] += `<li style="text-align:left"> A ${Column}º coluna da ${Line}º linha está incorreta, no tipo de parcela só é aceitado p ou v.</li><br>`;
                  }
                }
              }
            }
          }
        }
      }

      if (responseIfError == "") {
        this.aux.created_by = Number(data.created_by);
        this.aux.id_culture = Number(data.id_culture);
        this.aux.status = 1;
        let count = 1;

        for (const [keySheet, lines] of data.spreadSheet.entries()) {
          for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
            Column = Number(sheet) + 1;
            if (keySheet != '0') {
              if (configModule.response[0].fields[sheet] == 'Esquema') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  if ((this.aux.esquema) && this.aux.esquema != data.spreadSheet[keySheet][sheet]) {
                    count = 1;
                  }
                  let teste = data.spreadSheet[keySheet][sheet].split('');
                  this.aux.tiroFixo = teste[0] + teste[1];
                  this.aux.disparoFixo = teste[3] + teste[4];
                  this.aux.parcelas = (Number(this.aux.tiroFixo) * Number(this.aux.disparoFixo));
                  this.aux.esquema = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Plantadeiras') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.plantadeira = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Tiro') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.tiro = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Disparo') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.disparo = data.spreadSheet[keySheet][sheet];
                }
              }


              if (configModule.response[0].fields[sheet] == 'SL') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.sl = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'SC') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.sc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'SALOC') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.s_aloc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'CJ') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.cj = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'Dist') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.dist = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'ST') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.st = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'SPC') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.spc = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'SColheita') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.scolheita = data.spreadSheet[keySheet][sheet];
                }
              }

              if (configModule.response[0].fields[sheet] == 'TipoParcela') {
                if (data.spreadSheet[keySheet][sheet] != "") {
                  this.aux.tipo_parcela = data.spreadSheet[keySheet][sheet];
                }
              }

              if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                if (count == 1) {
                  let saveLayout: any = await this.layoutQuadraController.post({
                    id_culture: Number(this.aux.id_culture),
                    esquema: this.aux.esquema,
                    plantadeira: String(this.aux.plantadeira),
                    parcelas: this.aux.parcelas,
                    tiros: Number(this.aux.tiroFixo),
                    disparos: Number(this.aux.disparoFixo),
                    status: this.aux.status,
                    created_by: this.aux.created_by,
                  });

                  this.aux.id_layout = saveLayout.response.id;
                  count++;
                }

                await this.layoutChildrenController.create({
                  id_layout: this.aux.id_layout,
                  sl: this.aux.sl,
                  sc: this.aux.sc,
                  s_aloc: this.aux.s_aloc,
                  tiro: this.aux.tiro,
                  cj: String(this.aux.cj),
                  disparo: this.aux.disparo,
                  dist: this.aux.dist,
                  st: String(this.aux.st),
                  spc: String(this.aux.spc),
                  scolheita: this.aux.scolheita,
                  tipo_parcela: this.aux.tipo_parcela,
                  status: this.aux.status,
                  created_by: this.aux.created_by,
                });
              }
            }
          }
        }
        return "save";
      }
      const responseStringError = responseIfError.join("").replace(/undefined/g, "")
      return responseStringError;
    } catch (err) {
      console.log(err)
    }
  }
}


