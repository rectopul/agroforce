import { ProfileRepository } from '../repository/profile.repository';
import {removeEspecialAndSpace} from "../shared/utils/removeEspecialAndSpace";

export class ProfileController {
  profileRepository = new ProfileRepository();

  async getAllProfiles(options: any) {

    options = await removeEspecialAndSpace(options);
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;
    let select: any = [];
    
    try {

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
      
      const response = await this.profileRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy
      );
      return response;
    } catch (err) {

    }
  }

  async getOneProfile(id: string) {
    const newID = Number(id);
    try {
      if (id && id !== '{id}') {
        const response = await this.profileRepository.findOne(newID);
        if (!response) {
          return { status: 400, response: { error: 'cultura não existe' } };
        }
        return { status: 200, response };
      }
      return { status: 405, response: { error: 'id não informado' } };
    } catch (err) {

    }
  }

  async postProfile(data: object) {
    try {
      if (data !== null && data !== undefined) {
        const response = await this.profileRepository.create(data);
        if (response) {
          return { status: 200, message: 'cultura inserida' };
        }
        return { status: 400, message: 'erro' };
      }
    } catch (err) {

    }
  }

  async updateProfile(id: string, data: object) {
    const newID = Number(id);
    try {
      if (data !== null && data !== undefined) {
        const response = await this.profileRepository.update(newID, data);
        if (response) {
          return { status: 200, message: { message: 'cultura atualizada' } };
        }
        return { status: 400, message: { message: 'erro ao tentar fazer o update' } };
      }
    } catch (err) {

    }
  }
}
