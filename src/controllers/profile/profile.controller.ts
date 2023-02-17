import handleOrderForeign from '../../shared/utils/handleOrderForeign';
import { ProfileRepository } from '../../repository/profile.repository';
import handleError from '../../shared/utils/handleError';

export class ProfileController {
  profileRepository = new ProfileRepository();

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

  async update(data: any) {
    try {
      const { status } = await this.getOne(Number(data.id));
      if (status !== 200) {
        return { status: 400, message: 'Permissão não encontrada' };
      }
      await this.profileRepository.update(Number(data.id), data);

      return { status: 200, message: 'Permissão atualizada' };
    } catch (error: any) {
      handleError('Perfil  controller', 'Update', error.message);
      throw new Error('[Controller] - Update Perfil  erro');
    }
  }
}
