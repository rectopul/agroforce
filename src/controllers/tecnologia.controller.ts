import { TecnologiaRepository } from '../repository/tecnologia.repository';

export class TecnologiaController {
    tecnologiaRepository = new TecnologiaRepository();
 
    async getAll(options: object | any) {
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
                options.filterSearch=  '{"contains":"' + options.filterSearch + '"}';
                parameters.name  = JSON.parse(options.filterSearch);
            }

            if (options.paramSelect) {
                let objSelect = options.paramSelect.split(',');
                Object.keys(objSelect).forEach((item) => {
                    select[objSelect[item]] = true;
                });
                select = Object.assign({}, select);
            } else {
                select = {id: true, name: true, desc:true, cod_tec:true, status:true};
            }

            if (options.id_culture) {
                parameters.id_culture = parseInt(options.id_culture);
            }

            if (options.name) {
                parameters.name = options.name;
            }

            if (options.cod_tec) {
                parameters.cod_tec = options.cod_tec;
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

            let response =  await this.tecnologiaRepository.findAll(parameters, select, take, skip, orderBy);
            if (!response || response.total <=0) { 
                return {status: 400, response: [], total: 0}
            } else {
                return {status: 200, response, total: response.total}
            }             
        } catch (err) {
            return { status: 400, response: [], total: 0 }
        }
    }
 
    async getOne(id: string) {
        let newID = parseInt(id);
        try {
            if (id && id != '{id}') {
                let response = await this.tecnologiaRepository.findOne(newID); 
                if (!response) {
                return {status: 400, response:{error: 'local não existe'}};
                } else {
                    return {status:200 ,response: response};
                }
            } else {
                return {status:405, response:{error: 'id não informado'}};
            }
        } catch (err) {
            return {status: 400, message: err}
        }
    }

    async post(data: object | any) {
        try {
            if (data != null && data != undefined) {
                let validate = await this.getAll({cod_tec: data.cod_tec, id_culture: data.id_culture});
                console.log(validate);
                if (validate.total > 0) {
                    return {status: 400, message: 'Código tecnologia ja cadastrado nessa cultura'}
                }
                let response = await this.tecnologiaRepository.create(data);
                if(response) {
                    return {status: 200, message: "tipo ensaio inserido"}
                } else {
                    return {status: 400, message: "erro"}
                }
            }
        } catch (err) {
            console.log(err);
            return {status: 400, message: err}
        }
    }

    async update(data: any) {
        const parameters: object | any = new Object();
        try {
            if (typeof(data.status) === 'string') {
                parameters.status =  parseInt(data.status);
            } else { 
                parameters.status =  data.status;
            }

            if(data.name) parameters.name = data.name;
            if(data.desc) parameters.desc = data.desc;
            if(data.status) parameters.status = data.status;
            if (data != null && data != undefined) {
                let response = await this.tecnologiaRepository.update(data.id, parameters);
                if(response) {
                    return {status: 200, message: {message: "Tecnologia atualizado com sucesso"}}
                } else {
                    return {status: 400, message: {message: "erro ao tentar fazer o update"}}
                }
            }
        } catch (err) {
            return {status: 400, message: err}
        }
    }
}
