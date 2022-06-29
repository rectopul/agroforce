import handleError from 'src/shared/utils/handleError';
import { number, object, SchemaOf, string } from 'yup';
import { FocoRepository } from '../repository/foco.repository';

interface LoteDTO {
	id: number;
	name: string;
	created_by: number;
	status: number;
	id_culture?: number;
}

type UpdateLoteDTO = Omit<LoteDTO, 'created_by'>;
export class FocoController {
	public readonly required = 'Campo obrigatório';

	focoRepository = new FocoRepository();

	async getAll(options: any) {
		const parameters: object | any = {};
		let select: any = [];
		try {
			if (options.filterStatus) {
				if (options.filterStatus != 2) parameters.status = Number(options.filterStatus);
			}

			if (options.filterSearch) {
				parameters.name = JSON.parse(`{ "contains": "${options.filterSearch}" }`);
			}

			if (options.id_culture) {
				parameters.id_culture = Number(options.id_culture);
			}

			if (options.paramSelect) {
				let objSelect = options.paramSelect.split(',');
				Object.keys(objSelect).forEach((item) => {
					select[objSelect[item]] = true;
				});
				select = Object.assign({}, select);
			} else {
				select = {
					id: true,
					name: true,
					group: true,
					status: true,
				};
			}

			if (options.name) {
				parameters.name = options.name;
			}

			const take = (options.take) ? Number(options.take) : undefined;

			const skip = (options.skip) ? Number(options.skip) : undefined;

			const orderBy = (options.orderBy) ? `{"${options.orderBy}":"${options.typeOrder}"}` : undefined;

			const response: object | any = await this.focoRepository.findAll(
				parameters,
				select,
				take,
				skip,
				orderBy
			);

			response.map((item: any) => {
				item.group.map((group: any) => {

					if (group.id_safra === Number(options.id_safra)) {
						item.group = (group.group.toString()).length > 1 ? group.group : '0' + group.group.toString()
					}
				})
			})

			if (!response || response.total <= 0) {
				return { status: 404, response: [], total: 0 }
			} else {
				return { status: 200, response, total: response.total }
			}
		} catch (error: any) {
			handleError('Foco Controller', 'GetAll', error.message)
			throw new Error("[Controller] - GetAll foco erro")
		}
	};

	async getOne(id: number) {
		try {
			if (!id) return { status: 400, response: [], message: { message: "Id não informado" } }

			const response = await this.focoRepository.findOne(id);

			if (response) {
				return { status: 200, response: response, message: { message: "Foco encontrado" } }
			} else {
				return { status: 404, response: [], message: { message: "Foco não existe" } }
			}

		} catch (error: any) {
			handleError('Foco Controller', 'getOne', error.message)
			throw new Error("[Controller] - getOne foco erro")
		}
	};

	async create(data: any) {
		try {
			const schema: SchemaOf<any> = object({
				name: string().required(this.required),
				created_by: number().integer().required(this.required),
			});

			const valid = schema.isValidSync(data);
			if (!valid) return { status: 400, message: "Dados inválidos" };

			const focoAlreadyExists = await this.focoRepository.findByName({ name: data.name, id_culture: data.id_culture });

			if (focoAlreadyExists) return { status: 409, message: "Foco já existente" };

			const response = await this.focoRepository.create(data);
			if (response) {
				return { status: 200, response: response, message: { message: "Foco criado" } }
			} else {
				return { status: 400, response: [], message: { message: "Foco não foi criado" } }
			}

		} catch (error: any) {
			handleError('Foco Controller', 'Create', error.message)
			throw new Error("[Controller] - Create foco erro")
		}
	};

	async update(data: UpdateLoteDTO) {
		try {
			const schema: SchemaOf<UpdateLoteDTO> = object({
				id: number().integer().required(this.required),
				name: string().required(this.required),
				status: number().integer().required(this.required),
				id_culture: number().integer().optional()
			});

			const valid = schema.isValidSync(data);
			if (!valid) return { status: 400, message: "Dados inválidos" };

			const focoExist: any = await this.focoRepository.findOne(data.id);
			if (!focoExist) return { status: 404, message: "Foco não encontrado" };

			const focoAlreadyExists = await this.focoRepository.findByName({ name: data.name, id_culture: data.id_culture });
			if (focoAlreadyExists) return { status: 409, message: "Foco já existente" };


			const response = await this.focoRepository.update(data.id, data);
			if (response) {
				return { status: 200, response: response, message: { message: "Foco atualizado" } }
			} else {
				return { status: 400, response: [], message: { message: "Foco não foi atualizada" } }
			}
		} catch (error: any) {
			handleError('Foco Controller', 'Update', error.message)
			throw new Error("[Controller] - Update foco erro")
		}
	};
};
