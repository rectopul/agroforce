import { ImportRepository } from 'src/repository/import.repository';
import {SafraController} from '../controllers/safra.controller';
import {LocalController} from '../controllers/local.controller';
import {FocoController} from '../controllers/foco.controller';
import {TypeAssayController} from '../controllers/tipo-ensaio.controller';
import {TecnologiaController} from '../controllers/tecnologia.controller';
import {NpeController} from '../controllers/npe.controller';
import {DelineamentoController} from '../controllers/delineamento.controller';
import {SequenciaDelineamentoController} from '../controllers/sequencia-delineamento.controller';
import {GenotipoController} from '../controllers/genotipo.controller';
import {LoteController} from '../controllers/lote.controller';

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

                // Validação do modulo Local
                if (data.moduleId == 4) {
                    response = await this.validateLocal(data);
                    if (response.save) {                    
                        response = "Itens cadastrado com sucesso!";
                    } else { 
                        erro = true;
                    }
                }
                // Validação do modulo Delineamento
                if (data.moduleId == 7) {
                    response = await this.validateDelineamento(data);
                    if (response.save) {
                        await this.saveDelineamento(data, response.id_delineamento, configModule);
                        response = "Itens cadastrado com sucesso!";
                    } else { 
                        erro = true;
                    }
                }

                // Validação do modulo Genotipo
                if (data.moduleId == 10) {
                    response = await this.validateGenotipo(data);
                    if (response == 'save') {
                        response = "Itens cadastrado com sucesso!";
                    } else { 
                        erro = true;
                    }
                }

                // Validação do modulo Lote
                if (data.moduleId == 12) {
                    response = await this.validateLote(data);
                    if (response == 'save') {
                        response = "Itens cadastrado com sucesso!";
                    } else { 
                        erro = true;
                    }
                }

                // Validação do modulo NPE
                if (data.moduleId == 14) {
                    response = await this.validateNPE(data);
                    if (response == 'save') {
                       response = "Itens cadastrado com sucesso!";
                    } else { 
                        erro = true;
                    }
                }

                return {status: 200, message: response, error: erro};
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
                                        let local: any = await this.localController.getAllLocal({cod_local: data.spreadSheet[keySheet][sheet]});
                                        if (local.total == 0) {      
                                            // console.log('aqui Local');
                                            Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, o local não existe no sistema.</span><br>`;
                                        }  else {
                                            this.aux.id_local = local.response[0].id;
                                        }
                                    } else {
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, local deve ser um campo de texto.</span><br>`;
                                    }
                                } else {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, campo com nome do local é obrigatorio.</span><br>`;
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
                                let local: any = await this.localController.getAllLocal({cod_local: data.spreadSheet[keySheet][sheet]});
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
                                this.aux.epoca = String(data.spreadSheet[keySheet][sheet]);
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

                return {save: true, id_delineamento: delineamento.response.id};
            }
            return Resposta;
        } catch (err) {
            console.log(err)
        }
    }

    async validateGenotipo(data: object | any) {
        var Resposta: string = '';
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
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O campo Genótipo é obrigatorio.</span><br>`;
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'Cruza') {
                                if (data.spreadSheet[keySheet][sheet] == "") {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O campo Cruza é obrigatorio.</span><br>`;
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'Tecnologia') {
                                if (data.spreadSheet[keySheet][sheet] == "") {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O campo Técnologia é obrigatorio.</span><br>`;
                                } else { 
                                    let tec:any = await this.ogmController.getAll({id_culture: data.id_culture, name: String(data.spreadSheet[keySheet][sheet])});

                                    if (tec.total == 0) {
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, A Técnologia informado não existe no sistema.</span><br>`;
                                    }
                                }
                            }
                       }
                    }
                }
            }

            if (Resposta == "") {
                // this.aux = "";
                this.aux.created_by = Number(data.created_by);
                this.aux.id_culture = Number(data.id_culture);
                this.aux.status =1;
                for (const [keySheet, lines] of data.spreadSheet.entries()) {
                    for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {     
                        Column = Number(sheet) + 1;
                        if (keySheet != '0') {
                            this.aux.genealogy = "";
                            if (configModule.response[0].fields[sheet] == 'Genotipo') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    let geno = await this.genotipoController.listAllGenotipos({genotipo: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture});
                                    if (geno.total > 0) {
                                        this.aux.id = geno.response[0].id;
                                        this.aux.genotipo = geno.response[0].genotipo;
                                    } else {
                                        this.aux.id =0;
                                        this.aux.genotipo =data.spreadSheet[keySheet][sheet];
                                    }
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'Cruza') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    this.aux.cruza =data.spreadSheet[keySheet][sheet];
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'Tecnologia') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    this.aux.id_tecnologia =data.spreadSheet[keySheet][sheet];
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'Genealogy') {
                                this.aux.genealogy =data.spreadSheet[keySheet][sheet];
                            }
                       }

                       if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                        if (this.aux.id && this.aux.id > 0) {
                            await this.genotipoController.updategenotipo(this.aux);
                        } else {
                            delete  this.aux.id;
                            await this.genotipoController.createGenotipo(this.aux);
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

    async validateLote(data: object | any) {
        var Resposta: string = '';
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
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O campo Genótipo é obrigatorio.</span><br>`;
                                } else {
                                    let geno = await this.genotipoController.listAllGenotipos({genotipo: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture});
                                    if (geno.total == 0) {
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, Genótipo não existe no sistema.</span><br>`;
                                    }
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'Lote') {
                                if (data.spreadSheet[keySheet][sheet] == "") {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O campo Lote é obrigatorio.</span><br>`;
                                } else {

                                }
                            } 

                            if (configModule.response[0].fields[sheet] == 'Volume') {
                                if (data.spreadSheet[keySheet][sheet] == "") {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O campo Volume é obrigatorio.</span><br>`;
                                } else {
                                    
                                }
                            }
                       }
                    }
                }
            }

            if (Resposta == "") {
                this.aux.created_by = Number(data.created_by);
                this.aux.status =1;
                for (const [keySheet, lines] of data.spreadSheet.entries()) {
                    for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {     
                        Column = Number(sheet) + 1;
                        if (keySheet != '0') {

                            if (configModule.response[0].fields[sheet] == 'Genotipo') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    let geno = await this.genotipoController.listAllGenotipos({genealogy: data.spreadSheet[keySheet][sheet], id_culture: data.id_culture});
                                    if (geno.total > 0) {
                                        this.aux.id_genotipo = geno.response[0].id;
                                    }
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'Lote') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    this.aux.name =data.spreadSheet[keySheet][sheet];
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'Volume') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    this.aux.volume =data.spreadSheet[keySheet][sheet];
                                }
                            }

                            if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                                await this.loteController.create(this.aux);
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

    async validateLocal(data: object | any) {
        var Resposta: string = '';
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

                            if (configModule.response[0].fields[sheet] == 'CodLocal') {
                                if (data.spreadSheet[keySheet][sheet] == "") {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O campo código local é obrigatorio.</span><br>`;
                                } else {
                                    let local = await this.localController.getAllLocal({cod_local: data.spreadSheet[keySheet][sheet]});
                                    if (local.total > 0) {
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, código local ja cadastrado no sistema.</span><br>`;
                                    }
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'CodRedLocal') {
                                if (data.spreadSheet[keySheet][sheet] == "") {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, O campo código reduzido do local é obrigatorio.</span><br>`;
                                } else {
                                    let local = await this.localController.getAllLocal({cod_red_local: data.spreadSheet[keySheet][sheet]});
                                    if (local.total > 0) {
                                        Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, código reduzido do local ja cadastrado no sistema.</span><br>`;
                                    }
                                }
                            }

                            if (configModule.response[0].fields[sheet] == 'pais') {
                                if (data.spreadSheet[keySheet][sheet] == "") {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta,  pais é obrigatorio.</span><br>`;
                                }
                            } 

                            if (configModule.response[0].fields[sheet] == 'uf') {
                                if (data.spreadSheet[keySheet][sheet] == "") {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, estado é obrigatorio.</span><br>`;
                                } 
                            }

                            if (configModule.response[0].fields[sheet] == 'city') {
                                if (data.spreadSheet[keySheet][sheet] == "") {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, cidade é obrigatorio.</span><br>`;
                                } 
                            }

                            if (configModule.response[0].fields[sheet] == 'NameFarm') {
                                if (data.spreadSheet[keySheet][sheet] == "") {
                                    Resposta += `<span> A ${Column}º coluna da ${Line}º linha está incorreta, nome da fazenda é obrigatorio.</span><br>`;
                                } 
                            }
                       }
                    }
                }
            }

            if (Resposta == "") {
                this.aux.created_by = Number(data.created_by);
                this.aux.status =1;
                for (const [keySheet, lines] of data.spreadSheet.entries()) {
                    for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {     
                        Column = Number(sheet) + 1;
                        if (keySheet != '0') {

                            if (configModule.response[0].fields[sheet] == 'CodLocal') {
                                this.aux.cod_local = data.spreadSheet[keySheet][sheet];
                            }

                            if (configModule.response[0].fields[sheet] == 'CodRedLocal') {
                                this.aux.cod_red_local = data.spreadSheet[keySheet][sheet];
                            }

                            if (configModule.response[0].fields[sheet] == 'pais') {
                                this.aux.pais = data.spreadSheet[keySheet][sheet];
                            } 

                            if (configModule.response[0].fields[sheet] == 'uf') {
                                this.aux.uf = data.spreadSheet[keySheet][sheet];
                            }

                            if (configModule.response[0].fields[sheet] == 'city') {
                                this.aux.city = data.spreadSheet[keySheet][sheet];
                            }

                            if (configModule.response[0].fields[sheet] == 'NameFarm') {
                                this.aux.name_farm = data.spreadSheet[keySheet][sheet];
                            }
                           
                            if (configModule.response[0].fields[sheet] == 'Altitude') {
                                this.aux.altitude = data.spreadSheet[keySheet][sheet];
                            }

                            if (configModule.response[0].fields[sheet] == 'Latitude') {
                                this.aux.latitude = data.spreadSheet[keySheet][sheet];
                            }

                            if (configModule.response[0].fields[sheet] == 'Longitude') {
                                this.aux.longitude = data.spreadSheet[keySheet][sheet];
                            }

                            if (data.spreadSheet[keySheet].length == Column && this.aux != []) {
                                await this.loteController.create(this.aux);
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
                        // console.log(aux);;
                        await this.sequenciaDelineamentoController.create(aux);
                    }
                }
            }
        }
    }
}

