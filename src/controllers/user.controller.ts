import {UserService} from '../repository/user.repository';
import { Controller, Get, Post, Put } from '@nestjs/common';

@Controller()
export class UserController {
    userService = new UserService();

    /**
     * 
     * @returns Listagem de todos usuarios.
     * @example Options: 
     * {
        "select": {"id": true, "name": true, "token": true},
        "where": {
            "id": 1
        },
        "paginate": false
        }
     */
    @Get()
    async getAllUser(options: object) {
        let select: any;
        let where: any;
        let paginate: boolean;

        if (options.select) {
            select = options.select;
        }

        if (options.where) {
            where = options.where   ;
        }

        if (options.paginate) {
            paginate = options.paginate;
        }

        let response = await this.userService.findAll(select, where, paginate);
        return response;        
    }

    @Get()
    async getOneUser(id: string) {
        let newID = parseInt(id);
        if (id && id != '{id}') {
            let response = await this.userService.findOne(newID); 
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
            let response = await this.userService.create(data);
            if(response.count > 0) {
                return {status: 200, message: {message: "cultura inserida"}}
            } else {
                return {status: 400, message: {message: "erro"}}
            }
        }
    }

    /**
     * @returns Função responsavel por verificar se o usuario que está tentando logar, é um usuario do sistema. 
     * @requires Object contendo o email e a senha do usuario que está tentando fazer o login. 
     */  
    @Post()
    async signinUSer(data: object) {
        if (data != null && data != undefined) {
            return await this.userService.signIn(data);
        }
    }

    /**
    * @returns Função responsavel por fazer a atualização do usuario 
    * @requires id do usuario a ser editado
     */
    async updateUser(id: string, data: object) {
        let newID = parseInt(id);
        if (data != null && data != undefined) {
            let response = await this.userService.update(newID, data);
            if(response) {
                return {status: 200, message: {message: "Usuario atualizada"}}
            } else {
                return {status: 400, message: {message: "usuario não existe"}}

            }
        }
    }
}
