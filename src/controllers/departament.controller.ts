import {DepartamentRepository} from '../repository/departament.repository';
import { Controller, Get, Post, Put } from '@nestjs/common';
@Controller()
export class DepartamentController {
    departamentRepository = new DepartamentRepository();

    @Get()
    async getAllDepartaments() {
        let response = await this.departamentRepository.findAll();
        return response;        
    }

    @Get()
    async getOneDepartament(id: string) {
        let newID = parseInt(id);
        if (id && id != '{id}') {
            let response = await this.departamentRepository.findOne(newID); 
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
    async postDepartament(data: object) {
        if (data != null && data != undefined) {
            let response = await this.departamentRepository.create(data);
            if(response) {
                return {status: 200, message: "cultura inserida"}
            } else {
                return {status: 400, message: "erro"}

            }
        }
    }

    @Put()
    async updateDepartament(id: string, data: object) {
        let newID = parseInt(id);
        if (data != null && data != undefined) {
            let response = await this.departamentRepository.update(newID, data);
            if(response) {
                return {status: 200, message: {message: "cultura atualizada"}}
            } else {
                return {status: 400, message: {message: "erro ao tentar fazer o update"}}

            }
        }
    }
}
