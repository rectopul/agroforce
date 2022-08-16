import { UserCultureRepository } from '../repository/user-culture.repository';

export class UserCultureController {
  userCultureRepository = new UserCultureRepository();

  async getAll(options: any) {
    const parameters: object | any = {};
    let take;
    let skip;
    let orderBy: object | any;
    let select: any = [];

    try {
      if (options.filterStatus) {
        if (options.filterStatus !== '2') parameters.status = Number(options.filterStatus);
      }

      if (options.filterSearch) {
        options.filterSearch = `{"contains":"${options.filterSearch}"}`;
        parameters.name = JSON.parse(options.filterSearch);
        parameters.login = JSON.parse(options.filterSearch);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          select[objSelect[item]] = true;
        });
        select = { ...select };
      } else {
        select = { id: true, userId: true, cultureId: true };
      }

      if (options.userId) {
        parameters.userId = Number(options.userId);
      }

      if (options.cultureId) {
        parameters.cultureId = Number(options.cultureId);
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

      const response: object | any = await this.userCultureRepository.findAll(parameters, select, take, skip, orderBy);

      if (!response || response.total <= 0) {
        return { status: 400, response: [], total: response.total };
      }
      return { status: 200, response, total: response.total };
    } catch (err) {

    }
  }

  async getOne(id: string) {
    const newID = Number(id);
    try {
      if (id && id !== '{id}') {
        const response = await this.userCultureRepository.findOne(newID);
        if (!response) {
          return { status: 400, response: [], message: 'relação não existe' };
        }
        return { status: 200, response };
      }
      return { status: 405, response: { error: 'id não informado' } };
    } catch (err) {

    }
  }

  async getByUserID(userId: number | any) {
    const newID = Number(userId);
    try {
      if (userId && userId !== '{id}') {
        const response = await this.userCultureRepository.findAllByUser(newID);
        if (!response || response.length === 0) {
          return { status: 400, response: [], message: 'usuario não tem cultura' };
        }
        return { status: 200, response };
      }
      return { status: 405, response: { error: 'id não informado' } };
    } catch (err) {
      return { status: 400, message: err };
    }
  }

  async save(data: object | any) {
    try {
      if (data !== null && data !== undefined) {
        const create: object | any = {};
        await this.delete(Number(data.userId));
        Object.keys(data.cultureId).forEach((item) => {
          create.cultureId = Number(data.cultureId[item]);
          create.userId = Number(data.userId);
          create.created_by = data.created_by;
          this.userCultureRepository.create(create);
        });
      }
    } catch (err) {
      return { status: 400, message: err };
    }
  }

  async update(data: object | any) {
    try {
      if (data !== null && data !== undefined) {
        const parameters: object | any = {};

        if (typeof (data.status) === 'string') {
          parameters.status = Number(data.status);
        } else {
          parameters.status = data.status;
        }
        await this.userCultureRepository.queryRaw(Number(data.idUser), Number(data.cultureId));
        return { status: 200 };
      }
    } catch (err) {
      return { status: 400, message: err };
    }
  }

  async updateAllStatus(userId: any) {
    try {
      await this.userCultureRepository.updateAllStatus(userId);
    } catch (err) {
      return { status: 400, message: err };
    }
  }

  async delete(userId: number) {
    try {
      if (userId) {
        const response: object | any = await this.userCultureRepository.delete({ userId });
        return { status: 200, response };
      }
      return { status: 400, message: 'id não informado' };
    } catch (err) {
      return { status: 400, message: err };
    }
  }
}
