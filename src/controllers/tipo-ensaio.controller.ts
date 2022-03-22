import {TypeAssayRepository} from '../repository/tipo-ensaio.repository';

export class TypeAssayController {
    Repository = new TypeAssayRepository();
 
    async getAll(options: object | any) {
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
            select = {id: true, name: true, status:true};
        }

        let response =  await this.Repository.findAll(parameters, select, take, skip, orderBy);
        if (!response) { 
            throw "falha na requisição, tente novamente";
        } else {
            return {status: 200, response, total: response.total}
        }             
    }
 
    async getOne(id: string) {
        let newID = parseInt(id);
        if (id && id != '{id}') {
            let response = await this.Repository.findOne(newID); 
            if (!response) {
               return {status: 400, response:{error: 'local não existe'}};
            } else {
                return {status:200 ,response: response};
            }
        } else {
            return {status:405, response:{error: 'id não informado'}};
        }
    }

    async post(data: object | any) {
        if (data != null && data != undefined) {
            let response = await this.Repository.create(data);
            if(response) {
                return {status: 200, message: "tipo ensaio inserido"}
            } else {
                return {status: 400, message: "erro"}
            }
        }
    }

    async update(data: any) {
        const parameters: object | any = new Object();

        if (typeof(data.status) === 'string') {
            parameters.status =  parseInt(data.status);
        } else { 
            parameters.status =  data.status;
        }

        if(data.name) parameters.name = data.name;
        if(data.status) parameters.status = data.status;
        if (data != null && data != undefined) {
            let response = await this.Repository.update(data.id, parameters);
            if(response) {
                return {status: 200, message: {message: "layoult atualizado"}}
            } else {
                return {status: 400, message: {message: "erro ao tentar fazer o update"}}
            }
        }
    }
}
