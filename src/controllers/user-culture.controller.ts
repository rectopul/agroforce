import {UserCultureRepository} from '../repository/user-culture.repository';

import { functionsUtils } from 'src/shared/utils/functionsUtils';
export class UserCultureController {
    userCultureRepository = new UserCultureRepository();

    async getAll(options: any) {
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
                parameters.email =JSON.parse(options.filterSearch);
            }

            if (options.paramSelect) {
                let objSelect = options.paramSelect.split(',');
                Object.keys(objSelect).forEach((item) => {
                    select[objSelect[item]] = true;
                });
                select = Object.assign({}, select);
            } else {
                select = {id: true, userId: true, cultureId: true};
            }

            if (options.userId) {
                parameters.userId = parseInt(options.userId);
            }

            if (options.cultureId) {
                parameters.cultureId = parseInt(options.cultureId);
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
            
            let response: object | any = await this.userCultureRepository.findAll(parameters,select, take , skip, orderBy );

            if (!response || response.total <=0) { 
                return {status: 400, response: [], total: response.total}
            } else {
                return {status: 200, response, total: response.total}
            }
        } catch (err) {

        }        
    }

    async getOne(id: string) {
        let newID = parseInt(id);
        try {
            if (id && id != '{id}') {
                let response = await this.userCultureRepository.findOne(newID); 
                if (!response) {
                return {status: 400, response: [], message: 'relação não existe'};
                } else {
                    return {status:200 , response};
                }
            } else {
                return {status:405, response:{error: 'id não informado'}};
            }
        } catch (err) {

        } 
    }

    async getByUserID(userId: Number | any)  {
        let newID = parseInt(userId);
        try {
            if (userId && userId != '{id}') {
                let response = await this.userCultureRepository.findAllByUser(newID); 
                if (!response || response.length == 0) {
                    return {status: 400, response:[], message: 'usuario não tem cultura'};
                } else {
                    return {status:200 , response};
                }
            } else {
                return {status:405, response:{error: 'id não informado'}};
            }
        } catch (err) {
            console.log(err);
        }  
    }

    async save(data: object | any) {
        try {
     
            if (data != null && data != undefined) {
                const create: object | any  = new Object();
                let result: object | any= await this.getAll({userId: data.userId, cultureId: data.cultureId});

                if (result.total <= 0) {
                    if (typeof(data.cultureId) === 'string') {
                        create.cultureId =  parseInt(data.cultureId);
                    } else { 
                        create.cultureId =  data.cultureId;
                    }

                    if (typeof(data.userId) === 'string') {
                        create.userId =  parseInt(data.userId);
                    } else { 
                        create.userId =  data.userId;
                    }

                    create.created_by = data.created_by;

                    let response: object | any  = await this.userCultureRepository.create(create);
                    if(response.count > 0) {
                        return {status: 200, message: {message: "Usuario atualizada"}}
                    } else {
                        return {status: 400, message: {message: "usuario não existe"}}
                    }
                }
            }
        } catch (err) {
            console.log(err)
        }  
    }   

    async update(data: object| any) {
        try {
            if (data != null && data != undefined) {
                const parameters: object | any  = new Object();

                if (typeof(data.status) === 'string') {
                    parameters.status =  parseInt(data.status);
                } else { 
                    parameters.status =  data.status;
                }

                if (typeof(data.app_login) === 'string') {
                    parameters.app_login =  parseInt(data.app_login);
                } else { 
                    parameters.app_login =  data.app_login;
                }

                if (typeof(data.jivochat) === 'string') {
                    parameters.jivochat =  parseInt(data.jivochat);
                } else { 
                    parameters.jivochat =  data.jivochat;
                }

                if (typeof(data.departmentId) === 'string') {
                    parameters.departmentId =  parseInt(data.departmentId);
                } else { 
                    parameters.departmentId =  data.departmentId;
                }

                if (data.name) {
                    parameters.name = data.name;
                } 

                if (data.email) {
                    parameters.email = data.email;
                } 

                if (data.cpf) {
                    if(!functionsUtils.validationCPF(data.cpf)) return {message: 'CPF invalído'};
                    parameters.cpf = data.cpf;
                }

                if (data.tel) {
                    parameters.tel = data.tel;
                }

                if (data.password) {
                    parameters.password = data.password;
                }

                if (data.created_by) {
                    parameters.created_by = data.created_by;
                }

                let response: object | any  = await this.userCultureRepository.update(data.id, parameters);

                if(response.count > 0) {
                    if (data.profiles) {
                        const parametersPermissions = new Object();
                        // functionsUtils.getPermissions(data.id, data.profiles);
                        // Object.keys(data.profiles).forEach((item) => {
                        //     if (typeof(data.profiles[item].profileId) === 'string') {
                        //         parametersPermissions.profileId =  parseInt( data.profiles[item].profileId);
                        //     } else { 
                        //         parametersPermissions.profileId = data.profiles[item].profileId;
                        //     }
                        //     parametersPermissions.userId = data.id;
                        //     parametersPermissions.created_by = data.created_by;
                        //     this.usersPermissionRepository.create(parametersPermissions);
                        // });
                    }
                    return {status: 200, message: {message: "Usuario atualizada"}}
                } else {
                    return {status: 400, message: {message: "usuario não existe"}}

                }
            }
        } catch (err) {

        }  
    }

    async delete(data: object| any) {
        try {
            if (data != null && data != undefined) {
                const update: object | any  = new Object();
                const where: object | any  = new Object();
                const create: object | any  = new Object();
                

                if (typeof(data.userId) === 'string') {
                    where.userId =  parseInt(data.userId);
                    create.userId =  parseInt(data.userId);
                    update.userId =  parseInt(data.userId);
                } else { 
                    where.userId =  data.userId;
                    create.userId =  data.userId;
                    update.userId =  data.userId;
                }

                let result: object | any= await this.getAll(where);

                if (!result.response[0].id) {
                    if (typeof(data.cultureId) === 'string') {
                        where.cultureId =  parseInt(data.cultureId);
                        create.cultureId =  parseInt(data.cultureId);
                        update.cultureId =  parseInt(data.cultureId);
                    } else { 
                        where.cultureId =  data.cultureId;
                        create.cultureId =  data.cultureId;
                        update.cultureId =  data.cultureId;
                    }

                    create.created_by = 1;

                    let response: object | any  = await this.userCultureRepository.upsert(update, where, create);
                    if(response.count > 0) {
                        return {status: 200, message: {message: "Usuario atualizada"}}
                    } else {
                        return {status: 400, message: {message: "usuario não existe"}}
                    }
                }
            }
        } catch (err) {
            // console.log(err)
        }  
    }
}
