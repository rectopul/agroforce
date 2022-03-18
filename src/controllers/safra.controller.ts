import {SafraRepository} from '../repository/safra.repository';
import { Controller, Get, Post, Put } from '@nestjs/common';
import { functionsUtils } from 'src/shared/utils/functionsUtils';

import {ISafraPropsDTO} from '../shared/dtos/ISafraPropsDTO';
import { validationSafra } from '../shared/validations/safra/create.validation';

@Controller()
export class SafraController {
    safraRepository = new SafraRepository();

    /**
     * 
     * @returns Listagem de todas as safras.
     * @example Options: 
     * 
     */
    @Get()
    async getAllSafra(options: any) {
        const parameters: object | any = new Object();
        let take; 
        let skip;
        let orderBy: object | any;
        let select: any = [];

        if (options.status) {
            if (typeof(options.status) === 'string') {
                parameters.status = parseInt(options.status);
            } else {
                parameters.status = options.status;
            }
        }

        if (options.name) {
            parameters.name = options.name;
        }

        if (options.cpf) {
            parameters.cpf = options.cpf;
        }
        
        if (options.tel) {
            parameters.tel = options.tel;
        }

        if (options.departmentId) {
            parameters.departmentId = options.departmentId;
        }

        if (options.registration) {
            parameters.registration = options.registration;
        }

        if (options.email) {
            parameters.email = options.email;
        }

        if (options.take) {
            if (typeof(options.take) === 'string') {
                take = parseInt(options.take);
            } else {
                take = options.take;
            }
        }

        if (options.skip) {
            if (typeof(options.skip) === 'string') {
                skip = parseInt(options.skip);
            } else {
                skip = options.skip;
            }
        }
        
        let response: object | any = await this.safraRepository.findAll(parameters, select, take , skip, orderBy);
        if (!response) { 
            throw "falha na requisição, tente novamente";
        } else {
            return {status: 200, response, total: response.total}
        }        
    }

    @Get()
    async getOneSafra(id: number | any) {
        let newID = parseInt(id);
        if (id && id != '{id}') {
            let response = await this.safraRepository.findOne(newID); 
            if (!response) {
               return {status: 400, message: 'Safra não existe'};
            } else {
                return {status:200 , response};
            }
        } else {
            return {status:405, response:{error: 'id não informado'}};
        }
    }

    @Post()
    async postSafra(data: ISafraPropsDTO) {
        try {
            const safraRepository = new SafraRepository();

            // Validação
            const valid = validationSafra.isValidSync(data);

            if (!valid) throw new Error('Dados inválidos');

            // Salvando

            await safraRepository.create(data);

            return {status: 200, message: "Safra inserida"}
        } catch(err) {
            console.log(err);
            return { status: 404, message: "Erro"}
        }
    }

    /**
    * @returns Função responsavel por fazer a atualização da safra 
    * @parameters data. objeto com as informações a serem atualizadas
     */
    @Put()
    async updateSafra(data: object| any) {
        if (data != null && data != undefined) {
            const parameters: object | any  = new Object();

            if (typeof(data.status) === 'string') {
                parameters.status =  parseInt(data.status);
            } else { 
                parameters.status =  data.status;
            }

            if (typeof(data.app_login) === 'string') {
                parameters.app_login =  parseInt(data.app_login);
            } else { 
                parameters.app_login =  data.app_login;
            }

            if (typeof(data.jivochat) === 'string') {
                parameters.jivochat =  parseInt(data.jivochat);
            } else { 
                parameters.jivochat =  data.jivochat;
            }

            if (typeof(data.departmentId) === 'string') {
                parameters.departmentId =  parseInt(data.departmentId);
            } else { 
                parameters.departmentId =  data.departmentId;
            }

            if (!data.name) throw 'Informe o nome do usuário';
            if (!data.email) throw 'Informe o email do usuário';
            if (!data.cpf) throw 'Informe o cpf do usuário';
            if (!data.tel) throw 'Informe o telefone do usuário';
            if (!data.password) throw 'Informe a senha do usuário';
            if (!data.departmentId) throw 'Informe o departamento do usuário';
            if (!data.created_by) throw 'Informe quem está tentando criar um usuário';

            // Validação cpf é valido
            if(!functionsUtils.validationCPF(data.cpf)) throw 'CPF invalído';

            parameters.name = data.name;
            parameters.email = data.email;
            parameters.cpf = data.cpf;
            parameters.tel = data.tel;
            parameters.password = data.password;
            parameters.created_by = data.created_by;

            let response: object | any  = await this.safraRepository.update(data.id, parameters);

            if(response.count > 0) {
                if (data.profiles) {
                    const parametersPermissions = new Object();
                    // functionsUtils.getPermissions(data.id, data.profiles);
                    // Object.keys(data.profiles).forEach((item) => {
                    //     if (typeof(data.profiles[item].profileId) === 'string') {
                    //         parametersPermissions.profileId =  parseInt( data.profiles[item].profileId);
                    //     } else { 
                    //         parametersPermissions.profileId = data.profiles[item].profileId;
                    //     }
                    //     parametersPermissions.SafraId = data.id;
                    //     parametersPermissions.created_by = data.created_by;
                    //     this.SafrasPermissionRepository.create(parametersPermissions);
                    // });
                }
                return {status: 200, message: {message: "Usuario atualizada"}}
            } else {
                return {status: 400, message: {message: "usuario não existe"}}

            }
        }
    }
}
