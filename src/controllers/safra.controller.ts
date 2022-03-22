import {SafraRepository} from '../repository/safra.repository';
import {ISafraPropsDTO} from '../shared/dtos/ISafraPropsDTO';
import { validationSafra } from '../shared/validations/safra/create.validation';
import { validationSafraUpdate } from 'src/shared/validations/safra/update.validation';
import { ISafraUpdateDTO } from 'src/shared/dtos/ISafraUpdateDTO';


export class SafraController {
    safraRepository = new SafraRepository();

    /**
     * 
     * @returns Listagem de todas as safras.
     * @example Options: 
     * 
     */
    async getAllSafra(options: any) {
        const parameters: object | any = new Object();
        let take; 
        let skip;
        let orderBy: object | any;
        let select: any = [];

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
        console.log('Controller' + response);
        if (!response) { 
            throw "falha na requisição, tente novamente";
        } else {
            return {status: 200, response, total: response.total}
        }       
    }

    async getOneSafra(id: number) {
        try {
            if (!id) throw new Error("ID inválido");

            const response = await this.safraRepository.findOne(id);
    
            if (!response) throw new Error("Dados inválidos");

            return {status:200 , response};
        } catch (e) {
            return {status: 400, message: 'Safra não encontrada'};
        }
    }

    async postSafra(data: ISafraPropsDTO) {
        try {
            const safraRepository = new SafraRepository();

            // Validação
            const valid = validationSafra.isValidSync(data);

            if (!valid) throw new Error('Dados inválidos');

            // Salvando

            await safraRepository.create(data);

            return {status: 200, message: "Safra inserida"}
        } catch(err) {
            return { status: 404, message: "Erro"}
        }
    }

    /**
    * @returns Função responsavel por fazer a atualização da safra 
    * @parameters data. objeto com as informações a serem atualizadas
     */

    async updateSafra(data: ISafraUpdateDTO) {
        try {
            const safraRepository = new SafraRepository();

            // Validação
            const valid = validationSafraUpdate.isValidSync(data);

            if (!valid) throw new Error('Dados inválidos');

            // Salvando

            await safraRepository.update(data.id, data);

            return {status: 200, message: "Safra inserida"}
        } catch (err) {
            return { status: 404, message: "Erro ao atualizar" }
        }
    }
}
