import { UsersPermissionsRepository } from 'src/repository/user-permission.repository';

export class UserPermissionController {
    userPermission = new UsersPermissionsRepository();

    async getUserPermissions(userId: any) {
        try {
            if (typeof(userId) === 'string') {
                userId = parseInt(userId);
            }

            let response = await this.userPermission.getPermissionsByUser(userId);
            var arr2: any = [];
            var arr1: any = [];
            for (const property in response) {
            arr1 =response[property].profile.acess_permission.split(',');
            arr2 = arr1.concat(arr2);
            }
            if (!response) 
                throw "falha na requisição, tente novamente";

            return arr2;       
        } catch (err) {

        } 
    }

    async getAllPermissions() {
        try {
            let response = await this.userPermission.findAll('');

            if (!response) 
                throw "falha na requisição, tente novamente";

            return response;        
        } catch (err) {

        }
    }

    async postUserPermission(data: object) {
        try {
            if (data != null && data != undefined) {
                let response = await this.userPermission.create(data);
                if(response.count > 0) {
                    return {status: 200, message: {message: "permission criada"}}
                } else {
                    return {status: 400, message: {message: "erro"}}
                }
            }
        } catch (err) {

        }
    }

    async updateUserPermision(id: string, data: object) {
        try {
            let newID = parseInt(id);
            if (data != null && data != undefined) {
                let response = await this.userPermission.update(newID, data);
                if(response) {
                    return {status: 200, message: {message: "Usuario atualizada"}}
                } else {
                    return {status: 400, message: {message: "usuario não existe"}}

                }
            }
        } catch (err) {

        }
    }
}
