import { prisma } from 'src/pages/api/db/db';
import {SafraRepository} from '../repository/safra.repository';

interface Safra {
    id_culture: number;
    year: string;
    typeCrop: string;
    plantingStartTime: string;
    plantingEndTime: string;
    main_safra?: number;
    status?: number;
    created_by: number;
  };
export class SafraController {
    safraRepository = new SafraRepository();

    async getAllSafra(options: any) {
        const parameters: object | any = new Object();
        let take; 
        let skip;
        let orderBy: object | any;
        let select: any = [];
        try {
            if (options.filterStatus) {
                if (typeof(options.filterStatus) === 'string') {
                    parameters.status = parseInt(options.filterStatus);
                } else {
                    parameters.status = options.filterStatus;
                }
            }

            if (options.id_culture) {
                parameters.id_culture = options.id_culture;
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
                    main_safra:true, 
                    status: true
                };
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

    async postSafra(data: Safra) {
        try {
            const safraRepository = new SafraRepository();

            const safraAlreadyExists = await safraRepository.findByYear(data.year);
        
            if (safraAlreadyExists) return { status: 400, message: "Safra já existente" };

            await safraRepository.create(data);

            return {status: 201, message: "Item inserido"}
        } catch(err) {
            return { status: 404, message: "Erro"}
        }
    }

    async updateSafra(data: any) {
        try {
            const safraRepository = new SafraRepository();

            const safraAlreadyExists = await safraRepository.findByYear(data.year);
        
            if (safraAlreadyExists) return { status: 400, message: "Safra já existente" };
            
            await safraRepository.update(data.id, data);

            return {status: 200, message: "Item atualizado"}
        } catch (err) {
            return { status: 404, message: "Erro ao atualizar" }
        }
    }
}
