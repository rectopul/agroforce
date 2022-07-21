import { UserPreferenceRepository } from 'src/repository/user-preference.repository';

export class UserPreferenceController {
  userPreferences = new UserPreferenceRepository();

  async getAllPreferences(options: any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;
    let select: any = [];

    try {
      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = { id: true, userId: true, table_preferences: true };
      }

      if (options.userId) {
        parameters.userId = Number(options.userId);
      }

      if (options.module_id) {
        parameters.module_id = Number(options.module_id);
      }

      const response: object | any = await this.userPreferences.findAll(parameters, select, take, skip, orderBy);

      if (!response || response.total <= 0) {
        return {
          status: 400, response: [], total: 0, itens_per_page: response.itens_per_page,
        };
      }
      return {
        status: 200, response, total: response.total, itens_per_page: response.itens_per_page,
      };
    } catch (err) {

    }
  }

  async getConfigGerais(options: any) {
    try {
      const parameters: object | any = {};
      let take;
      let skip;
      let orderBy: object | any;
      const select: any = { id: true, itens_per_page: true };

      const response: object | any = await this.userPreferences.findAllconfigGerais(parameters, select, take, skip, orderBy);

      if (!response) {
        return { status: 400, response: [] };
      }
      return { status: 200, response };
    } catch (err) {
      return { status: 400, response: [] };
    }
  }

  async updateUserPreferences(data: object | any) {
    const { id } = data;
    const parameters: object | any = {};
    try {
      if (data !== null && data !== undefined) {
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
      }
    } catch (err) {

    }
  }

  async create(data: object | any) {
    const parameters: object | any = {};
    try {
      if (data !== null && data !== undefined) {
        if (typeof (data.userId) === 'string') {
          parameters.userId = Number(data.userId);
        } else {
          parameters.userId = data.userId;
        }

        parameters.table_preferences = data.table_preferences;

        const response = await this.userPreferences.create(parameters);
        if (response) {
          return { status: 200, response };
        }
        return { status: 400, message: 'houve um erro, tente novamente' };
      }
    } catch (err) {

    }
  }
}
