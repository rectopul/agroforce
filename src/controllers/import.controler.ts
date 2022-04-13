import { ImportRepository } from 'src/repository/import.repository';
import {SafraController} from '../controllers/safra.controller';
import {LocalController} from '../controllers/local.controller';
import {FocoController} from '../controllers/foco.controller';
import {TypeAssayController} from '../controllers/tipo-ensaio.controller';
import {OGMController} from '../controllers/ogm.controller';

export class ImportController {
    importRepository = new ImportRepository();
    safraController = new SafraController();
    localController = new LocalController();
    focoController = new FocoController();
    typeAssayController = new TypeAssayController();
    ogmController = new OGMController();

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
                console.log(parameters)
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

                switch (data.moduleId) {
                    case 1:
                        this.validateNPE(data);
                        break;
                }
            
                // console.log(await configModule.response);
            }
        } catch (err) {
            console.log(err)
        }
    }

    async validateNPE(data: object | any) {
        try {
            if (data != null && data != undefined) {
                if (!data.moduleId) return {status: 400, message: "precisa ser informado o modulo que está sendo acessado!"};

                let configModule: object | any = await this.getAll(parseInt(data.moduleId));

                if (configModule.status != 200) return {status: 400, message: "Primeiro é preciso configurar o modelo de planilha para esse modulo!"};
                Object.keys(configModule.response[0].fields[0]).forEach((key,item) => {
                    switch (configModule.response[0].fields[item][key]) {
                        case 'Local':
                            Object.keys(data.spreadSheet).forEach(async (keySheet, item) => {
                                if (keySheet != '0') { 
                                    if (data.spreadSheet[keySheet][key] != "") {
                                        if (typeof(data.spreadSheet[keySheet][key]) == 'string') {
                                            let locais: any = await this.localController.getAllLocal({name: data.spreadSheet[keySheet][key]});
                                            if (locais.total == 0) {
                                                return {status: 404, message: `O Local ${data.spreadSheet[keySheet][key]}  não existe no sistema`}
                                            }
                                        } else { 
                                            return {status: 404, message: "A informação esperada para coluna de nome do local é um texto"}
                                        }
                                    } else {
                                        return {status: 404, message: "A Coluna com o Nome do Local é obrigatório"}
                                    }
                                }
                            });
                            break;
                        case 'Safra':   
                            Object.keys(data.spreadSheet).forEach(async (keySheet, item) => {
                                console.log(data.spreadSheet[parseInt(keySheet)][key]) 
                                    if (data.spreadSheet[keySheet][key] != "") {
                                        if (typeof(data.spreadSheet[keySheet][key]) == 'string') {
                                            let safras: any = await this.safraController.getAllSafra({year: data.spreadSheet[keySheet][key]});
                                            if (safras.total == 0) {
                                                return {status: 404, message: `A Safra ${data.spreadSheet[keySheet][key]}  não existe no sistema`}
                                            }
                                        } else { 
                                            return {status: 404, message: "Safra não existe no sistema"}
                                        }
                                    } else {
                                        return {status: 404, message: "Campo com nome da Safra é obrigatorio"}
                                    }
                                
                            });
                            break;
                        case 'Foco':   
                            Object.keys(data.spreadSheet).forEach(async (keySheet, item) => {
                                if (data.spreadSheet[keySheet][key] != "") {
                                    if (typeof(data.spreadSheet[keySheet][key]) == 'string') {
                                        let safras: any = await this.focoController.listAllFocos({name: data.spreadSheet[keySheet][key]});
                                        if (safras.total == 0) {
                                            return {status: 404, message: `O Foco ${data.spreadSheet[keySheet][key]}  não existe no sistema`}
                                        }
                                    } else { 
                                        return {status: 404, message: "Foco deve ser um campo de texto"}
                                    }
                                } else {
                                    return {status: 404, message: "Campo com nome do Foco é obrigatorio"}
                                }
                                
                            });
                            break;
                        case 'Ensaio':   
                            Object.keys(data.spreadSheet).forEach(async (keySheet, item) => {
                                if (data.spreadSheet[keySheet][key] != "") {
                                    if (typeof(data.spreadSheet[keySheet][key]) == 'string') {
                                        let safras: any = await this.typeAssayController.getAll({name: data.spreadSheet[keySheet][key]});
                                        if (safras.total == 0) {
                                            return {status: 404, message: `O Tipo de Ensaio ${data.spreadSheet[keySheet][key]}  não existe no sistema`}
                                        }
                                    } else { 
                                        return {status: 404, message: "Tipo de Ensaio deve ser um campo de texto"}
                                    }
                                } else {
                                    return {status: 404, message: "Campo com nome do Tipo de Ensaio é obrigatorio"}
                                }
                            });
                            break;
                        default:
                            break;
                    }
                });
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
}
