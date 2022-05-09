import { ImportRepository } from 'src/repository/import.repository';
import {SafraController} from '../controllers/safra.controller';
import {LocalController} from '../controllers/local.controller';
import {FocoController} from '../controllers/foco.controller';
import {TypeAssayController} from '../controllers/tipo-ensaio.controller';
import {TecnologiaController} from '../controllers/tecnologia.controller';
import {EpocaController} from '../controllers/epoca.controller';
import {NpeController} from '../controllers/npe.controller';
import {DelineamentoController} from '../controllers/delineamento.controller';
import {SequenciaDelineamentoController} from '../controllers/sequencia-delineamento.controller';

export class ImportController {
    importRepository = new ImportRepository();
    safraController = new SafraController();
    localController = new LocalController();
    focoController = new FocoController();
    typeAssayController = new TypeAssayController();
    ogmController = new TecnologiaController();
    epocaController = new EpocaController();
    npeController = new NpeController();
    delineamentoController = new DelineamentoController();
    sequenciaDelineamentoController = new SequenciaDelineamentoController();

    aux: object | any = {};

    async getAll(moduleId: number) {
        try {   
            let response = await this.importRepository.findAll({moduleId: moduleId});
            if (response) {
                return {response, status: 200}
            } else { 
                return {status: 200, message: "ainda não há configuração de planilha para esse modulo!"};
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
                let response = await this.importRepository.create(parameters);
                if(response.count > 0) {
                    return {status: 200, message: "Configuração da planilha foi salva"}
                } else {
                    return {status: 400, message: "erro"}
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    async delete(moduleId: number) {
        try {
            if(moduleId) {
                let response: object | any  = await this.importRepository.delete({moduleId: moduleId});
                return {status: 200, response}

            } else {
                return {status: 400, message: "id não informado"}
            }
        } catch (err) {
            return {status: 400, message: err}
        }  
    }

    async validateGeneral(data: object | any) {
        try {
            if (data != null && data != undefined) {

                if (!data.moduleId) return {status: 400, message: "precisa ser informado o modulo que está sendo acessado!"};

                let configModule: object | any = await this.getAll(parseInt(data.moduleId));

                if (configModule.response == "") return {status: 200, message: "Primeiro é preciso configurar o modelo de planilha para esse modulo!"};

                let response:any;
                let erro: any = false;

                // Validação do modulo Delineamento
                if (data.moduleId == 7) {
                    response = await this.validateDelineamento(data);
                    if (response == 'save') {
                       response = "Items cadastrado com sucesso!";
                    } else { 
                        erro = true;
                    }
                }

                // Validação do modulo NPE
                if (data.moduleId == 14) {
                    response = await this.validateNPE(data);
                    if (response == 'save') {
                       response = "Items cadastrado com sucesso!";
                    } 
                }
                return {status: 200, message: response, erro};
            }
        } catch (err) {
            console.log(err)
        }
    }

    async validateNPE(data: object | any) {
        var Resposta: string = '';
        let npeiAnterior: number = 0;
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
                                    if (typeof(data.spreadSheet[keySheet][sheet]) == 'string') {
                                        let local: any = await this.localController.getAllLocal({name: data.spreadSheet[keySheet][sheet]});
                                        if (local.total == 0) {      
                                            // console.log('aqui Local');
                                            Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O Local não existe no sistema.</span><br>`;
                                        }  else {
                                            this.aux.id_local = local.response[0].id;
                                        }
                                    } else {
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Local deve ser um campo de texto.</span><br>`;
                                    }
                                } else {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome do Local é obrigatorio.</span><br>`;
                                } 
                            }

                            if (configModule.response[0].fields[sheet] == 'Safra') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) == 'string') {
                                        let validateSafra: any = await this.safraController.getOneSafra(Number(data.safra));
                                        if (data.spreadSheet[keySheet][sheet] != validateSafra.response.year) {
                                            return "A safra a ser importada tem que ser a mesma selecionada!";
                                        }
                                        let safras: any = await this.safraController.getAllSafra({year: data.spreadSheet[keySheet][sheet]});
                                        if (safras.total == 0) {
                                            // console.log('aqui Safra');
                                            Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, A Safra não existe no sistema.</span><br>`;
                                        } else {
                                            this.aux.id_safra = safras.response[0].id;
                                        }
                                    } else { 
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Safra deve ser um campo de texto.</span><br>`;
                                    }
                                } else {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome da Safra é obrigatorio.</span><br>`;
                                }                              
                            } 
                            
                            if (configModule.response[0].fields[sheet] == 'OGM') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                        let ogm: any = await this.ogmController.getAll({name: String(data.spreadSheet[keySheet][sheet])});
                                        if (ogm.total == 0) {
                                            // console.log('aqui OGM');
                                            Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O Tecnologia informado não existe no sistema.</span><br>`;
                                        } else {
                                            this.aux.id_ogm = ogm.response[0].id;
                                        }
                                } else {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome do Tecnologia é obrigatorio.</span><br>`;
                                }
                            }
                            
                            if (configModule.response[0].fields[sheet] == 'Foco') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) == 'string') {
                                        let testeFoco: any = await this.focoController.listAllFocos({group: data.foco, name: data.spreadSheet[keySheet][sheet]});
                                        
                                        if (testeFoco.total == 0) {
                                            return "O foco a ser importado tem que fazer parte do grupo selecionado!";
                                        }

                                        let foco: any = await this.focoController.listAllFocos({name: data.spreadSheet[keySheet][sheet]});
                                        if (foco.total == 0) {
                                            // console.log('aqui Foco');
                                            Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O Foco não existe no sistema.</span><br>`;
                                        } else {
                                            this.aux.id_foco = foco.response[0].id;
                                        }
                                    } else { 
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Foco deve ser um campo de texto.</span><br>`;
                                    }
                                } else {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome do Foco é obrigatorio.</span><br>`;
                                }                 
                            } 
                            
                            if (configModule.response[0].fields[sheet] == 'Ensaio') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) == 'string') {
                                        let ensaio: any = await this.typeAssayController.getAll({name: data.spreadSheet[keySheet][sheet]});
                                        if (ensaio.total == 0) {  
                                            // console.log('aqui Ensaio');
                                            Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O Tipo de Ensaio não existe no sistema.</span><br>`;
                                        } else {
                                            this.aux.id_type_assay = ensaio.response[0].id;
                                        }
                                    } else { 
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Tipo de Ensaio deve ser um campo de texto.</span><br>`;
                                    }
                                } else {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome do Tipo de Ensaio é obrigatorio.</span><br>`;
                                }
                            } 
                            
                            if (configModule.response[0].fields[sheet] == 'Epoca') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    let epoca: any = await this.epocaController.listAll({name: String(data.spreadSheet[keySheet][sheet])});
                                    if (epoca.total == 0) {      
                                        // console.log('aqui Epoca');
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, A Epoca não existe no sistema.</span><br>`;
                                    } else {
                                        this.aux.id_epoca = epoca.response[0].id;
                                    }
                                } else {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome do Epoca é obrigatorio.</span><br>`;
                                }   
                            }

                            if (configModule.response[0].fields[sheet] == "NPEI") {
                                if (data.spreadSheet[keySheet][sheet] != "") {                    
                                    if (typeof(data.spreadSheet[keySheet][sheet]) == 'number') {
                                        if (npeiAnterior > data.spreadSheet[keySheet][sheet]) {
                                            Resposta += `<span>O NPEI tem que está em ordem crescente </br>.</span><br>`;
                                        } else {
                                            Resposta += await this.npeController.validateNpeiDBA({Column: Column, Line: Line, safra: data.safra, foco: data.foco, npei: data.spreadSheet[keySheet][sheet]});
                                            if (Resposta == "") {
                                                this.aux.npei = data.spreadSheet[keySheet][sheet];
                                            }
                                            npeiAnterior = data.spreadSheet[keySheet][sheet];
                                        }
                                    } else { 
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, NPEI deve ser um campo de texto.</span><br>`;
                                    }
                                } else {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome do NPEI é obrigatorio.</span><br>`;
                                }
                            }
                        }
                    }
                }
            }

            if (Resposta == "") {
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
                                let local: any = await this.localController.getAllLocal({name: data.spreadSheet[keySheet][sheet]});
                                this.aux.id_local = local.response[0].id;
                            }

                            if (configModule.response[0].fields[sheet] == 'Safra') {
                                // console.log("Safra R");
                                this.aux.id_safra = Number(data.safra);                              
                            } 
                            
                            if (configModule.response[0].fields[sheet] == 'OGM') {
                                // console.log("OGM R");
                                let ogm: any = await this.ogmController.getAll({name: String(data.spreadSheet[keySheet][sheet])});
                                this.aux.id_ogm = ogm.response[0].id;
                            }
                            
                            if (configModule.response[0].fields[sheet] == 'Foco') {
                                // console.log("FOCO R");
                                this.aux.id_foco = Number(data.foco);              
                            } 
                            
                            if (configModule.response[0].fields[sheet] == 'Ensaio') {
                                // console.log("Ensaio R");
                                let ensaio: any = await this.typeAssayController.getAll({name: data.spreadSheet[keySheet][sheet]});
                                this.aux.id_type_assay = ensaio.response[0].id;
                            } 
                            
                            if (configModule.response[0].fields[sheet] == 'Epoca') {
                                // console.log("Epoca R");
                                let epoca: any = await this.epocaController.listAll({name: String(data.spreadSheet[keySheet][sheet])});
                                this.aux.id_epoca = epoca.response[0].id;
                            }

                            if (configModule.response[0].fields[sheet] == "NPEI") {
                                this.aux.npei = data.spreadSheet[keySheet][sheet];
                            }

                            if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                                this.npeController.post(this.aux);
                            }
                        }
                    }
                }
                return "save";
            }
            return Resposta;
        } catch (err) {
            console.log(err)
        }
    }

    async validateDelineamento(data: object | any) {
        var Resposta: string = '';
        let Column: number;

        try {
            let configModule: object | any = await this.getAll(parseInt(data.moduleId));
            let trat_anterior: any;
            let sorteio_anterior: number = 0;
            let repeticao: number = 1;
            let countTrat = 0;

            if (data != null && data != undefined) {

                let delineamento: any = await this.delineamentoController.getAll({name: data.delineamento});

                if (delineamento.total > 0) {
                    return `<span> Delineamento informado já está cadastrado no sistema.</span><br>`;
                }

                let Line: number;
                for (const [keySheet, lines] of data.spreadSheet.entries()) {
                    Line = Number(keySheet) + 1;
                    for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {     
                        Column = Number(sheet) + 1;
                        if (keySheet != '0') {

                            if (configModule.response[0].fields[sheet] == 'Repeticao') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) != 'number') {
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, A Repetição tem que ser um numero.</span><br>`;
                                    } else {
                                        if (data.spreadSheet[keySheet][sheet] > repeticao) { 
                                            repeticao ++;
                                            countTrat = 1;
                                        } else {
                                            countTrat++;
                                        }
                                    }
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'Sorteio') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) != 'number') {
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O campo sorteio tem que ser um numero.</span><br>`;
                                    } else { 
                                        if (sorteio_anterior > data.spreadSheet[keySheet][sheet]) {
                                            return 'A coluna de sorteio deve está em ordem crescente.';
                                        }
                                    }
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'Tratamento') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) != 'number') {
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O Tratamento tem que ser um numero.</span><br>`;
                                    }
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'Bloco') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) != 'number') {
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O Bloco tem que ser um numero.</span><br>`;
                                    }
                                }
                            }
                       }
                    }
                }
            }

            if (Resposta == "") {
                let delineamento: any = await this.delineamentoController.post({id_culture: data.id_culture, name: data.delineamento, repeticao: repeticao, trat_repeticao: countTrat, status: 1, created_by: data.created_by});

                if (delineamento) {
                    this.aux.id_delineamento = delineamento.response.id;
                }

                this.aux.created_by = data.created_by;

                for (const [keySheet, lines] of data.spreadSheet.entries()) {
                    for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {  
                        Column = Number(sheet) + 1;
                        if (keySheet != '0') {
                            if (configModule.response[0].fields[sheet] == 'Repeticao') {
                               this.aux.repeticao = Number(data.spreadSheet[keySheet][sheet]);
                            }

                            if (configModule.response[0].fields[sheet] == 'Sorteio') {
                               this.aux.sorteio = Number(data.spreadSheet[keySheet][sheet]);
                            }

                            if (configModule.response[0].fields[sheet] == 'Tratamento') {
                                this.aux.nt = Number(data.spreadSheet[keySheet][sheet]);
                            }

                            if (configModule.response[0].fields[sheet] == 'Bloco') {
                                this.aux.bloco = Number(data.spreadSheet[keySheet][sheet]);
                            }

                            if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                                console.log(this.aux);
                                // this.sequenciaDelineamentoController.create(this.aux);
                            }
                        }
                    }
                }
                return "save";
            }
            return Resposta;
        } catch (err) {
            console.log(err)
        }
    }
}

