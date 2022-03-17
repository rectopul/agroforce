import {UserRepository} from '../repository/user.repository';
import { UsersPermissionsRepository } from 'src/repository/user-permission.repository';
import { Controller, Get, Post, Put } from '@nestjs/common';
import { functionsUtils } from 'src/shared/utils/functionsUtils';

@Controller()
export class UserController {
    userRepository = new UserRepository();
    usersPermissionRepository = new UsersPermissionsRepository();

    /**
     * 
     * @returns Listagem de todos usuarios.
     * @example Options: 
     * 
     */
    @Get()
    async getAllUser(options: any) {
        const parameters: object | any = new Object();
        let take; 
        let skip;
        let orderBy: object | any;
        let select: any = [];

        if (options.filterStatus) {
            if (typeof(options.status) === 'string') {
                options.filterStatus = parseInt(options.filterStatus);
                if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
            } else {
                if (options.filterStatus != 2) parameters.status =parseInt(options.filterStatus);
            }
        }

        if (options.filterSearch) {
            options.filterSearch=  '{"contains":"' + options.filterSearch + '"}';
            parameters.name  = JSON.parse(options.filterSearch);
            parameters.email =JSON.parse(options.filterSearch);
        }

        if (options.paramSelect) {
            let objSelect = options.paramSelect.split(',');
            Object.keys(objSelect).forEach((item) => {
                select[objSelect[item]] = true;
            });
            select = Object.assign({}, select);
        } else {
            select = {id: true, name: true, cpf:true, email:true, tel:true, avatar:true, status: true};
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

        if (options.orderBy) {
            orderBy = '{"' + options.orderBy + '":"' + options.typeOrder + '"}';
        }
        
        let response: object | any = await this.userRepository.findAll(parameters,select, take , skip, orderBy );

        if (!response) { 
            throw "falha na requisição, tente novamente";
        } else {
            return {status: 200, response, total: response.total}
        }        
    }

    @Get()
    async getOneUser(id: string) {
        let newID = parseInt(id);
        if (id && id != '{id}') {
            let response = await this.userRepository.findOne(newID); 
            if (!response) {
               return {status: 400, message: 'user não existe'};
            } else {
                return {status:200 , response};
            }
        } else {
            return {status:405, response:{error: 'id não informado'}};
        }
    }

    @Post()
    async postUser(data: object | any) {
        const parameters: object | any = new Object();
        const parametersPermissions: object | any  = new Object();

        if (data != null && data != undefined) {
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

            if (!data.name) return {status: 400, message: 'Informe o nome do usuário'};
            if (!data.email) return {status: 400, message: 'Informe o email do usuário'}; 
            if (!data.cpf) return {status: 400, message: 'Informe o cpf do usuário'};
            if (!data.tel) return {status: 400, message: 'Informe o telefone do usuário'};
            if (!data.departmentId) return {status: 400, message: 'Informe o departamento do usuário'};
            if (!data.password) return {status: 400, message: 'Informe a senha do usuário'};

            // Validação de email existente. 
            let validateEmail: object | any = await this.getAllUser({email:data.email});
            if (validateEmail[0])return {status: 400, message: 'Email ja cadastrado'};

            // Validação de cpf existente. 
            let validateCPF: object | any  = await this.getAllUser({cpf:data.cpf});
            if (validateCPF[0]) return {status: 400, message: 'CPF já cadastrado'};

            // Validação cpf é valido
            if(!functionsUtils.validationCPF(data.cpf))  return {status: 400, message: 'CPF invalído'};

            parameters.name = data.name;
            parameters.email = data.email;
            parameters.cpf = data.cpf;
            parameters.tel = data.tel;
            parameters.password = data.password;
            parameters.created_by = data.created_by;

            let response = await this.userRepository.create(parameters);

            if(response) {
                if (data.profiles) {
                    Object.keys(data.profiles).forEach((item) => {
                        if (typeof(data.profiles[item].profileId) === 'string') {
                            parametersPermissions.profileId =  parseInt( data.profiles[item].profileId);
                        } else { 
                            parametersPermissions.profileId = data.profiles[item].profileId;
                        }
                        parametersPermissions.userId = response.id;
                        parametersPermissions.created_by = data.created_by;
                        this.usersPermissionRepository.create(parametersPermissions);
                    });
                }
    
                return {status: 200, message: "users inseridos"}
            } else {
                return {status: 400, message: "houve um erro, tente novamente"}
            }
        }
    }

    /**
     * @returns Função responsavel por verificar se o usuario que está tentando logar, é um usuario do sistema. 
     * @parameters Object contendo o email e a senha do usuario que está tentando fazer o login. 
     */  
    @Post()
    async signinUSer(data: object) {
        if (data != null && data != undefined) {
            return await this.userRepository.signIn(data);
        }
    }

    /**
    * @returns Função responsavel por fazer a atualização do usuario 
    * @requires id do usuario a ser editado
    * @parameters data. objeto com as informações a serem atualizadas
     */
    @Put()
    async updateUser(data: object| any) {
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

            if (data.name) {
                parameters.name = data.name;
            } 

            if (data.email) {
                parameters.email = data.email;
            } 

            if (data.cpf) {
                if(!functionsUtils.validationCPF(data.cpf)) return {message: 'CPF invalído'};
                parameters.cpf = data.cpf;
            }

            if (data.tel) {
                parameters.tel = data.tel;
            }

            if (data.password) {
                parameters.password = data.password;
            }

            if (data.created_by) {
                parameters.created_by = data.created_by;
            }

            let response: object | any  = await this.userRepository.update(data.id, parameters);

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
                    //     parametersPermissions.userId = data.id;
                    //     parametersPermissions.created_by = data.created_by;
                    //     this.usersPermissionRepository.create(parametersPermissions);
                    // });
                }
                return {status: 200, message: {message: "Usuario atualizada"}}
            } else {
                return {status: 400, message: {message: "usuario não existe"}}

            }
        }
    }
}
