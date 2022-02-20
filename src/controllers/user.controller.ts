import {UserService} from '../services/user.service';
import { Controller, Get, Post, Put } from '@nestjs/common';
@Controller()
export class UserController {
    userService = new UserService();

    @Get()
    getAllUser() {
        let response =  this.userService.findAll();
        return response;        
    }

    @Get()
    async getOneUser(id: string) {
        let newID = parseInt(id);
        if (id && id != '{id}') {
            let response = await this.userService.findOne(newID); 
            if (!response) {
               return {status: 400, response:{error: 'cultura não existe'}};
            } else {
                return {status:200 ,response: response};
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

    @Post()
    async signinUSer(data: object) {
        if (data != null && data != undefined) {
            let response = await this.userService.signIn(data);
            if(response) {
                return {status: 200, response}
            } else {
                return {status: 400, message:"Erro"}
            }
        }
    }


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
