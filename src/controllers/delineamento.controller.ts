import { DelineamentoRepository } from '../repository/delineamento.repository';

export class DelineamentoController {
	Repository = new DelineamentoRepository();

	async getAll(options: object | any) {
		const parameters: object | any = {};
		let take;
		let skip;
		let orderBy: object | any;
		let select: any = [];
		try {
			if (options.filterStatus) {
				if (typeof (options.status) === 'string') {
					options.filterStatus = parseInt(options.filterStatus);
					if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
				} else if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
			}

			if (options.filterName) {
				options.filterName = `{"contains": "${options.filterName}"}`;
				parameters.name = JSON.parse(options.filterName);
			}

			if (options.filterRepeat) {
				parameters.repeticao = parseInt(options.filterRepeat);
			}

			if (options.filterTreatment) {
				parameters.trat_repeticao = parseInt(options.filterTreatment);
			}

			if (options.paramSelect) {
				const objSelect = options.paramSelect.split(',');
				Object.keys(objSelect).forEach((item) => {
					if (objSelect[item] !== 'sequencia') {
						select[objSelect[item]] = true;
					}
				});
				select = { ...select };
			} else {
				select = {
					id: true, name: true, repeticao: true, trat_repeticao: true, status: true,
				};
			}

			if (options.id_culture) {
				parameters.id_culture = parseInt(options.id_culture);
			}

			if (options.name) {
				parameters.name = options.name;
			}

			if (options.repeticao) {
				parameters.repeticao = options.repeticao;
			}

			if (options.trat_repeticao) {
				parameters.trat_repeticao = options.trat_repeticao;
			}

			if (options.take) {
				if (typeof (options.take) === 'string') {
					take = parseInt(options.take);
				} else {
					take = options.take;
				}
			}

			if (options.skip) {
				if (typeof (options.skip) === 'string') {
					skip = parseInt(options.skip);
				} else {
					skip = options.skip;
				}
			}

			if (options.orderBy) {
				orderBy = '{"' + options.orderBy + '":"' + options.typeOrder + '"}';
			}

			const response = await this.Repository.findAll(parameters, select, take, skip, orderBy);
			if (!response || response.total <= 0) {
				return { status: 400, response: [], total: 0 };
			}
			return { status: 200, response, total: response.total };
		} catch (err) {
			console.log('Error: ', err);
			return { status: 400, message: err };
		}
	}

	async getOne(id: string) {
		const newID = parseInt(id);
		try {
			if (id && id !== '{id}') {
				const response = await this.Repository.findOne(newID);
				if (!response) {
					return { status: 400, response: { error: 'local não existe' } };
				}
				return { status: 200, response };
			}
			return { status: 405, response: { error: 'id não informado' } };
		} catch (err) {
			return { status: 400, message: err };
		}
	}

	async post(data: object | any) {
		try {
			if (data !== null && data !== undefined) {
				const response = await this.Repository.create(data);
				if (response) {
					return { status: 200, message: 'delineamento inserido', response };
				}
				return { status: 400, message: 'erro' };
			}
		} catch (err) {
			return { status: 400, message: err };
		}
	}

	async update(data: any) {
		const parameters: object | any = {};
		try {
			if (typeof (data.status) === 'string') {
				parameters.status = parseInt(data.status);
			} else {
				parameters.status = data.status;
			}

			if (data.name) parameters.name = data.name;
			if (data.repeticao) parameters.repeticao = data.repeticao;
			if (data.trat_repeticao) parameters.trat_repeticao = data.trat_repeticao;
			if (data.status) parameters.status = data.status;

			if (data !== null && data !== undefined) {
				const response = await this.Repository.update(data.id, parameters);
				if (response) {
					return { status: 200, message: 'Delineamento atualizado com sucesso' };
				}
				return { status: 400, message: 'erro ao tentar fazer o update' };
			}
		} catch (err) {
			return { status: 400, message: err };
		}
	}
}
