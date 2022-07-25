import { UserPreferenceRepository } from '../repository/user-preference.repository';
import handleError from '../shared/utils/handleError';

export class UserPreferenceController {
  userPreferences = new UserPreferenceRepository();

  async getAllPreferences(options: any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;

    try {
      const select = { id: true, userId: true, table_preferences: true };

      if (options.userId) {
        parameters.userId = Number(options.userId);
      }

      if (options.module_id) {
        parameters.module_id = Number(options.module_id);
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

  async updateUserPreferences(data: object | any) {
    const { id } = data;
    const parameters: object | any = {};
    try {
      if (data.table_preferences) {
        parameters.table_preferences = data.table_preferences;
      }

      if (data.userId) {
        parameters.userId = data.userId;
      }

      if (data.module_id) {
        parameters.module_id = data.module_id;
      }

      const response = await this.userPreferences.update(id, parameters);
      if (response) {
        return { status: 200, message: { message: 'preferences atualizada' } };
      }
      return { status: 400, message: { message: '' } };
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
      throw new Error('[Controller] - create User Preferences erro');
    }
  }
}
