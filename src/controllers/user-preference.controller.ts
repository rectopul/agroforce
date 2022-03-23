import { UserPreferenceRepository } from 'src/repository/user-preference.repository';

export class UserPreferenceController {
    userPreferences = new UserPreferenceRepository();

    async getAllPreferences(options: any) {
        const parameters: object | any = new Object();
        let take; 
        let skip;
        let orderBy: object | any;
        let select: any = [];

        if (options.paramSelect) {
            let objSelect = options.paramSelect.split(',');
            Object.keys(objSelect).forEach((item) => {
                select[objSelect[item]] = true;
            });
            select = Object.assign({}, select);
        } else {
            select = {id: true, userId: true, table_preferences: true};
        }

        if(options.userId) {
            parameters.userId = parseInt(options.userId);
        }

        if(options.module_id) {
            parameters.module_id = parseInt(options.module_id);
        }

        let response: object | any = await this.userPreferences.findAll(parameters,select, take , skip, orderBy );

        if (!response) {
            throw "falha na requisição, tente novamente";
        } else {
            return {status: 200, response, total: response.total, itens_per_page: response.itens_per_page}
        }    
    }

    async getConfigGerais(options: any) {
        const parameters: object | any = new Object();
        let take; 
        let skip;
        let orderBy: object | any;
        let select: any = {id: true, itens_per_page: true};

        let response: object | any = await this.userPreferences.findAllconfigGerais(parameters,select, take , skip, orderBy);

        if (!response) {
            throw "falha na requisição, tente novamente";
        } else {
            return {status: 200, response}
        }    
    }

    async updateUserPreferences(data: object | any) {
        let id = data.id;
        const parameters: object | any = new Object();
        if (data != null && data != undefined) {

            if (data.table_preferences) {
                parameters.table_preferences = data.table_preferences;
            }

            if (data.userId) {
                parameters.userId = data.userId;
            }

            if (data.module_id) {
                parameters.module_id = data.module_id;
            }

            let response = await this.userPreferences.update(id, parameters);
            if(response) {
                return {status: 200, message: {message: "preferences atualizada"}}
            } else {
                return {status: 400, message: {message: ""}}

            }
        }
    }

    async postUser(data: object | any) {
        const parameters: object | any = new Object();

        if (data != null && data != undefined) {
            if (typeof(data.userId) === 'string') {
                parameters.userId =  parseInt(data.userId);
            } else { 
                parameters.userId =  data.userId;
            }

            if (typeof(data.module_id) === 'string') {
                parameters.app_login =  parseInt(data.app_login);
            } else { 
                parameters.module_id =  data.module_id;
            }

            parameters.table_preferences = data.table_preferences;

            let response = await this.userPreferences.create(parameters);
            if(response) {    
                return {status: 200, response}
            } else {
                return {status: 400, message: "houve um erro, tente novamente"}
            }
        }
    }
}
