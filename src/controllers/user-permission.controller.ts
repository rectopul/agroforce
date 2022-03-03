import { Controller, Get, Post, Put } from '@nestjs/common';
import { UsersPermissionsRepository } from 'src/repository/user-permission.repository';

@Controller()
export class UserPermissionController {
    userPermission = new UsersPermissionsRepository();

    @Get()
    async getUserPermissions(userId: any) {
        if (typeof(userId) === 'string') {
            userId = parseInt(userId);
        }

        let response = await this.userPermission.getPermissionsByUser(userId);
        var arr2 = [];
        var arr1 = [];
        for (const property in response) {
          arr1 =response[property].profile.acess_permission.split(',');
          arr2 = arr1.concat(arr2);
        }
        if (!response) 
            throw "falha na requisição, tente novamente";

        return arr2;        
    }

    @Get()
    async getAllPermissions() {
        let response = await this.userPermission.findAll('');

        if (!response) 
            throw "falha na requisição, tente novamente";

        return response;        
    }

    @Post()
    async postUserPermission(data: object) {
        if (data != null && data != undefined) {
            let response = await this.userPermission.create(data);
            if(response.count > 0) {
                return {status: 200, message: {message: "permission criada"}}
            } else {
                return {status: 400, message: {message: "erro"}}
            }
        }
    }

    async updateUserPermision(id: string, data: object) {
        let newID = parseInt(id);
        if (data != null && data != undefined) {
            let response = await this.userPermission.update(newID, data);
            if(response) {
                return {status: 200, message: {message: "Usuario atualizada"}}
            } else {
                return {status: 400, message: {message: "usuario não existe"}}

            }
        }
    }
}
