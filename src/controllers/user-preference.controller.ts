import { UserPreferenceRepository } from '../repository/user-preference.repository';
import handleError from '../shared/utils/handleError';

export class UserPreferenceController {
  userPreferences = new UserPreferenceRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;

    try {
      let select:any = {};

      if (options.showModule) {
        select = {
          id: true,
          userId: true,
          modules: { select: { id: true, module: true } },
          table_preferences: true,
          route_usage: true,
          identifier_extra: true,
        };
      } else {
        select = {
          id: true,
          userId: true,
          table_preferences: true,
          route_usage: true,
          identifier_extra: true,
        };
      }

      if (options.id) {
        parameters.id = Number(options.id);
      }

      if (options.userId) {
        parameters.userId = Number(options.userId);
      }

      if (options.module_id) {
        parameters.module_id = Number(options.module_id);
      }

      if (options.route_usage) {
        // parameters.route_usage = JSON.parse(`{"${equalsOrContains}":"${options.filterName}"}`);
        parameters.route_usage = {
          equals: options.route_usage,
        };
      }

      const response: object | any = await this.userPreferences.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      if (!response || response.total <= 0) {
        return {
          status: 400, response: [], total: 0, itens_per_page: response.itens_per_page,
        };
      }
      return {
        status: 200, response, total: response.total, itens_per_page: response.itens_per_page,
      };
    } catch (error: any) {
      handleError('User Preferences controller', 'getAll', error.message);
      throw new Error('[Controller] - getAll User Preferences erro');
    }
  }

  async getConfigGerais() {
    try {
      const parameters: object | any = {};
      let take;
      let skip;
      let orderBy: object | any;
      const select: any = { id: true, itens_per_page: true };

      const response: any = await this.userPreferences.findAllConfigGerais(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );

      if (!response) {
        return { status: 400, response: [] };
      }
      return { status: 200, response };
    } catch (error: any) {
      handleError('User Preferences controller', 'getConfig', error.message);
      throw new Error('[Controller] - getConfig User Preferences erro');
    }
  }

  async update(data: object | any) {
    try {
      const response = await this.userPreferences.update(Number(data.id), data);
      if (response) {
        return { status: 200, response, message: 'Preferencias de usuário atualizada' };
      }
      return { status: 400, response, message: 'Preferencias de usuário não atualizada' };
    } catch (error: any) {
      handleError('User Preferences controller', 'Update', error.message);
      throw new Error('[Controller] - Update User Preferences erro');
    }
  }

  async create(data: object | any) {
    try {
      const response = await this.userPreferences.create(data);
      if (response) {
        return { status: 200, response };
      }
      return { status: 400, message: 'houve um erro, tente novamente' };
    } catch (error: any) {
      handleError('User Preferences controller', 'create', error.message);
      throw new Error(`[Controller] - create User Preferences erro: ${error.message}`);
    }
  }

  async delete(id: number) {
    try {
      if (id) {
        const response: object | any = await this.userPreferences.delete(id);
        return { status: 200, response };
      }
      return { status: 400, message: 'id não informado' };
    } catch (err) {
      return { status: 400, message: err };
    }
  }
}
