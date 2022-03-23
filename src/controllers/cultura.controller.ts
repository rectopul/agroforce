import {CulturaRepository} from '../repository/culture.repository';
import { ICreateCultureDTO } from 'src/shared/dtos/culturaDTO/ICreateCultureDTO';
import { IUpdateCultureDTO } from 'src/shared/dtos/culturaDTO/IUpdateCultureDTO';
import { validationCreateCulture } from 'src/shared/validations/cultura/createValidation';
import { validationUpdateCulture } from 'src/shared/validations/cultura/updateValidation';

export class CulturaController {
    culturaRepository = new CulturaRepository();

    getAllCulture() {
        const parameters: object | any = new Object();
        let take; 
        let skip;
        let orderBy: object | any;
        let select: any = [];
        let response =  this.culturaRepository.findAll(parameters, select, take, skip, orderBy);
        return response;        
    }

    async getOneCulture(id: number) {
        try {
            if (!id) throw new Error("Dados inválidos");
      
            const response = await this.culturaRepository.findOne(id);
      
            if (!response) throw new Error("Dados inválidos");
      
            return {status: 200 , response};
        } catch (e) {
        return {status: 400, message: 'Cultura não encontrada'};
        }
    }

    async postCulture(data: ICreateCultureDTO) {
        try {
            // Validação
            const valid = validationCreateCulture.isValidSync(data);
        
            if (!valid) throw new Error('Dados inválidos');
        
            // Salvando
            await this.culturaRepository.create(data);
        
            return {status: 201, message: "Cultura cadastrada com sucesso!"}
        } catch(err) {
            return { status: 404, message: "Erro"}
        }
    }

    async updateCulture(data: IUpdateCultureDTO) {
        try {
            // Validação
            const valid = validationUpdateCulture.isValidSync(data);
      
            if (!valid) throw new Error('Dados inválidos');
      
            // Salvando
            await this.culturaRepository.update(data.id, data);
      
            return { status: 200, message: "Cultura atualizada" }
        } catch (err) {
            return { status: 404, message: "Erro ao atualizar" }
        }
    }
}
