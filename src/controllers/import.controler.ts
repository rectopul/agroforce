import { ImportRepository } from 'src/repository/import.repository';

export class ImportController {
    importRepository = new ImportRepository();

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
                data.fields = JSON.stringify(data.fields);
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

    async validateInfoTable(data: object | any) {
        try {
            if (data != null && data != undefined) {

                if (!data.moduleId) return {status: 400, message: "precisa ser informado o modulo que está sendo acessado!"};

                let configModule: object | any = await this.getAll(parseInt(data.moduleId));
                console.log(configModule.response);
                if (configModule.status != 200) return {status: 400, message: "Primeiro é preciso configurar o modelo de planilha para esse modulo!"};


                           // let Test=  new Object();
                data.planilha = {"fields": {"A": 'name_local', "B": 'name_ogm'}};
                        
                Object.keys(configModule.response[0].fields).forEach((key, item) => {
                    if (key === "A") {
                        console.log(configModule.response.fields[key])
                        if (configModule.response.fields[key][0] == 'string' && typeof(data.planilha[key]) != 'string') console.log('A coluna ' + key + ' espera uma string'); 
                        if (configModule.response.fields[key][0] == 'int' && typeof(data.planilha[key]) != 'number') console.log('A coluna ' + key + ' espera um número'); 
                        // console.log(configModule.response.fields[key]);
                    } else if (key === "B") {
                        if (configModule.response.fields[key][0] == 'string' && typeof(data.planilha[key]) != 'string') console.log('A coluna ' + key + ' espera uma string'); 
                        if (configModule.response.fields[key][0] == 'int' && typeof(data.planilha[key]) != 'number') console.log('A coluna ' + key + ' espera um número'); 
                    }
                });
            // console.log(Test)
            }
        } catch (err) {
            console.log(err)
        }
    }

    async updateCultures(data: object| any) {
        try {
            if (data != null && data != undefined) {
                const parameters: object | any  = new Object();

                if (typeof(data.status) === 'string') {
                    parameters.status =  parseInt(data.status);
                } else { 
                    parameters.status =  data.status;
                }
                await this.userPermission.queryRaw(parseInt(data.idUser), parseInt(data.cultureId));
                return {status: 200}
            }
        } catch (err) {
            console.log(err)
            return {status: 400, message: err}
        }  
    }

    async updateAllStatusCultures(userId: any) {
        try {
            await this.userPermission.updateAllStatus(userId);
        } catch (err) {
            return {status: 400, message: err}
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
