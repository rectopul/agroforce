import { Controller, Get, Post, Put } from '@nestjs/common';
import { UserPreferenceRepository } from 'src/repository/user-preference.repository';

@Controller()
export class UserPreferenceController {
    userPreferences = new UserPreferenceRepository();

    @Get()
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
            select = {id: true, user_id: true, table_preferences: true};
        }

        if(options.user_id) {
            parameters.user_id = parseInt(options.user_id);
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

    @Get()
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

    @Put()
    async updateUserPreferences(data: object | any) {
        let id = data.id;
        const parameters: object | any = new Object();
        if (data != null && data != undefined) {

            if (data.table_preferences) {
                parameters.table_preferences = data.table_preferences;
            }
            let response = await this.userPreferences.update(id, parameters);
            if(response) {
                return {status: 200, message: {message: "preferences atualizada"}}
            } else {
                return {status: 400, message: {message: ""}}

            }
        }
    }

    @Post()
    async postUser(data: object | any) {
        const parameters: object | any = new Object();

        if (data != null && data != undefined) {
            if (typeof(data.user_id) === 'string') {
                parameters.user_id =  parseInt(data.user_id);
            } else { 
                parameters.user_id =  data.user_id;
            }

            if (typeof(data.module_id) === 'string') {
                parameters.app_login =  parseInt(data.app_login);
            } else { 
                parameters.module_id =  data.module_id;
            }

            parameters.table_preferences = data.table_preferences;

            let response = await this.userPreferences.create(parameters);

            if(response) {    
                return {status: 200, message: "users inseridos"}
            } else {
                return {status: 400, message: "houve um erro, tente novamente"}
            }
        }
    }
}
