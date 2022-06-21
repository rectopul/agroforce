import { number, object, SchemaOf, string } from 'yup';
import { UnidadeCulturaRepository } from '../repository/unidade-cultura.repository';


export class UnidadeCulturaController {
    public readonly required = 'Campo obrigatório';

    unidadeCulturaRepository = new UnidadeCulturaRepository();

    async getOne({ id }: any) {
        try {
            const response = await this.unidadeCulturaRepository.findById(id);

            if (!response) throw new Error('unidade de cultura não encontrada');

            return { status: 200, response };
        } catch (err) {
            console.log("[Controller] - GetOne Unidade Cultura erro");
            console.log(err);
            throw new Error("[Controller] - GetOne Unidade Cultura erro")
        }
    }

    async create(data: any) {
        try {
            const schema: SchemaOf<any> = object({
                id_local: number().required(this.required),
                id_culture_unity: number().required(this.required),
                year: number().required(this.required),
                culture_unity_name: string().required(this.required),
                created_by: number().integer().required(this.required)
            });

            const valid = schema.isValidSync(data);

            if (!valid) throw new Error("[Controller] - Dados inválidos")

            const unidadeCulturaAlreadyExist = await this.unidadeCulturaRepository.findByData(data);

            if (unidadeCulturaAlreadyExist) return { status: 400, message: 'Dados já cadastrados' };

            await this.unidadeCulturaRepository.create(data);

            return { status: 201, message: 'unidade de cultura cadastrada' };
        } catch (err: any) {
            console.log("[Controller] - Create Unidade Cultura erro");
            console.log(err.message);
            throw new Error(err.message)
        }
    }

    async update(data: any) {
        try {
            const schema: SchemaOf<any> = object({
                id: number().required(this.required),
                id_local: number().required(this.required),
                id_culture_unity: number().required(this.required),
                year: number().required(this.required),
                culture_unity_name: string().required(this.required),
                created_by: number().integer().required(this.required)
            });

            const valid = schema.isValidSync(data);

            if (!valid) return { status: 400, message: 'Dados inválidos' };

            const unidadeCultura: any = await this.unidadeCulturaRepository.findById(data.id);

            if (!unidadeCultura) return { status: 400, message: 'unidade de cultura não existente' };

            await this.unidadeCulturaRepository.update(data.id, data);

            return { status: 200, message: 'unidade de cultura atualizado' };
        } catch (err) {
            console.log("[Controller] - Update Unidade Cultura erro");
            console.log(err);
            throw new Error("[Controller] - Update Unidade Cultura erro")
        }
    }

    async listAll(options: any) {
        const parameters: object | any = {};
        let take;
        let skip;
        let orderBy: object | any = '';
        let select: any = [];
        let include: any;

        try {
            if (options.filterStatus) {
                if (typeof (options.status) === 'string') {
                    options.filterStatus = parseInt(options.filterStatus);
                    if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
                } else {
                    if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
                }
            }

            if (options.paramSelect) {
                const objSelect = options.paramSelect.split(',');
                Object.keys(objSelect).forEach((item) => {
                    if (objSelect[item] !== 'acao') {
                        select[objSelect[item]] = true;
                    }
                });
                select = Object.assign({}, select);
            } else {
                select = {
                    id: true,
                    id_culture_unity: true,
                    id_local: true,
                    year: true,
                    culture_unity_name: true,
                    status: true
                };
            }

            if (options.id_culture_unity) {
                parameters.id_culture_unity = options.id_culture_unity;
            }

            if (options.culture_unity_name) {
                parameters.culture_unity_name = options.culture_unity_name;
            }

            if (options.id_local) {
                parameters.id_local = Number(options.id_local);
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
                orderBy = `{"${options.orderBy}":"${options.typeOrder}"}`;
            }

            const response: object | any = await this.unidadeCulturaRepository.findAll(
                parameters,
                select,
                take,
                skip,
                orderBy
            );

            if (!response || response.total <= 0) {
                return { status: 400, response: [], total: 0 };
            } else {
                return { status: 200, response, total: response.total };
            }
        } catch (err) {
            console.log("[Controller] - GetAll Unidade Cultura erro");
            console.log(err);
            throw new Error("[Controller] - GetAll Unidade Cultura erro")
        }
    }
}
