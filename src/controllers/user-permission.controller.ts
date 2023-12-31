import { UsersPermissionsRepository } from 'src/repository/user-permission.repository';

export class UserPermissionController {
  userPermission = new UsersPermissionsRepository();

  async getUserPermissions(userId: any) {
    try {
      if (typeof (userId) === 'string') {
        userId = Number(userId);
      }

      // const response = await this.userPermission.getPermissionsByUser(userId);
      // const arr2: any = [];
      // const arr1: any = [];
      // for (const property in response) {
      // arr1 =response[property].profile.acess_permission.split(',');
      // arr2 = arr1.concat(arr2);
      // }
      // if (!response)
      //     throw "falha na requisição, tente novamente";

      // return arr2;
    } catch (err) {

    }
  }

  async getAllPermissions() {
    try {
      const response = await this.userPermission.findAll('');

      if (!response) throw 'falha na requisição, tente novamente';

      return response;
    } catch (err) {

    }
  }

  async getPermissions(userId: number, distinct: boolean = false) {
    try {
      const response = await this.userPermission.findPermissions(Number(userId));
      const aux: any = {};
      
      if(!distinct){
        const result = response.reduce((r: any, o: any) => {
          const key = `${o.cultureId}`;

          if (!aux[key]) {
            aux[key] = { ...o };
            r.push(aux[key]);
          } else {
            aux[key].profile.permissions += `${o.profile.permissions}`;
          }

          return r;
        }, []);
        return { status: 200, response: result };
      } else {
        return { status: 200, response: response };
      }
      
      if (!response || response.length === 0) {
        return { status: 400, response: [], message: 'usuario não tem cultura' };
      }
      
    } catch (error) {
      return { status: 400, message: error };
    }
  }

  async getByUserID(userId: number | any) {
    const newID = Number(userId);
    try {
      if (userId && userId !== '{id}') {
        const response = await this.userPermission.findAllByUser(newID);
        if (!response || response.length === 0) {
          return { status: 400, response: [], message: 'usuario não tem cultura' };
        }
        return { status: 200, response };
      }
      return { status: 405, response: { error: 'id não informado' } };
    } catch (err) {
      return { status: 400, message: err };
    }
  }

  async post(data: object | any) {
    try {
      if (data !== null && data !== undefined) {
        // esta linha está errada neste local, está excluindo todas as permissões do usuário e inserindo apenas a ultima;
        // await this.delete(Number(data.userId));
        data.status = 0;
        const response = await this.userPermission.create(data);
        if (response.count > 0) {
          return { status: 200, message: { message: 'permission criada' } };
        }
        return { status: 400, message: { message: 'erro' } };
      }
    } catch (err) {
      return { status: 400, message: { message: 'erro' } };
    }
  }

  async updateCultures(data: object | any) {
    try {
      if (data !== null && data !== undefined) {
        const parameters: object | any = {};

        if (typeof (data.status) === 'string') {
          parameters.status = Number(data.status);
        } else {
          parameters.status = data.status;
        }
        await this.userPermission.queryRaw(Number(data.idUser), Number(data.cultureId));
        return { status: 200 };
      }
    } catch (err) {
      return { status: 400, message: err };
    }
  }

  async updateAllStatusCultures(userId: any) {
    try {
      await this.userPermission.updateAllStatus(userId);
    } catch (err) {
      return { status: 400, message: err };
    }
  }

  async delete(userId: number) {
    try {
      if (userId) {
        const response: object | any = await this.userPermission.delete({ userId });
        return { status: 200, response };
      }
      return { status: 400, message: 'id não informado' };
    } catch (err) {
      return { status: 400, message: err };
    }
  }
}
