import { ExperimentRepository } from 'src/repository/experiment.repository';
import handleOrderForeign from 'src/shared/utils/handleOrderForeign';

// type Updategenotipo = Omit<genotipo, 'created_by'>;
export class ExperimentController {
	public readonly required = 'Campo obrigatório';

	experimentRepository = new ExperimentRepository();

	async getAll(options: any) {
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
				} else {
					if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
				}
			} else {
				parameters.status = 1;
			}

			if (options.filterGenotipo) {
				options.filterGenotipo = '{"contains":"' + options.filterGenotipo + '"}';
				parameters.name_genotipo = JSON.parse(options.filterGenotipo);
			}

			if (options.paramSelect) {
				const objSelect = options.paramSelect.split(',');
				Object.keys(objSelect).forEach((item) => {
					if (objSelect[item] === 'tecnologia') {
						select[objSelect[item]] = true;
					} else {
						select[objSelect[item]] = true;
					}
				});
				select = Object.assign({}, select);
			} else {
				select = {
					id: true,
					protocolo_name: true,
					id_experimento: true,
					experimento_name: true,
					safra: { select: { safraName: true } },
					culture: { select: { name: true } },
					foco: { select: { name: true } },
					tecnologia: { select: { cod_tec: true } },
					ensaio: { select: { name: true } },
					epoca: true,
					pjr: true,
					id_un_cultura: true,
					unidade_cultura_name: true,
					name_uni_cultura: true,
					rotulo: true,
					year: true,
					status: true,
				};
			}

			if (options.protocolo_name) {
				parameters.protocolo_name = parseInt(options.protocolo_name);
			}
			if (options.id_experimento) {
				parameters.id_experimento = parseInt(options.id_experimento);
			}
			if (options.experimento_name) {
				parameters.experimento_name = parseInt(options.experimento_name);
			}
			if (options.epoca) {
				parameters.epoca = parseInt(options.epoca);
			}
			if (options.pjr) {
				parameters.pjr = parseInt(options.pjr);
			}
			if (options.id_un_cultura) {
				parameters.id_un_cultura = parseInt(options.id_un_cultura);
			}
			if (options.unidade_cultura_name) {
				parameters.unidade_cultura_name = parseInt(options.unidade_cultura_name);
			}
			if (options.name_uni_cultura) {
				parameters.name_uni_cultura = parseInt(options.name_uni_cultura);
			}
			if (options.rotulo) {
				parameters.rotulo = parseInt(options.rotulo);
			}
			if (options.year) {
				parameters.year = parseInt(options.year);
			}
			if (options.id_culture) {
				parameters.id_culture = parseInt(options.id_culture);
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
				orderBy = handleOrderForeign(options.orderBy, options.typeOrder)
				orderBy = orderBy ? orderBy : '{"' + options.orderBy + '":"' + options.typeOrder + '"}'
			}

			const response: object | any = await this.experimentRepository.findAll(
				parameters,
				select,
				take,
				skip,
				orderBy
			);

			console.log('response');
			console.log(response);

			if (!response && response.total <= 0) {
				return { status: 400, response: [], total: 0, message: 'nenhum resultado encontrado' };
			} else {
				return { status: 200, response, total: response.total };
			}
		} catch (err) {
			console.log(err);
			return { status: 400, response: [], total: 0 };
		}
	}

	async getOne(id: number) {
		try {
			if (!id) throw new Error('Dados inválidos');

			const response = await this.experimentRepository.findOne(id);

			if (!response) throw new Error('Item não encontrado');

			return { status: 200, response };
		} catch (err) {
			return { status: 400, message: err };
		}
	}

	async create(data: any) {
		try {
			const response = await this.experimentRepository.create(data);
			return { status: 201, message: 'Experimento cadastrado', response };
		} catch (err) {
			console.log(err);
			return { status: 400, message: 'Erro no cadastrado' };
		}
	}

	async update(data: any) {
		try {

			const experimento: any = await this.experimentRepository.findOne(data.id);

			if (!experimento) return { status: 400, message: 'Experimento não encontrado' };

			await this.experimentRepository.update(experimento.id, data);

			return { status: 200, message: 'Experimento atualizado' };
		} catch (err) {
			console.log(err);
			return { status: 404, message: 'Erro ao atualizar' };
		}
	}
}
