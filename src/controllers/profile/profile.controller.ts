/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { ProfileRepository } from '../../repository/profile.repository';
import handleError from '../../shared/utils/handleError';
import { PermissionsController } from '../permissions/permissions.controller';
import { ProfilePermissionsRepository } from '../../repository/profile-permissions.repository';
import { ReporteController } from '../reportes/reporte.controller';
import {removeEspecialAndSpace} from "../../shared/utils/removeEspecialAndSpace";

export class ProfileController {
  profileRepository = new ProfileRepository();

  permissionsController = new PermissionsController();

  profilePermissionsRepository = new ProfilePermissionsRepository();

  reporteController = new ReporteController();

  async getAll(options: any) {
    
    options = await removeEspecialAndSpace(options);
    
    const parameters: object | any = {};
    
    try {

      let take;
      let skip;
      let orderBy: object | any;
      let select: any = [];

      if (options.take) {
        if (typeof options.take === 'string') {
          take = Number(options.take);
        } else {
          take = options.take;
        }
      }

      if (options.skip) {
        if (typeof options.skip === 'string') {
          skip = Number(options.skip);
        } else {
          skip = options.skip;
        }
      }

      select = {
        id: true,
        name: true,
        permissions: true,
        createdAt: true,
        createdBy: true,
      };
      
      /*
      acess_permission String?
  permissions      String?  @db.LongText
  createdAt        DateTime @default(now())
  createdBy        Int?

  profile_permissions profile_permissions[]
  user_profile        user_profile[]
  users_permissions   users_permissions[]
       */
      // v2
      const response: object | any = await this.profileRepository.findAll(
        parameters,
        select,
        take,
        skip,
        '',
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
      // verifica se o perfil já existe
      const profileAlreadyExists = await this.profileRepository.findByName(data.name);
      if (profileAlreadyExists) return { status: 400, message: 'Perfil já existente' };

      const { ip } = await fetch('https://api.ipify.org/?format=json')
        .then((results) => results.json())
        .catch(() => '0.0.0.0');
      
      data.acess_permission = `"${data.name}"`;
      await this.reporteController.create({
        userId: data.createdBy, module: 'PERFIL', operation: 'CRIAÇÃO', oldValue: data.name, ip: String(ip),
      });
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
      const selecionados = Object.keys(data.selecionados);
      for (const key of selecionados) {
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
        }
      }
      return permissions;
    } catch (error: any) {
      handleError('Perfil  controller', 'Generate Permissions', error.message);
      throw new Error('[Controller] - Generate Permissions Perfil  erro');
    }
  }

  async update(data: any) {
    try {
      
      if (data.name) {
        
        const profile = await this.profileRepository.findOne(data.id);

        if (!profile) 
          return {status: 400, message: 'Perfil não encontrado'};
        
        const profileAlreadyExists = await this.profileRepository.findByName(data.name);

        if (profileAlreadyExists && profileAlreadyExists.id !== profile.id) 
          return {status: 400, message: 'Época já existente'};

        const { ip } = await fetch('https://api.ipify.org/?format=json')
          .then((results) => results.json())
          .catch(() => '0.0.0.0');
        
        await this.reporteController.create({
          userId: data.createdBy, module: 'PERFIL', operation: 'EDIÇÃO', oldValue: data.name, ip: String(ip),
        });
        
        await this.profileRepository.update(Number(data.id), data);

        return { status: 200, message: 'Perfil atualizado' };
      }
      await this.profilePermissionsRepository.deleteAll({
        profileId: Number(data.profileId),
      });
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
      await this.profilePermissionsRepository.create(data);
      return { status: 200, message: 'Permissão cadastrado' };
    } catch (error: any) {
      handleError('Perfil  controller', 'Create', error.message);
      throw new Error('[Controller] - Create Perfil  erro');
    }
  }
}
