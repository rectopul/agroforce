import { number, object, SchemaOf, string } from 'yup';
import { SafraRepository } from '../repository/safra.repository';

interface Safra {
    id: number;
    id_culture: number;
    year: string;
    typeCrop: string;
    plantingStartTime: string;
    plantingEndTime: string;
    main_safra?: number;
    status: number;
    created_by: number;
};

type CreateSafra = Omit<Safra, 'id' | 'main_safra'>;
type UpdateSafra = Omit<Safra, 'id_culture' | 'created_by' | 'main_safra'>;
export class SafraController {
    public readonly required = 'Campo obrigatório';

    safraRepository = new SafraRepository();

    async getAllSafra(options: any) {
        const parameters: object | any = new Object();
        let take; 
        let skip;
        let orderBy: object | any;
        let select: any = [];
        try {
            if (options.filterStatus) {
                if (typeof(options.status) === 'string') {
                    options.filterStatus = parseInt(options.filterStatus);
                    if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
                } else {
                    if (options.filterStatus != 2) parameters.status =parseInt(options.filterStatus);
                }
            }

            if (options.filterSearch) {
                options.filterSearch = '{"contains":"' + options.filterSearch + '"}';
                parameters.year = JSON.parse(options.filterSearch);
                // parameters.plantingStartTime =JSON.parse(options.filterSearch);
                // parameters.plantingEndTime =JSON.parse(options.filterSearch);
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
                    year: true, 
                    typeCrop:true, 
                    plantingStartTime:true, 
                    plantingEndTime:true, 
                    main_safra:false, 
                    status: true
                };
            }

            if (options.id_culture) {
                parameters.id_culture = parseInt(options.id_culture);
            }

            if (options.year) {
                parameters.year = options.year;
            }

            if (options.typeCrop) {
                parameters.typeCrop = options.typeCrop;
            }
            
            if (options.plantingStartTime) {
                parameters.plantingStartTime = options.plantingStartTime;
            }

            if (options.plantingEndTime) {
                parameters.plantingEndTime = options.plantingEndTime;
            }

            if (options.main_safra) {
                parameters.main_safra = options.main_safra;
            }

            if (options.take) {
                if (typeof(options.take) === 'string') {
                    take = parseInt(options.take);
                } else {
                    take = options.take;
                }
            }

            if (options.skip) {
                if (typeof(options.skip) === 'string') {
                    skip = parseInt(options.skip);
                } else {
                    skip = options.skip;
                }
            }

            if (options.orderBy) {
                orderBy = '{"' + options.orderBy + '":"' + options.typeOrder + '"}';
            }
            
            let response: object | any = await this.safraRepository.findAll(parameters, select, take , skip, orderBy);

            if (!response || response.total <=0) { 
                return {status: 400, response: [], total: 0}

            } else {
                return {status: 200, response, total: response.total}
            }      
        } catch (err) {
            
        } 
    }

    async getOneSafra(id: number) {
        try {
            if (!id) throw new Error("ID inválido");

            const response = await this.safraRepository.findOne(id);
    
            if (!response) throw new Error("Dados inválidos");

            return {status:200 , response};
        } catch (e) {
            return {status: 400, message: 'Item não encontrada'};
        }
    }

    async postSafra(data: CreateSafra) {
        try {
            const schema: SchemaOf<CreateSafra> = object({
                id_culture: number().integer().required(this.required),
                year: string().required(this.required),
                typeCrop: string().required(this.required),
                plantingStartTime: string().required(this.required),
                plantingEndTime: string().required(this.required),
                status: number().integer().required(this.required),
                created_by: number().integer().required(this.required),
            });
        
            const valid = schema.isValidSync(data);

            if (!valid) return {status: 400, message: "Dados inválidos"};

            const safraAlreadyExists = await this.safraRepository.findByYear(data.year);
        
            if (safraAlreadyExists) return { status: 400, message: "Ano da safra já existente" };

            await this.safraRepository.create(data);

            return {status: 201, message: "Safra cadastrada"}
        } catch(err) {
            return { status: 404, message: "Erro ao cadastrar safra"}
        }
    }

    async updateSafra(data: UpdateSafra) {
        try {
            const schema: SchemaOf<UpdateSafra> = object({
                id: number().integer().required(this.required),
                year: string().required(this.required),
                typeCrop: string().required(this.required),
                plantingStartTime: string().required(this.required),
                plantingEndTime: string().required(this.required),
                status: number().integer().required(this.required),
            });
        
            const valid = schema.isValidSync(data);

            if (!valid) return {status: 400, message: "Dados inválidos"};

            const safra = await this.safraRepository.findOne(data.id);

            if (!safra) return { status: 400, message: 'Safra não existente' };

            const safraAlreadyExists = await this.safraRepository.findByYear(data.year);
        
            if (safraAlreadyExists && safraAlreadyExists.id !== safra.id) {
                return { status: 400, message: 'Ano da safra já existente. favor consultar os inativos' };
            }

            safra.year = data.year;
            safra.typeCrop = data.typeCrop;
            safra.plantingStartTime = data.plantingStartTime;
            safra.plantingEndTime = data.plantingEndTime;
            safra.status = data.status;
            
            await this.safraRepository.update(safra.id, safra);

            return {status: 200, message: "Item atualizado"}
        } catch (err) {
            return { status: 404, message: "Erro ao atualizar" }
        }
    }
}
