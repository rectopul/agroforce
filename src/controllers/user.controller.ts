import { UsersPermissionsRepository } from '../repository/user-permission.repository';
import { functionsUtils } from '../shared/utils/functionsUtils';
import handleError from '../shared/utils/handleError';
import { UserRepository } from '../repository/user.repository';
import { UserCultureController } from './user-culture.controller';
import { UserPermissionController } from './user-permission.controller';
import { ReporteRepository } from '../repository/reporte.repository';
import { removeEspecialAndSpace } from '../shared/utils/removeEspecialAndSpace';

export class UserController {
  userRepository = new UserRepository();

  usersPermissionRepository = new UsersPermissionsRepository();

  userCultureController = new UserCultureController();

  userPermissionsController = new UserPermissionController();

  reporteRepository = new ReporteRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;
    let select: any = [];
    try {
      options = await removeEspecialAndSpace(options);
      if (options.filterStatus) {
        if (options.filterStatus != 2) parameters.status = Number(options.filterStatus);
      }

      if (options.filterName) {
        parameters.name = JSON.parse(`{"contains":"${options.filterName}"}`);
      }

      if (options.filterLogin) {
        parameters.login = JSON.parse(`{"contains":"${options.filterLogin}"}`);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item: any) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = {
          id: true,
          login: true,
          name: true,
          tel: true,
          status: true,
          cpf: true,
          email: true,
          avatar: true,
        };
      }

      if (options.cpf) {
        parameters.cpf = options.cpf;
      }

      if (options.login) {
        parameters.login = options.login;
      }

      if (options.email) {
        parameters.email = options.email;
      }

      if (options.tel) {
        parameters.tel = options.tel;
      }

      if (options.id) {
        parameters.id = options.id;
      }

      if (options.departmentId) {
        parameters.departmentId = options.departmentId;
      }

      if (options.registration) {
        parameters.registration = options.registration;
      }

      if (options.take) {
        if (typeof (options.take) === 'string') {
          take = Number(options.take);
        } else {
          take = options.take;
        }
      }

      if (options.skip) {
        if (typeof (options.skip) === 'string') {
          skip = Number(options.skip);
        } else {
          skip = options.skip;
        }
      }

      if (options.orderBy) {
        orderBy = `{"${options.orderBy}":"${options.typeOrder}"}`;
      }

      const response: object | any = await this.userRepository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy,
      );
      if (!response || response.total <= 0) {
        return {
          status: 400, response: [], total: 0, message: 'nenhum resultado encontrado',
        };
      }
      return { status: 200, response, total: response.total };
    } catch (error: any) {
      handleError('User Controller', 'GetAll', error.message);
      throw new Error('[Controller] - GetAll User erro');
    }
  }

  async getOne(id: number) {
    try {
      const response = await this.userRepository.findOne(id);
      if (!response) {
        return { status: 400, response: [], message: 'user não existe' };
      }
      await this.userCultureController.getByUserID(id);
      return { status: 200, response, culture: response.cultures };
    } catch (error: any) {
      handleError('User Controller', 'GetOne', error.message);
      throw new Error('[Controller] - GetOne User erro');
    }
  }

  async create(data: object | any) {
    try {
    //  const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');

      const parameters: any = {};
      if (data !== null && data !== undefined) {
        data.password = functionsUtils.Crypto(data.password, 'cipher');
        if (typeof (data.status) === 'string') {
          parameters.status = Number(data.status);
        } else {
          parameters.status = data.status;
        }

        if (typeof (data.departmentId) === 'string') {
          parameters.departmentId = Number(data.departmentId);
        } else {
          parameters.departmentId = data.departmentId;
        }

        if (typeof (data.registration) === 'string') {
          parameters.registration = Number(data.registration);
        } else {
          parameters.registration = data.registration;
        }

        if (!data.name) return { status: 400, message: 'Informe o nome do usuário' };
        if (!data.login) return { status: 400, message: 'Informe o login do usuário' };
        if (!data.cpf) return { status: 400, message: 'Informe o cpf do usuário' };
        if (!data.departmentId) return { status: 400, message: 'Informe o departamento do usuário' };
        if (!data.password) return { status: 400, message: 'Informe a senha do usuário' };

        // Validação de login existente.
        const validateLogin: object | any = await this.getAll({ login: data.login });
        if (validateLogin.total > 0) return { status: 400, message: 'Login ja cadastrado, favor checar registros inativos.' };

        // Validação de cpf existente.
        const validateCPF: object | any = await this.getAll({ cpf: data.cpf });
        if (validateCPF.total > 0) return { status: 400, message: 'CPF já cadastrado' };

        // Validação cpf é valido
        if (!functionsUtils.validationCPF(data.cpf)) return { status: 400, message: 'CPF invalído' };

        parameters.name = data.name;
        parameters.login = data.login;
        parameters.cpf = data.cpf;
        parameters.email = data.email;
        parameters.tel = data.tel;
        parameters.password = data.password;
        parameters.created_by = data.created_by;

        const response = await this.userRepository.create(parameters);

        if (response) {
          if (data.cultures) {
            Object.keys(data.cultures).forEach((item: any) => {
              data.cultures[item].profiles.forEach((profile: any) => {
                this.userPermissionsController.post({
                  userId: response.id,
                  profileId: Number(profile),
                  cultureId: Number(data.cultures[item].cultureId),
                  created_by: Number(data.created_by),
                });
              });
            });
          }
          if (data.cultureId) {
            this.userCultureController.save(
              { cultureId: data.cultureId, userId: response.id, created_by: data.created_by },
            );
          }
          // await this.reporteRepository.create({
          //   madeBy: data.created_by, module: 'Usuários', operation: 'Cadastro', name: data.name, idOperation: response.id, ip: JSON.stringify(ip),
          // });
          return { status: 200, message: 'users inseridos' };
        }
        return { status: 400, message: 'houve um erro, tente novamente' };
      }
    } catch (error: any) {
      handleError('User Controller', 'Create', error.message);
      throw new Error('[Controller] - Create User erro');
    }
  }

  async signInUSer(data: object | any) {
    try {
      data.password = functionsUtils.Crypto(data.password, 'cipher');
      return await this.userRepository.signIn(data);
    } catch (error: any) {
      handleError('User Controller', 'SingIn', error.message);
      throw new Error('[Controller] - SingIn User erro');
    }
  }

  async updateAvatar(id: number, avatar: string) {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        return { status: 400, message: 'Usuário não encontrado!' };
      }

      user.avatar = avatar;

      await this.userRepository.updateAvatar(id, user.avatar);

      return { status: 200, message: 'Avatar atualizado com sucesso!' };
    } catch (error: any) {
      handleError('User Controller', 'Update Avatar', error.message);
      throw new Error('[Controller] - Update Avatar User erro');
    }
  }

  async updatePassword(
    id: number,
    currentPassword: string,
    password: string,
    confirmPassword: string,
  ) {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        return { status: 400, message: 'Usuário não encontrado!' };
      }

      const comparePassword = functionsUtils.Crypto(user.password, 'decipher');

      if (currentPassword !== String(comparePassword) || password !== confirmPassword) {
        return { status: 400, message: 'Dados inválidos!' };
      }

      password = functionsUtils.Crypto(password, 'cipher');
      user.password = password;

      await this.userRepository.updatePassword(id, user.password);

      return { status: 200, message: 'Senha atualizada com sucesso!' };
    } catch (error: any) {
      handleError('User Controller', 'Update Password', error.message);
      throw new Error('[Controller] - Update Password User erro');
    }
  }

  async update(data: object | any) {
    try {
      const { ip } = await fetch('https://api.ipify.org/?format=json').then((results) => results.json()).catch(() => '0.0.0.0');
      if (data !== null && data !== undefined) {
        const parameters: object | any = {};

        if (typeof (data.status) === 'string') {
          parameters.status = Number(data.status);
        } else {
          parameters.status = data.status;
        }

        if (typeof (data.departmentId) === 'string') {
          parameters.departmentId = Number(data.departmentId);
        } else {
          parameters.departmentId = data.departmentId;
        }

        if (typeof (data.registration) === 'string') {
          parameters.registration = Number(data.registration);
        } else {
          parameters.registration = data.registration;
        }

        if (data.name) {
          parameters.name = data.name;
        }

        if (data.login) {
          parameters.login = data.login;
        }

        if (data.cpf) {
          if (!functionsUtils.validationCPF(data.cpf)) return { message: 'CPF invalido' };
          parameters.cpf = data.cpf;
        }

        if (data.email) {
          parameters.email = data.email;
        }

        if (data.tel) {
          parameters.tel = data.tel;
        }

        if (data.password) {
          parameters.password = functionsUtils.Crypto(data.password, 'cipher');
        }

        if (data.created_by) {
          parameters.created_by = data.created_by;
        }

        const response: object | any = await this.userRepository.update(data.id, parameters);

        if (response.count > 0) {
          if (data.cultures) {
            Object.keys(data.cultures).forEach((item: any) => {
              data.cultures[item].profiles.forEach((profile: any) => {
                this.userPermissionsController.post({
                  userId: data.id,
                  profileId: Number(profile),
                  cultureId: Number(data.cultures[item].cultureId),
                  created_by: Number(data.created_by),
                });
              });
            });
          }

          if (data.status === 1) {
            await this.reporteRepository.create({
              madeBy: data.created_by, module: 'Usuários', operation: 'Edição', idOperation: data.id, name: data.name, ip: JSON.stringify(ip),
            });
          }
          if (data.status === 0) {
            await this.reporteRepository.create({
              madeBy: data.created_by, module: 'Usuários', operation: 'Inativação', idOperation: data.id, name: data.name, ip: JSON.stringify(ip),
            });
          }
          return { status: 200, message: { message: 'Usuário atualizada' } };
        }
        return { status: 400, message: { message: 'Usuário não existe' } };
      }
      return { status: 404, message: { message: 'Usuário atualizada' } };
    } catch (error: any) {
      handleError('User Controller', 'Update', error.message);
      throw new Error('[Controller] - Update User erro');
    }
  }
}
