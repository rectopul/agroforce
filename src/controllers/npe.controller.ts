import {NpeRepository} from '../repository/npe.repository';
import {prisma} from '../pages/api/db/db';

export class NpeController {
    Repository = new NpeRepository();
 
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

            if (options.id_safra) {
                parameters.id_safra = parseInt(options.id_safra);
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
                select = {id: true, local:{select:{name:true}}, safra:{select:{year:true}}, foco:{select:{name:true}}, epoca:{select:{name:true}}, type_assay: {select:{name:true}}, npei: true, npef: true, status: true};
            }

            let response =  await this.Repository.findAll(parameters, select, take, skip, orderBy);

            if (!response || response.total <=0) { 
                return {status: 400, response: [], total: 0, message: 'nenhum resultado encontrado'}
            } else {
                return {status: 200, response, total: response.total}
            }             
        } catch (err) {
            console.log(err);
        }  
    }
 
    async getOne(id: string) {
        let newID = parseInt(id);
        try {
            if (id && id != '{id}') {
                let response = await this.Repository.findOne(newID); 
                if (!response) {
                return {status: 400, response:[], message: 'local não existe'};
                } else {
                    return {status:200 ,response: response};
                }
            } else {
                return {status:405, response:[], message: 'id não informado'};
            }
        } catch (err) {

        } 
    }

    async validateNpeiDBA(data: any) {
        try {
            if (data.safra) {
                let safra: any = await prisma.$queryRaw`SELECT (npei + 1) as npei, s.year as safra
                                                        FROM npe n
                                                        INNER JOIN safra s on s.id = n.id_safra
                                                        WHERE s.year = ${data.safra}
                                                        ORDER BY npei DESC 
                                                        LIMIT 1`;
                if ((safra[0]) && safra[0].npei > data.npei) {
                    let safraAndFoco: any = await prisma.$queryRaw`SELECT (npei + 1) as npei, s.year as safra, f.name as foco 
                                                                FROM npe n
                                                                INNER JOIN safra s on s.id = n.id_safra
                                                                INNER JOIN foco f on f.id = n.id_foco
                                                                WHERE s.year = ${data.safra}
                                                                AND f.name = ${data.foco}
                                                                ORDER BY npei DESC 
                                                                LIMIT 1`;
                    if ((safraAndFoco[0]) && safraAndFoco[0].npei > data.npei) {
                        return `<span>A ${data.Column}º coluna da ${data.Line}º linha está incorreta, NPEI ja cadastrado</span><br>`;
                    }
                }
           }
           return "";
        } catch (err) {
            console.log(err);
        }
    }

    async post(data: object | any) {
        try {
            if (data != null && data != undefined) {
                let response = await this.Repository.create(data);
                if(response) {
                    return {status: 200, message: "itens inseridos"}
                } else {
                    return {status: 400, message: "erro"}
                }
            }
        } catch (err) {
            console.log(err)
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
            if(data.status) parameters.status = data.status;
            if (data != null && data != undefined) {
                let response = await this.Repository.update(data.id, parameters);
                if(response) {
                    return {status: 200, message: {message: "layoult atualizado"}}
                } else {
                    return {status: 400, message: {message: "erro ao tentar fazer o update"}}
                }
            }
        } catch (err) {
            
        }
    }
}
