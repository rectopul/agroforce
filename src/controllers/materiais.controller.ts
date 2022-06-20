import { MateriaisRepository } from 'src/repository/materiais.repository';

// type Updategenotipo = Omit<genotipo, 'created_by'>;
export class MateriaisController {
    public readonly required = 'Campo obrigatório';

    materiaisRepository = new MateriaisRepository();

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
                    id_d1: true,
                    id_dados: true,
                    id_experimento: true,
                    id_l1: true,
                    name_genotipo: true,
                    name_main: true,
                    prox_nivel: true,
                    tratamentos: true,
                    status: true
                };
            }

            if (options.id_d1) {
                parameters.id_d1 = parseInt(options.id_d1);
            }

            if (options.id_dados) {
                parameters.id_dados = parseInt(options.id_dados);
            }

            if (options.id_experimento) {
                parameters.id_experimento = parseInt(options.id_experimento);
            }

            if (options.id_l1) {
                parameters.id_l1 = parseInt(options.id_l1);
            }

            if (options.name_genotipo) {
                parameters.name_genotipo = parseInt(options.name_genotipo);
            }

            if (options.name_main) {
                parameters.name_main = parseInt(options.name_main);
            }

            if (options.prox_nivel) {
                parameters.prox_nivel = parseInt(options.prox_nivel);
            }

            if (options.tratamentos) {
                parameters.tratamentos = parseInt(options.tratamentos);
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

            const response: object | any = await this.materiaisRepository.findAll(
                parameters,
                select,
                take,
                skip,
                orderBy
            );

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

            const response = await this.materiaisRepository.findOne(id);

            if (!response) throw new Error('Item não encontrado');

            return { status: 200, response };
        } catch (err) {
            return { status: 400, message: err };
        }
    }

    async create(data: any) {
        try {
            const response = await this.materiaisRepository.create(data);
            return { status: 201, message: 'Material cadastrada', response };
        } catch (err) {
            console.log(err);
            return { status: 400, message: 'Erro no cadastrado' };
        }
    }

    async update(data: any) {
        try {

            const materiais: any = await this.materiaisRepository.findOne(data.id);

            if (!materiais) return { status: 400, message: 'Material não encontrado' };

            await this.materiaisRepository.update(materiais.id, data);

            return { status: 200, message: 'Material atualizado' };
        } catch (err) {
            console.log(err);
            return { status: 404, message: 'Erro ao atualizar' };
        }
    }
}
