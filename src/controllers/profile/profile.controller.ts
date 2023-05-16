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
import {UserPermissionController} from "../user-permission.controller";
import {UsersPermissionsRepository} from "../../repository/user-permission.repository";

export class ProfileController {
  profileRepository = new ProfileRepository();

  permissionsController = new PermissionsController();

  profilePermissionsRepository = new ProfilePermissionsRepository();

  reporteController = new ReporteController();

  userPermissionController = new UserPermissionController();

  usersPermissionsRepository = new UsersPermissionsRepository();

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

      if (options.filterSearch) {
        parameters.name = JSON.parse(`{"contains":"${options.filterSearch}"}`);
      }

      select = {
        id: true,
        name: true,
        permissions: true,
        createdAt: true,
        createdBy: true,
        
      };
      
      if(options.showUsersPermissions == true || options.showUsersPermissions == 'true'){
        let users_permissions = {
          select: {
            id: true,
              cultureId: true,
              profileId: true,
              userId: true,
              status: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  status: true,
                }
              },
          }
        };
        
        // add users_permissions to select
        select.users_permissions = users_permissions;
      }

      if (options.orderBy) {
        orderBy = `{"${options.orderBy}":"${options.typeOrder}"}`;
      }
      
      const response: object | any = await this.profileRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy
      );
      
      if (!response && response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'nenhum resultado encontrado',
        };
      }

      if(options.showUsersPermissions == true || options.showUsersPermissions == 'true') {
        response.forEach((rowData: any, index: number): any => {
          // find users_permissions with user with status == 1
          const users_permissions_actives = rowData.users_permissions.filter((user_permission: {
            cultureId: number;
            profileId: number;
            userId: number;
            status: number;
            user: { id: number; name: string; status: number };
          }) => user_permission.user.status == 1);
          rowData.users_permissions_actives = users_permissions_actives.length;
        });
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
      
      console.log('profileId:', data.profileId, Number(data.profileId));
      
      for (const key of selecionados) {
        data.selecionados[key] = data.selecionados[key].replaceAll(/undefined/g, '').split(',').filter((n: any) => n);

        for (const item of data.selecionados[key]) {
          const { response: permission } = await this.permissionsController.getAll({
            screenRoute: key,
            action: item,
          });
          
          if(permission.length == 0) 
            continue;
          
          let dataProfilePermission = {
            profileId: Number(data.profileId),
            permissionId: Number(permission[0]?.id),
          };
          
          await this.createProfilePermission(dataProfilePermission);
          
          permissions += `${key} --${item};`;
        }
      }
      return permissions;
    } catch (error: any) {
      handleError('Perfil  controller', 'Generate Permissions', error.message);
      throw new Error('[Controller] - Generate Permissions Perfil  erro'+error.message);
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
      
      console.log('data', data);
      
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
  
  async deleted(data: any) {
    // flag para excluir dependencias
    const deleteDependences = false;
    
    try {
      if (!data.id) 
        throw new Error('Dados inválidos');

      const { status: status, response:response } = await this.getOne(Number(data.id));

      const { ip } = await fetch('https://api.ipify.org/?format=json')
        .then((results) => results.json())
        .catch(() => '0.0.0.0');

      const {status:statusPermissions, response: responsePermissions} = await this.profilePermissionsRepository.findAll({
        profileId: Number(data.id),
      });
      
      const responseUP = await this.usersPermissionsRepository.findAll({
        profileId: Number(data.id),
      });

      console.log('statusPermissions', statusPermissions, 'responsePermissions', responsePermissions);
      console.log('responseUP', responseUP);
      
      let userNames:string[] = [];
      let usersActive:string[] = [];

      if (responseUP.length > 0) {
        responseUP.forEach((item: any) => {
          
          // verifica se o usuário já foi adicionado
          if (item.user.name && userNames.findIndex((name) => name == item.user.name) == -1) {
            userNames.push(item.user.name);
            // armaena os usuários ativos
            if (item.user.status === 1) {
              usersActive.push(item.user.id);
            }
          }
        });
      }
      
      // se deleteDependeces == true ou não houver usuários ativos remove todas as permissões;
      if (deleteDependences || usersActive.length == 0) {
        // remove todas as permissões relacionadas ao perfil
        await this.usersPermissionsRepository.delete({
          profileId: Number(data.id),
        });
      } else {
        // se houver usuários ativos retorna o erro mostrando quais usuários estão utilizando o perfil
        if (usersActive.length > 0) {
          let userString = (userNames.length)?'- ' + userNames.join('<br/>- '):'';
          return {
            status: 400,
            message: `Este perfil não pode ser excluído, pois está sendo utilizado pelos usuários:<br/>${userString}`
          };
        }
      }
      
      await this.reporteController.create({
        userId: data.userId, module: 'PERFIL', operation: 'EXCLUSÃO', oldValue: data.id, ip: String(ip),
      });
      
      await this.profileRepository.delete(Number(data.id));
      
      return { status: 200, message: 'Perfil excluido com sucesso!' };
      
      /*const { ip } = await fetch('https://api.ipify.org/?format=json')
        .then((results) => results.json())
        .catch(() => '*/
    } catch (error: any) {
      
      handleError('Lista de ensaio controller', 'Delete', error.message);
      throw new Error('[Controller] - Delete perfil erro: '+ error.message);
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
