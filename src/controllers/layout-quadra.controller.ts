import { LayoutQuadraRepository } from '../repository/layout-quadra.repository';

export class LayoutQuadraController {
    Repository = new LayoutQuadraRepository();

    async getAll(options: object | any) {
        console.log(options)
        const parameters: object | any = {};
        let take;
        let skip;
        let orderBy: object | any;
        let select: any = [];
        try {
            if (options.filterStatus) {
                if (typeof (options.status) === 'string') {
                    options.filterStatus = parseInt(options.filterStatus);
                    if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
                } else {
                    if (options.filterStatus != 2) parameters.status = parseInt(options.filterStatus);
                }
            }

            if (options.filterCodigo) {
                parameters.id  = Number(options.filterCodigo);
            }

            if (options.filterEsquema) {
                options.filterEsquema=  '{"contains":"' + options.filterEsquema + '"}';
                parameters.esquema  = JSON.parse(options.filterEsquema);
            }

            if (options.filterDisparos) {
                parameters.disparos  = Number(options.filterDisparos);
            }

            if (options.filterTiros) {
                parameters.tiros  = Number(options.filterTiros);
            }

            if (options.filterPlantadeira) {
                options.filterPlantadeira=  '{"contains":"' + options.filterPlantadeira + '"}';
                parameters.plantadeira  = JSON.parse(options.filterPlantadeira);
            }

            if (options.filterParcelas) {
                parameters.parcelas  = Number(options.filterParcelas);
            }

            if (options.esquema) {
                parameters.esquema = options.esquema;
            }

            if (options.status) {
                parameters.status = Number(options.status);
            }

            if (options.id_culture) {
                parameters.id_culture = Number(options.id_culture);
            }
    
            if (options.take) {
                if (typeof (options.take) === 'string') {
                    take = parseInt(options.take);
                } else {
                    take = options.take;
                }
            }

            if (options.skip) {
                if (typeof (options.skip) === 'string') {
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
                select = {id: true, esquema: true, plantadeira:true, disparos:true, tiros:true, parcelas:true, status: true, id_culture: true};
            }

            let response =  await this.Repository.findAll(parameters, select, take, skip, orderBy);
             
            if (!response || response.total <= 0) { 
                return {status: 400, response: [], total:0}
            } else {
                return { status: 200, response, total: response.total }
            }
        } catch (err) {
            return { status: 400, response: [], total: 0 }
        }
    }

    async getOne(id: string) {
        let newID = parseInt(id);
        try {
            if (id && id !== '{id}') {
                let response = await this.Repository.findOne(newID);
                if (!response) {
                    return { status: 400, response: [], message: 'local não existe' };
                } else {
                    return { status: 200, response: response };
                }
            } else {
                return { status: 405, response: [], message: 'id não informado' };
            }
        } catch (err) {
            return { status: 400, message: err };
        }
    }

    async post(data: object | any) {
        try {
            if (data !== null && data !== undefined) {
                let response = await this.Repository.create(data);
                if(response) {
                    return {status: 200, message: "layout inserido", response}
                } else {
                    return { status: 400, message: "erro" }
                }
            }
        } catch (err) {
            return { status: 400, message: err }
        }
    }

    async update(data: any) {
        const parameters: object | any = {};

        try {
            if (typeof (data.status) === 'string') {
                parameters.status = parseInt(data.status);
            } else {
                parameters.status = data.status;
            }

            if (data.esquema) parameters.esquema = data.esquema;
            if (data.semente_metros) parameters.semente_metros = data.semente_metros;
            if (data.op) parameters.op = data.op;
            if (data.disparos) parameters.disparos = data.disparos;
            if (data.divisor) parameters.divisor = data.divisor;
            if (data.largura) parameters.largura = data.largura;
            if (data.comp_fisico) parameters.comp_fisico = data.comp_fisico;
            if (data.comp_parcela) parameters.comp_parcela = data.comp_parcela;
            if (data.comp_corredor) parameters.comp_corredor = data.comp_corredor;
            if (data.t4_inicial) parameters.t4_inicial = data.t4_inicial;
            if (data.t4_final) parameters.t4_final = data.t4_final;
            if (data.df_inicial) parameters.df_inicial = data.df_inicial;
            if (data.df_final) parameters.df_final = data.df_final;
            if (data.localId) parameters.localId = data.localId;

            if (data !== null && data !== undefined) {
                let response = await this.Repository.update(data.id, parameters);
                if (response) {
                    return { status: 200, message: { message: "Layout atualizado com sucesso" } }
                } else {
                    return { status: 400, message: { message: "erro ao tentar fazer o update" } }
                }
            }
        } catch (err) {
            return { status: 400, message: err }
        }
    }
}
