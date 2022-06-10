import { number, object, SchemaOf, string } from 'yup';
import { EnvelopeRepository } from '../repository/envelope.repository';


export class EnvelopeController {
    public readonly required = 'Campo obrigatório';

    envelopeRepository = new EnvelopeRepository();


    async listOne({ id }: any) {
        try {
            const response = await this.envelopeRepository.findById(id);

            if (!response) throw new Error('grupo não encontrado');

            return { status: 200, response };
        } catch (e) {
            return { status: 400, message: 'grupo não encontrado' };
        }
    }

    async create(data: any) {
        try {
            const schema: SchemaOf<any> = object({
                id_safra: number().required(this.required),
                id_type_assay: number().required(this.required),
                seeds: number().required(this.required),
                created_by: number().integer().required(this.required)
            });

            const valid = schema.isValidSync(data);


            if (!valid) return { status: 400, message: 'Dados inválidos' };

            const envelopeAlreadyExists = await this.envelopeRepository.findByData(data);

            if (envelopeAlreadyExists) return { status: 400, message: 'Dados já cadastrados' };

            await this.envelopeRepository.create(data);

            return { status: 201, message: 'envelope cadastrado' };
        } catch (err) {
            console.log("erros: ", err);
            return { status: 404, message: 'Erro de cadastro' };
        }
    }

    async update(data: any) {
        try {
            const schema: SchemaOf<any> = object({
                id: number().required(this.required),
                id_type_assay: number().required(this.required),
                id_safra: number().required(this.required),
                seeds: number().required(this.required),
                created_by: number().required(this.required)
            });

            const valid = schema.isValidSync(data);

            if (!valid) return { status: 400, message: 'Dados inválidos' };

            const envelope: any = await this.envelopeRepository.findById(data.id);

            if (!envelope) return { status: 400, message: 'envelope não existente' };

            await this.envelopeRepository.update(data.id, data);

            return { status: 200, message: 'envelope atualizado' };
        } catch (err) {
            console.log(err)
            return { status: 404, message: 'Erro ao atualizar' };
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
                select = { id: true, id_safra: true, id_type_assay: true, type_assay: { select: { name: true } }, safra: { select: { safraName: true } }, seeds: true, status: true };
            }

            if (options.id_safra) {
                parameters.id_safra = options.id_safra;
            }

            if (options.id_type_assay) {
                parameters.id_type_assay = Number(options.id_type_assay);
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

            const response: object | any = await this.envelopeRepository.findAll(
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
            console.log(err);
            return { status: 400, response: [], total: 0 };
        }
    }
}
