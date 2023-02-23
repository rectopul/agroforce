import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { PermissionRepository } from '../../repository/permission.repository';
import handleError from '../../shared/utils/handleError';
import { ProfilePermissionsRepository } from '../../repository/profile-permissions.repository';
import permissions from '../../shared/utils/permissionsGrid';

export class PermissionsController {
  permissionsRepository = new PermissionRepository();

  profilePermissionsRepository = new ProfilePermissionsRepository();

  async listAll(options: any) {
    const parameters: object | any = {};
    try {
      const profiles = await this.profilePermissionsRepository.findAll({
        profileId: Number(options.profileId),
      });
      const profilesIdList = profiles.map((profile: any) => profile.permissionId);

      const response: object | any = await this.permissionsRepository.findAll(
        parameters,
      );

      const helper: any = {};
      const result = response.reduce((r: any, o: any) => {
        const key = `${o.screenRoute}`;

        if (!helper[key]) {
          helper[key] = { ...o }; // create a copy of o
          r.push(helper[key]);
        } else if (profilesIdList.includes(helper[key].id)) {
          helper[key].action += `;${o.action}`;
        }

        return r;
      }, []);

      permissions.forEach((permission: any, index: number) => {
        permission.forEach((element: any) => {
          if (String(result[index].action).includes(element.value)) {
            element.checked = true;
          } else {
            element.checked = false;
          }
        });
      });

      const newResult = result.map((element: any, index: number) => ({
        ...element,
        permission: permissions.filter((e, ind) => index === ind),
      }));

      if (!result) {
        return {
          status: 400, result: [], message: 'nenhum resultado encontrado',
        };
      }
      return {
        status: 200, newResult, total: result.total,
      };
    } catch (error: any) {
      handleError('Permissions controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Permissions erro');
    }
  }

  async getAll(options: any) {
    const parameters: object | any = {};
    try {
      if (options.screenRoute) {
        parameters.screenRoute = options.screenRoute;
      }

      if (options.action) {
        parameters.action = options.action;
      }
      const response: object | any = await this.permissionsRepository.findAll(
        parameters,
      );

      if (!response) {
        return {
          status: 400, response: [], message: 'nenhum resultado encontrado',
        };
      }
      return {
        status: 200, response, total: response.total,
      };
    } catch (error: any) {
      handleError('Permissions controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Permissions erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.permissionsRepository.findOne(id);

      if (!response) {
        return {
          status: 400, response: [], message: 'nenhum resultado encontrado',
        };
      }

      return { status: 200, response };
    } catch (error: any) {
      handleError('Permissions controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Permissions erro');
    }
  }

  async create(data: any) {
    try {
      await this.permissionsRepository.create(data);
      return { status: 200, message: 'Permissão cadastrado' };
    } catch (error: any) {
      handleError('Permissions controller', 'Create', error.message);
      throw new Error('[Controller] - Create Permissions erro');
    }
  }

  async update(data: any) {
    try {
      const { status } = await this.getOne(Number(data.id));
      if (status !== 200) {
        return { status: 400, message: 'Permissão não encontrada' };
      }
      await this.permissionsRepository.update(Number(data.id), data);

      return { status: 200, message: 'Permissão atualizada' };
    } catch (error: any) {
      handleError('Permissions controller', 'Update', error.message);
      throw new Error('[Controller] - Update Permissions erro');
    }
  }
}
