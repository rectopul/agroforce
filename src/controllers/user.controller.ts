import {UserRepository} from '../repository/user.repository';
import { Controller, Get, Post, Put } from '@nestjs/common';

@Controller()
export class UserController {
    userRepository = new UserRepository();

    /**
     * 
     * @returns Listagem de todos usuarios.
     * @example Options: 
     * 
     */
    @Get()
    async getAllUser(options: any) {
        const parameters = new Object();
        let take; 
        let skip; 
        if (options.take) {
            if (typeof(options.status) === 'string') {
                parameters.status = parseInt(options.status);
            } else {
                parameters.status = options.status;
            }
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
        let response = await this.userRepository.findAll(parameters, take , skip );
        if (!response) 
            throw "falha na requisição, tente novamente";

        return response;        
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
    async postUser(data: object) {
        if (data != null && data != undefined) {
            let response = await this.userRepository.create(data);
            if(response.count > 0) {
                return {status: 200, message: {message: "users inseridos"}}
            } else {
                return {status: 400, message: {message: "erro"}}
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
    async updateUser(id: string, data: object) {
        let newID = parseInt(id);
        if (data != null && data != undefined) {
            let response = await this.userRepository.update(newID, data);
            if(response) {
                return {status: 200, message: {message: "Usuario atualizada"}}
            } else {
                return {status: 400, message: {message: "usuario não existe"}}

            }
        }
    }
}
