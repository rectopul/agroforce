import handleError from 'src/shared/utils/handleError';
import { LocalRepository } from '../repository/local.repository';
export class LocalController {
	localRepository = new LocalRepository();

	async getAll(options: object | any) {
		const parameters: object | any = {};
		let select: any = [];
		try {
			if (options.filterStatus) {
				if (options.filterStatus != 2) parameters.status = Number(options.filterStatus);
			}

			if (options.filterName_local_culture) {
				parameters.name_local_culture = JSON.parse(`{ "contains":"${options.filterName_local_culture}" }`);
			}

			if (options.filterLabel) {
				parameters.label = JSON.parse(`{ "contains":"${options.filterLabel}" }`);
			}

			if (options.filterAdress) {
				parameters.adress = JSON.parse(`{ "contains":"${options.filterAdress}" }`);
			}

			if (options.filterLabel_country) {
				parameters.label_country = JSON.parse(`{ "contains":"${options.filterLabel_country}" }`);
			}

			if (options.filterLabel_region) {
				parameters.label_region = JSON.parse(`{ "contains":"${options.filterLabel_region}" }`);
			}

			if (options.filterName_locality) {
				parameters.name_locality = JSON.parse(`{ "contains":"${options.filterName_locality}" }`);
			}


			if (options.id_local_culture) {
				parameters.id_local_culture = Number(options.id_local_culture);
			}

			if (options.name_local_culture) {
				parameters.name_local_culture = options.name_local_culture;
			}

			const take = (options.take) ? Number(options.take) : undefined;

			const skip = (options.skip) ? Number(options.skip) : undefined;

			const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

			if (options.paramSelect) {
				let objSelect = options.paramSelect.split(',');
				Object.keys(objSelect).forEach((item) => {
					select[objSelect[item]] = true;
				});
				select = Object.assign({}, select);
			} else {
				select = { id: true, name_local_culture: true, label: true, mloc: true, label_country: true, label_region: true, name_locality: true, adress: true, status: true };
			}

			const response = await this.localRepository.findAll(parameters, select, take, skip, orderBy);
			if (!response || response.total <= 0) {
				return { status: 400, response: [], total: 0 };
			} else {
				return { status: 200, response: response, total: response.total };
			}
		} catch (error: any) {
			handleError('Local Controller', 'GetAll', error.message)
			throw new Error("[Controller] - GetAll Unidade Cultura erro")
		}
	}

	async getOne({ id }: any) {
		try {
			if (id) {
				const response = await this.localRepository.findOne(Number(id));
				if (response) {
					return { status: 200, response: response };
				} else {
					return { status: 404, response: [], message: 'Local não existe' };
				}
			} else {
				return { status: 405, response: [], message: 'ID não recebido' };
			}
		} catch (error: any) {
			handleError('Local Controller', 'GetOne', error.message)
			throw new Error("[Controller] - GetOne Unidade Cultura erro")
		}
	}

	async create(data: object | any) {
		try {

			const response = await this.localRepository.create(data);
			if (response) {
				return { status: 201, response: response, message: "Local criado" }
			} else {
				return { status: 400, message: "Erro ao criar local" }
			}

		} catch (error: any) {
			handleError('Local Controller', 'Create', error.message)
			throw new Error("[Controller] - Create Unidade Cultura erro")
		}
	}

	async update(data: any) {
		try {

			const localCultura: any = await this.localRepository.findOne(data.id);

			if (!localCultura) return { status: 404, message: 'Local de cultura não existente' };

			const response = await this.localRepository.update(data.id, data);

			if (response) {
				return { status: 200, message: 'Local de cultura atualizado' };
			} else {
				return { status: 400, message: 'Não foi possível atualizar' };
			}

		} catch (error: any) {
			handleError('Local Controller', 'Update', error.message)
			throw new Error("[Controller] - Update Unidade Cultura erro")
		}
	}
}
