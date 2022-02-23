import {CulturaService} from '../repository/culture.repository';
import { Controller, Get, Post, Put } from '@nestjs/common';
@Controller()
export class CulturaController {
    culturaService = new CulturaService();

    @Get()
    getAllCulture() {
        let response =  this.culturaService.findAll();
        return response;        
    }

    @Get()
    async getOneCulture(id: string) {
        let newID = parseInt(id);
        if (id && id != '{id}') {
            let response = await this.culturaService.findOne(newID); 
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
            let response = await this.culturaService.create(data);
            if(response.count > 0) {
                return {status: 200, message: {message: "cultura inserida"}}
            } else {
                return {status: 400, message: {message: "erro"}}

            }
        }
    }

    @Put()
    async updateCulture(id: string, data: object) {
        let newID = parseInt(id);
        if (data != null && data != undefined) {
            let response = await this.culturaService.update(newID, data);
            if(response) {
                return {status: 200, message: {message: "cultura atualizada"}}
            } else {
                return {status: 400, message: {message: "erro ao tentar fazer o update"}}

            }
        }
    }
}
