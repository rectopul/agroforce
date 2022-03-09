import {CulturaRepository} from '../repository/culture.repository';
import { Controller, Get, Post, Put } from '@nestjs/common';
@Controller()
export class CulturaController {
    culturaRepository = new CulturaRepository();

    @Get()
    getAllCulture() {
        let response =  this.culturaRepository.findAll();
        return response;        
    }

    @Get()
    async getOneCulture(id: string) {
        let newID = parseInt(id);
        if (id && id != '{id}') {
            let response = await this.culturaRepository.findOne(newID); 
            if (!response) {
               return {status: 400, response:{error: 'cultura não existe'}};
            } else {
                return {status:200 ,response: response};
            }
        } else {
            return {status:405, response:{error: 'id não informado'}};
        }
    }

    @Post()
    async postCulture(data: object) {
        if (data != null && data != undefined) {
            let response = await this.culturaRepository.create(data);
            if(response) {
                return {status: 200, message: "cultura inserida"}
            } else {
                return {status: 400, message: "erro"}

            }
        }
    }

    @Put()
    async updateCulture(data: any) {
        const parameters: object | any = new Object();

        if (typeof(data.status) === 'string') {
            parameters.status =  parseInt(data.status);
        } else { 
            parameters.status =  data.status;
        }

        if(data.name) parameters.name = data.name;

        if (data != null && data != undefined) {
            let response = await this.culturaRepository.update(data.id, parameters);
            if(response) {
                return {status: 200, message: {message: "cultura atualizada"}}
            } else {
                return {status: 400, message: {message: "erro ao tentar fazer o update"}}
            }
        }
    }
}
