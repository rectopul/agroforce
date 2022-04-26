import { UsersPermissionsRepository } from 'src/repository/user-permission.repository';
import { functionsUtils } from 'src/shared/utils/functionsUtils';
import { UserRepository } from '../repository/user.repository';
import { UserCultureController } from './user-culture.controller';
import { UserPermissionController } from './user-permission.controller';
var  CryptoJS  =  require ("crypto") ; 
const alg = 'aes-256-ctr';
const pwd = 'TMG2022';

export class UserController {
    userRepository = new UserRepository();
    usersPermissionRepository = new UsersPermissionsRepository();
    userCultureController = new UserCultureController();
    userPermissionsController = new UserPermissionController();

    async getAllUser(options: any) {
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
                select = {id: true, name: true, cpf:true, email:true, tel:true, avatar:true, status: true};
            }

            if (options.cpf) {
                parameters.cpf = options.cpf;
            }

            if (options.email) {
                parameters.email = options.email;
            }
            
            
            if (options.tel) {
                parameters.tel = options.tel;
            }

            if (options.id) {
                parameters.id = options.id;
            }

            if (options.app_login) {
                parameters.app_login = options.app_login;
            }
            if (options.departmentId) {
                parameters.departmentId = options.departmentId;
            }

            if (options.registration) {
                parameters.registration = options.registration;
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

            let response: object | any = await this.userRepository.findAll(parameters,select, take , skip, orderBy );
            if (!response || response.total <=0) {
                return {status: 400, response:[], total: 0, message: 'nenhum resultado encontrado'};
            } else {
                return {status: 200, response, total: response.total};
            }

        } catch(err) {
            return {status: 400, message: err}
        }
            
    }

    async getOneUser(id: string) {
        let newID = parseInt(id);
        try {
            if (id && id != '{id}') {
                let response = await this.userRepository.findOne(newID); 
                if (!response) {
                    return {status: 400, response:[], message: 'user não existe'};
                } else {
                    let cultures: object | any= await this.userCultureController.getByUserID(id)
                    return {status:200 , response, culture: response.cultures };
                }
            } else {
                return {status:405, response:{error: 'id não informado'}};
            }
        } catch(err) {
            return {status: 400, message: err}
        }
    }

    async postUser(data: object | any) {
        const parameters: object | any = new Object();
        const parametersPermissions: object | any  = new Object();
        try {
            if (data != null && data != undefined) {
                data.password = functionsUtils.Crypto(data.password, 'cipher');
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

                if (!data.name) return {status: 400, message: 'Informe o nome do usuário'};
                if (!data.email) return {status: 400, message: 'Informe o email do usuário'}; 
                if (!data.cpf) return {status: 400, message: 'Informe o cpf do usuário'};
                if (!data.tel) return {status: 400, message: 'Informe o telefone do usuário'};
                if (!data.departmentId) return {status: 400, message: 'Informe o departamento do usuário'};
                if (!data.password) return {status: 400, message: 'Informe a senha do usuário'};

                // Validação de email existente. 
                let validateEmail: object | any = await this.getAllUser({email:data.email});
                if (validateEmail.total > 0)return {status: 400, message: 'Email ja cadastrado'};

                // Validação de cpf existente. 
                let validateCPF: object | any  = await this.getAllUser({cpf:data.cpf});
                if (validateCPF.total > 0) return {status: 400, message: 'CPF já cadastrado'};

                // Validação cpf é valido
                if(!functionsUtils.validationCPF(data.cpf))  return {status: 400, message: 'CPF invalído'};

                parameters.name = data.name;
                parameters.email = data.email;
                parameters.cpf = data.cpf;
                parameters.tel = data.tel;
                parameters.password = data.password;
                parameters.created_by = data.created_by;

                let response = await this.userRepository.create(parameters);
        
                if(response) {
                    if (data.cultures) {
                        Object.keys(data.cultures).forEach((item) => {
                            data.cultures[item].profiles.forEach((profile: any) => {
                                this.userPermissionsController.post({userId: response.id, profileId: parseInt(profile), cultureId: parseInt(data.cultures[item].cultureId), created_by: parseInt(data.created_by)});
                            });
                        });
                    }
                    if (data.cultureId) {
                            this.userCultureController.save({cultureId: data.cultureId, userId: response.id, created_by: data.created_by });
                    }
                    return {status: 200, message: "users inseridos"}
                } else {
                    return {status: 400, message: "houve um erro, tente novamente"}
                }
            }
        } catch(err) {
            return {status: 400, message: err}
        }
    }

    async signinUSer(data: object | any) {
        try {
            if (data != null && data != undefined) {
                data.password = functionsUtils.Crypto(data.password, 'cipher');
                return await this.userRepository.signIn(data);
            }
        } catch(err) {
            return {status: 400, message: err}
        }
    }

    async updateUser(data: object| any) {
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

                if (typeof(data.registration) === 'string') {
                    parameters.registration =  parseInt(data.registration);
                } else { 
                    parameters.registration =  data.registration;
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
                    parameters.password = functionsUtils.Crypto(data.password, 'cipher');

                }

                if (data.created_by) {
                    parameters.created_by = data.created_by;
                }

                let response: object | any  = await this.userRepository.update(data.id, parameters);

                if(response.count > 0) {
                    if (data.cultures) {
                        Object.keys(data.cultures).forEach((item) => {
                            data.cultures[item].profiles.forEach((profile: any) => {
                                this.userPermissionsController.post({userId: data.id, profileId: parseInt(profile), cultureId: parseInt(data.cultures[item].cultureId), created_by: parseInt(data.created_by)});
                            });
                        });
                    }
                    return {status: 200, message: {message: "Usuario atualizada"}}
                } else {
                    return {status: 400, message: {message: "usuario não existe"}}
                }
            }
        } catch(err) {
            
        }
    }
}
