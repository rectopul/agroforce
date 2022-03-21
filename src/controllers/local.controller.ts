import {LocalRepository} from '../repository/local.repository';
import { Controller, Get, Post, Put } from '@nestjs/common';

@Controller()
export class LocalController {
    localRepository = new LocalRepository();

    @Get()
    async getUFs() {
        try {
            const parameters: object | any = new Object();
            let take; 
            let skip;
            let orderBy: object | any;
            let select: any = {nome: true, id: true, sigla: true};
            return this.localRepository.findUFs(parameters, select, take, skip, orderBy);
        } catch(e) {
            return {status:400, message: "estado não encontrada"}
        }
    }

    @Get()
    async getOnUFs(id: Number | any) {
        let response = await this.localRepository.findOneUFs(id);
        if (response) { 
            return response;
        }
    }


    async getCitys(ufId: number | any) {
        const parameters: object | any = new Object();
        let take; 
        let skip;
        let orderBy: object | any;
        let select: any = {nome: true, id: true, ufid: true};

        if (ufId) {
            parameters.ufid = parseInt(ufId);
        }

        return this.localRepository.findCitys(parameters, select, take, skip, orderBy);
    }

    @Get()
    async getAllLocal(options: object | any) {
        const parameters: object | any = new Object();
        let take; 
        let skip;
        let orderBy: object | any;
        let select: any = [];

        if (options.filterStatus) {
            if (typeof(options.status) === 'string') {
                options.filterStatus = parseInt(options.filterStatus);
                if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
            } else {
                if (options.filterStatus != 2) parameters.status =parseInt(options.filterStatus);
            }
        }

        if (options.filterSearch) {
            options.filterSearch=  '{"contains":"' + options.filterSearch + '"}';
            parameters.name  = JSON.parse(options.filterSearch);
            parameters.address =JSON.parse(options.filterSearch);
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

        if (options.paramSelect) {
            let objSelect = options.paramSelect.split(',');
            Object.keys(objSelect).forEach((item) => {
                select[objSelect[item]] = true;
            });
            select = Object.assign({}, select);
        } else {
            select = {id: true, name: true, pais:true, uf:true, city:true, address:true, latitude: true, longitude: true, altitude: true,  status:true};
        }

        let response =  await this.localRepository.findAll(parameters, select, take, skip, orderBy);
        if (!response) { 
            throw "falha na requisição, tente novamente";
        } else {
            return {status: 200, response, total: response.total}
        }             
    }

    @Get()
    async getOneLocal(id: string) {
        let newID = parseInt(id);
        if (id && id != '{id}') {
            let response = await this.localRepository.findOne(newID); 
            if (!response) {
               return {status: 400, response:{error: 'local não existe'}};
            } else {
                return {status:200 ,response: response};
            }
        } else {
            return {status:405, response:{error: 'id não informado'}};
        }
    }

    @Post()
    async postLocal(data: object | any) {
        if (data != null && data != undefined) {
            if (data.uf) {
               let uf = await this.getOnUFs(parseInt(data.uf));
               data.uf = uf?.sigla;
            }
            let response = await this.localRepository.create(data);
            if(response) {
                return {status: 200, message: "local inserido"}
            } else {
                return {status: 400, message: "erro"}

            }
        }
    }

    @Put()
    async updateLocal(data: any) {
        const parameters: object | any = new Object();

        if (typeof(data.status) === 'string') {
            parameters.status =  parseInt(data.status);
        } else { 
            parameters.status =  data.status;
        }

        if(data.name) parameters.name = data.name;

        if (data != null && data != undefined) {
            let response = await this.localRepository.update(data.id, parameters);
            if(response) {
                return {status: 200, message: {message: "cultura atualizada"}}
            } else {
                return {status: 400, message: {message: "erro ao tentar fazer o update"}}
            }
        }
    }
}