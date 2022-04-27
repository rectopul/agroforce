import { ImportRepository } from 'src/repository/import.repository';
import {SafraController} from '../controllers/safra.controller';
import {LocalController} from '../controllers/local.controller';
import {FocoController} from '../controllers/foco.controller';
import {TypeAssayController} from '../controllers/tipo-ensaio.controller';
import {OGMController} from '../controllers/ogm.controller';
import {EpocaController} from '../controllers/epoca.controller';
export class ImportController {
    importRepository = new ImportRepository();
    safraController = new SafraController();
    localController = new LocalController();
    focoController = new FocoController();
    typeAssayController = new TypeAssayController();
    ogmController = new OGMController();
    epocaController = new EpocaController();

    async getAll(moduleId: number) {
        try {   
            let response = await this.importRepository.findAll({moduleId: moduleId});
            if (response) {
                return {response, status: 200}
            } else { 
                return {status: 400, message: "ainda não há configuração de planilha para esse modulo!"};
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
                    return {status: 200, message: {message: "config planilha criada"}}
                } else {
                    return {status: 400, message: {message: "erro"}}
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    async validateGeneral(data: object | any) {
        try {
            if (data != null && data != undefined) {

                if (!data.moduleId) return {status: 400, message: "precisa ser informado o modulo que está sendo acessado!"};

                let configModule: object | any = await this.getAll(parseInt(data.moduleId));

                if (configModule.status != 200) return {status: 400, message: "Primeiro é preciso configurar o modelo de planilha para esse modulo!"};

                let response:any;
    
                if (data.moduleId == 1) {
                    response = await this.validateNPE(data);
                    response = response.replace(/\\n/g, '<br>')
                } 
                return {status: 200, message: response};
            }
        } catch (err) {
            console.log(err)
        }
    }

    async validateNPE(data: object | any) {
        var Resposta: string = '';
        try {

            if (data != null && data != undefined) {
                let configModule: object | any = await this.getAll(parseInt(data.moduleId));
                let Line: number;
                let Column: number;
                for (const [keySheet, lines] of data.spreadSheet.entries()) {
                    Line = Number(keySheet) + 1;
                    for (const [sheet, columns] of data.spreadSheet[keySheet].entries()) {
                         Column = Number(sheet) + 1;
                        if (keySheet != '0') {                          
                            if (configModule.response[0].fields[sheet] == 'Local') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) == 'string') {
                                        let local: any = await this.localController.getAllLocal({name: data.spreadSheet[keySheet][sheet]});
                                        if (local.total == 0) {      
                                            Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, O Local não existe no sistema`;
                                        }
                                    } else {
                                        Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, Local deve ser um campo de texto`;
                                    }
                                } else {
                                    Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome do Local é obrigatorio`;
                                } 
                            }

                            if (configModule.response[0].fields[sheet] == 'Safra') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) == 'string') {
                                        let safras: any = await this.safraController.getAllSafra({year: data.spreadSheet[keySheet][sheet]});
                                        if (safras.total == 0) {
                                            Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, A Safra${Column}  não existe no sistema`;
                                        }
                                    } else { 
                                        Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, Safra deve ser um campo de texto`;
                                    }
                                } else {
                                    Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome da Safra é obrigatorio`;
                                }                              
                            } 
                            
                            if (configModule.response[0].fields[sheet] == 'OGM') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) == 'string') {
                                        let ogm: any = await this.ogmController.getAll({name: data.spreadSheet[keySheet][sheet]});
                                        if (ogm.total == 0) {
                                            Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, O OGM informado não existe no sistema`;
                                        }
                                    } else { 
                                        Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, OGM deve ser um campo de texto!`;
                                    }
                                } else {
                                    Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome do OGM é obrigatorio`;
                                }
                            }
                            
                            if (configModule.response[0].fields[sheet] == 'Foco') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) == 'string') {
                                        let foco: any = await this.focoController.listAllFocos({name: data.spreadSheet[keySheet][sheet]});
                                        if (foco.total == 0) {
                                            Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, O Foco não existe no sistema`;
                                        }
                                    } else { 
                                        Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, Foco deve ser um campo de texto`;
                                    }
                                } else {
                                    Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome do Foco é obrigatorio`;
                                }                 
                            } 
                            
                            if (configModule.response[0].fields[sheet] == 'Ensaio') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) == 'string') {
                                        let ensaio: any = await this.typeAssayController.getAll({name: data.spreadSheet[keySheet][sheet]});
                                        if (ensaio.total == 0) {      
                                            Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, O Tipo de Ensaio não existe no sistema`;
                                        }
                                    } else { 
                                        Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, Tipo de Ensaio deve ser um campo de texto`;
                                    }
                                } else {
                                    Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome do Tipo de Ensaio é obrigatorio`;
                                }
                            } 
                            
                            if (configModule.response[0].fields[sheet] == 'Epoca') {
                                if (data.spreadSheet[keySheet][sheet] != "") {
                                    if (typeof(data.spreadSheet[keySheet][sheet]) == 'string') {
                                        let epoca: any = await this.epocaController.listAll({name: data.spreadSheet[keySheet][sheet]});
                                        if (epoca.total == 0) {      
                                            Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, A Epoca não existe no sistema`;
                                        }
                                    } else { 
                                        Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, Epoca deve ser um campo de texto`;
                                    }
                                } else {
                                    Resposta += `\nA ${Column}º coluna da ${Line}º linha está incorreta, Campo com nome do Epoca é obrigatorio`;
                                }   
                            }

                            if (configModule.response[0].fields[sheet] == "NPE") {
                                Resposta += "";
                            }
                        }
                    }
                }
            }
            return Resposta;
        } catch (err) {
            // console.log(err)
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
}

