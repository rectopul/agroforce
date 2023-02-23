/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { ProfileRepository } from '../../repository/profile.repository';
import handleError from '../../shared/utils/handleError';
import { PermissionsController } from '../permissions/permissions.controller';
import { ProfilePermissionsRepository } from '../../repository/profile-permissions.repository';

export class ProfileController {
  profileRepository = new ProfileRepository();

  permissionsController = new PermissionsController();

  profilePermissionsRepository = new ProfilePermissionsRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    try {
      const response: object | any = await this.profileRepository.findAll(
        parameters,
      );

      if (!response && response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'nenhum resultado encontrado',
        };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('Perfil  controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll Perfil  erro');
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.profileRepository.findOne(id);

      if (!response) {
        return {
          status: 400, response: [], message: 'nenhum resultado encontrado',
        };
      }

      return { status: 200, response };
    } catch (error: any) {
      handleError('Perfil  controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne Perfil  erro');
    }
  }

  async create(data: any) {
    try {
      await this.profileRepository.create(data);
      return { status: 200, message: 'Permissão cadastrado' };
    } catch (error: any) {
      handleError('Perfil  controller', 'Create', error.message);
      throw new Error('[Controller] - Create Perfil  erro');
    }
  }

  async generatePermissions(data: any) {
    try {
      let permissions: any = '';
      Object.keys(data.selecionados).map(async (key: any) => {
        data.selecionados[key] = data.selecionados[key].replaceAll(/undefined/g, '').split(',').filter((n: any) => n);

        for (const item of data.selecionados[key]) {
          const { response: permission } = await this.permissionsController.getAll({
            screenRoute: key,
            action: item,
          });
          await this.createProfilePermission({
            profileId: Number(data.profileId),
            permissionId: Number(permission[0]?.id),
          });
          permissions += `${key} --${item};`;
          console.log('🚀 ~ file: profile.controller.ts:80 ~ ProfileController ~ data.selecionados[key].forEach ~ permissions:', permissions);
        }
      });
      return permissions;
    } catch (error: any) {
      handleError('Perfil  controller', 'Generate Permissions', error.message);
      throw new Error('[Controller] - Generate Permissions Perfil  erro');
    }
  }

  async update(data: any) {
    try {
      const permissions = await this.generatePermissions(data);

      const { status } = await this.getOne(Number(data.profileId));
      if (status !== 200) {
        return { status: 400, message: 'Perfil não encontrado' };
      }
      await this.profileRepository.update(Number(data.profileId), { permissions });

      return { status: 200, message: 'Permissão atualizada' };
    } catch (error: any) {
      handleError('Perfil  controller', 'Update', error.message);
      throw new Error('[Controller] - Update Perfil  erro');
    }
  }

  async createProfilePermission(data: any) {
    try {
      const response = await this.profilePermissionsRepository.findAll({
        profileId: Number(data.profileId),
        permissionId: Number(data.permissionId),
      });
      if (response.length > 0) {
        return { status: 200, message: 'Permissão cadastrado' };
      }
      await this.profilePermissionsRepository.create(data);
      return { status: 200, message: 'Permissão cadastrado' };
    } catch (error: any) {
      handleError('Perfil  controller', 'Create', error.message);
      throw new Error('[Controller] - Create Perfil  erro');
    }
  }
}
