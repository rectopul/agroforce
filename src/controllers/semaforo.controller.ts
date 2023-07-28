import handleError from '../shared/utils/handleError';
import {SemaforoRepository} from "../repository/semaforo.repository";
import {SemaforoItemRepository} from 'src/repository/semaforo-item.repository';
import {NpeRepository} from "../repository/npe.repository";
import {ExperimentRepository} from "../repository/experiment.repository";
import {ExperimentGenotipeRepository} from "../repository/experiment-genotipe.repository";
import {NpeController} from "./npe/npe.controller";
import {IReturnObject} from "../interfaces/shared/Import.interface";

export class SemaforoController {
    semaforoRepository = new SemaforoRepository();
    semaforoItemRepository = new SemaforoItemRepository();
    
    async testeSemaforo() {
        const npeRepositoy = new NpeRepository();
        const experimentRepository = new ExperimentRepository();
        const experimentGenotipeRepository = new ExperimentGenotipeRepository();
        const npeController = new NpeController();
        
        const erro = false;

        const options = {
            filterLocal: 'TO501',
        };

        const {status: statusNPE, response: validateNpe}: IReturnObject = await npeController.getAll(options);

        console.log('statusNPE', statusNPE, 'validateNpe', validateNpe);
        
        if(erro){
            return {status: 400, message: 'Já tem uma sessão ativa, você não pode acessar essa ação!'};
        }
        
        
        return {status: 200, message: 'Processo em andamento!'};
    }

    /**
     * funcionamento:
     *
     * @param sessao chave da sessão quando o usuario abre uma tela
     * @param acao chave definindo a página ou local específico
     * @param referencia nome da tabela
     * @param codReferencia id do registro
     * @param created_by chave do usuário que está usando a tela
     * @param tipo chave definindo se é front ou back, se front ele veio da page, se é back veio de um cron
     * @param automatico chave definindo se desativa automaticamente depois de 10 minutos
     * @param oldIdSemaforo chave do semaforo que está sendo substituido
     */
    async validaSemaforoItem(
        sessao: string, 
        acao: string, 
        referencia: string, 
        codReferencia: string, 
        created_by: number = 0, 
        tipo: string = 'front', 
        automatico: string = 's',
        oldIdSemaforo: number | null = null,
    ): Promise<any> {

        console.log('validaSemaforoItem', sessao, acao, referencia, codReferencia, created_by, tipo, automatico);

        try {

            let responseSemaforo: object | any = {};

            // verifica se existe algum registro atrelado a uma ação qualquer
            let responseItem: object | any = await this.semaforoItemRepository.find(referencia, codReferencia);

            // se não tiver, verifica se existe semaforo para a acao específica 
            if (responseItem.length == 0) {
                responseSemaforo = await this.semaforoRepository.findAcao(acao);
            } else {
                // se encontrar o registro, nós pegamos o semaforo
                // com o semaforo em mãos, nós verificamos se ele é da mesma sessão
                if(responseItem[0].semaforoId) {
                    
                    const semaforo = await this.semaforoRepository.findById(responseItem[0].semaforoId);
                    
                    responseSemaforo = [semaforo];
                    //responseSemaforo = await this.semaforoRepository.findById(responseItem[0].semaforoId);
                } else {
                    responseSemaforo = [responseItem[0].semaforo];
                }
            }

            console.log('responseItem', responseItem);

            // se não tiver semaforo, cria um novo com a ação, seu tipo, a sessão e o usuário
            if (responseSemaforo.length <= 0) {
                // cria o semaforo
                const retorno = await this.create({
                    created_by,
                    sessao,
                    acao,
                    tipo,
                });
                
                // se o retorno for sucesso, cria o semaforo item
                console.log('retorno', retorno);
                
                if(oldIdSemaforo && retorno && retorno.status == 200 && retorno.response && retorno.response.id){
                    //await this.semaforoRepository.update(oldIdSemaforo, {status: 'i'});
                    console.log('oldIdSemaforo', oldIdSemaforo);
                    // atualiza os semaforoitem com o novo id do semaforo
                    await this.semaforoItemRepository.updateBySemaforoId(oldIdSemaforo, { semaforoId: retorno.response.id });
                    // carrega novamente o semaforo item, para caso seja dependente da acao mesmo
                    responseItem = await this.semaforoItemRepository.find(referencia, codReferencia);
                    
                } else {
                    if (retorno && retorno.status == 200 && retorno.response && retorno.response.id) {
                        // cria o semaforo item com o semaforo criado, onde armazena a referência e o codReferencia do registro
                        let retItem = await this.semaforoItemRepository.create({
                            created_by,
                            referencia,
                            codReferencia,
                            semaforoId: retorno.response.id,
                        });
                    }
                }
                
                // em caso de erro retorna o erro, e deveria estar encapsulado em uma transação do prisma, para que o semaforo não seja criado se seu item não for criado
                if (!retorno || retorno.status != 200) {
                    return retorno || {status: 400, message: 'Erro inesperado!'};
                }

                responseSemaforo = await this.semaforoRepository.findAcao(acao);
            }

            // se não tiver, verifica se existe semaforo para a acao específica
            if (responseItem.length <= 0 && responseSemaforo[0].acao == acao) {
                // cria o semaforo item
                let createdItem = await this.semaforoItemRepository.create({
                    created_by,
                    referencia,
                    codReferencia,
                    semaforoId: responseSemaforo[0].id,
                });
                console.log('createdItem', createdItem);
                responseItem = await this.semaforoItemRepository.find(referencia, codReferencia);
            }

            let semaforo = responseSemaforo[0];

            console.log(semaforo.sessao, sessao, 'acao:', acao);

            if (semaforo.sessao != sessao) {
                if (semaforo.automatico == 's') {
                    let data = new Date();
                    data.setMinutes(data.getMinutes() - 10);
                    console.log(semaforo.last_edit_at, ' <<<=== ', data);
                    if (semaforo.last_edit_at <= data) {
                        await this.finaliza(semaforo.id);
                        /*
                        usado para passar o id do semaforo para o novo item atualizando na tabela semaforoitem a coluna semaforoId
                        ao passar novamente por validaSemaforoItem, ele vai encontrar o semaforo e não vai criar um novo
                         */
                        let oldIdSemaforo = semaforo.id;
                        return this.validaSemaforoItem(sessao, acao, referencia, codReferencia, created_by, tipo, automatico, oldIdSemaforo);
                    }
                }

                return {status: 400, message: 'Já tem uma sessão ativa, você não pode acessar essa ação!'};
            } else {
                await this.update({id: semaforo.id})
                return {status: 200};
            }

        } catch (error: any) {
            handleError('Semaforo controller', 'validaSemaforoItem', error.message);
            throw new Error('[Controller] - GetOne Safra erro:' + error.message);
        }
    }

    /**
     * funcionamento:
     *
     * @param sessao chave da sessão quando o usuario abre uma tela
     * @param acao chave definindo a página ou local específico
     * @param created_by
     * @param tipo chave definindo se é front ou back, se front ele veio da page, se é back veio de um cron
     * @param automatico chave definindo se desativa automaticamente depois de 10 minutos
     */
    async validaSemaforo(sessao: string, acao: string, created_by: number = 0, tipo: string = 'front', automatico: string = 's'): Promise<any> {

        let response: object | any = await this.semaforoRepository.findAcao(acao);

        if (response.length <= 0) {
            let ret = await this.create({
                created_by,
                sessao,
                acao,
                tipo,
            })

            if (!ret || ret.status != 200) {
                return ret || {status: 400, message: 'Erro inesperado!'};
            }

            response = await this.semaforoRepository.findAcao(acao);
        }

        let semaforo = response[0];

        console.log(semaforo.sessao, sessao, 'acao:', acao);

        if (semaforo.sessao != sessao) {
            if (semaforo.automatico == 's') {
                let data = new Date();
                data.setMinutes(data.getMinutes() - 10);
                console.log(semaforo.last_edit_at, data);
                if (semaforo.last_edit_at <= data) {
                    await this.finaliza(semaforo.id)
                    return this.validaSemaforo(sessao, acao, created_by, tipo, automatico);
                }
            }

            return {status: 400, message: 'Já tem uma sessão ativa, você não pode acessar essa ação!'};
        } else {
            await this.update({id: semaforo.id})
            return {status: 200};
        }
    }

    espere(time: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('ok');
            }, time * 1000);
        });
    }

    async finalizaAcao(id: number, sessao: string) {
        // let sessaoValida = sessao + '-' + id; // deixa que somente um botao seja clicado por vez
        // let semaforo = await this.validaSemaforo(sessaoValida, 'page-semaforo-finalizaAcao');

        // if (semaforo.status != 200) {
        //   return semaforo;
        // }

        let response: object | any = await this.semaforoRepository.findById(id);
        console.log(response);
        // await this.espere(10);

        if (response) {
            await this.finaliza(response.id);
            // await this.finalizaRest(sessaoValida, 'page-semaforo-finalizaAcao');

            return {status: 200};
        } else {
            // await this.finalizaRest(sessaoValida, 'page-semaforo-finalizaAcao');

            return {status: 400, message: 'Sessão não encontrada'};
        }
    }

    async finalizaRest(sessao: string, acao: string) {
        let response: object | any = await this.semaforoRepository.find(sessao, acao);

        if (response.length > 0) {
            return this.finaliza(response[0].id);
        } else {
            return {status: 400, message: 'Sessão não encontrada'};
        }
    }

    async finalizaRestItem(sessao: string, acao: string, referencia?: string, codReferencia?: string) {
        let response: object | any = await this.semaforoRepository.find(sessao, acao);

        if (response.length > 0) {
            return this.finaliza(response[0].id);
        } else {
            return {status: 400, message: 'Sessão não encontrada'};
        }
    }

    finaliza(id: number, finaliza: boolean = true) {
        return this.update({id, finaliza});
    }

    async getAll(options: any) {
        const parameters: object | any = {};
        let take;
        let skip;
        let orderBy: object | any;
        let select: any = [];
        try {
            /*if (options.filterStatus) {
              if (options.filterStatus != 2) parameters.status = Number(options.filterStatus);
            }
      
            if (options.filterName) {
              parameters.name = JSON.parse(`{"contains":"${options.filterName}"}`);
            }
      
            if (options.filterLogin) {
              parameters.login = JSON.parse(`{"contains":"${options.filterLogin}"}`);
            }*/

            if (options.paramSelect) {
                const objSelect = options.paramSelect.split(',');
                Object.keys(objSelect).forEach((item) => {
                    select[objSelect[item]] = true;
                });
                select = {...select};
            } else {
                select = {
                    id: true,
                    created_at: true,
                    last_edit_at: true,
                    created_by: true,
                    sessao: true,
                    acao: true,
                    tipo: true,
                    status: true,
                };
            }

            if (options.id) {
                parameters.id = options.id;
            }

            if (options.take) {
                if (typeof (options.take) === 'string') {
                    take = Number(options.take);
                } else {
                    take = options.take;
                }
            }

            if (options.skip) {
                if (typeof (options.skip) === 'string') {
                    skip = Number(options.skip);
                } else {
                    skip = options.skip;
                }
            }

            orderBy = `{"last_edit_at":"desc"}`;

            /*if (options.orderBy) {
              orderBy = `{"${options.orderBy}":"${options.typeOrder}"}`;
            }*/

            const response: object | any = await this.semaforoRepository.findAll(
                parameters,
                select,
                take,
                skip,
                orderBy,
            );
            if (!response || response.total <= 0) {
                return {
                    status: 400, response: [], total: 0, message: 'nenhum resultado encontrado',
                };
            }
            return {status: 200, response, total: response.total};
        } catch (error: any) {
            handleError('Semaforo Controller', 'GetAll', error.message);
            throw new Error('[Controller] - GetAll Semaforo erro');
        }
    }

    async getOne(id: number) {
        try {
            const response = await this.semaforoRepository.findOne(id);
            if (!response) {
                return {status: 400, response: [], message: 'user não existe'};
            }
            return {status: 200, response};
        } catch (error: any) {
            handleError('Semaforo Controller', 'GetOne', error.message);
            throw new Error('[Controller] - GetOne Semaforo erro');
        }
    }

    async create(data: object | any) {
        try {
            const parameters: any = {};
            if (data !== null && data !== undefined) {

                if (!data.acao) return {status: 400, message: 'Informe a ação'};
                if (!data.sessao) return {status: 400, message: 'Informe a sessão'};
                // if (!data.created_by) return { status: 400, message: 'Informe a sessão' };
                if (!data.tipo) data.tipo = 'front';
                if (!data.automatico) data.automatico = 's';

                parameters.created_by = data.created_by;
                parameters.sessao = data.sessao; // chave gerada pelo sistema
                parameters.acao = data.acao; // chave de verificacao tipo -> usuario-safra-cultura
                parameters.tipo = data.tipo; // front/back
                parameters.status = 'andamento'; // andamento/finalizado
                parameters.automatico = data.automatico; // s/n

                const response = await this.semaforoRepository.create(parameters);

                if (response) {
                    return {status: 200, response: response, message: 'Semaforos inseridos'};
                }
                return {status: 400, response: null, message: 'houve um erro, tente novamente'};
            }
        } catch (error: any) {
            handleError('Semaforo Controller', 'Create', error.message);
            throw new Error('[Controller] - Create Semaforo erro');
        }
    }

    async update(data: object | any) {
        try {
            if (data !== null && data !== undefined) {
                const parameters: object | any = {};

                if (!!data.finaliza) {
                    parameters.status = 'finalizado';
                } else {
                    parameters.status = 'andamento';
                }

                const response: object | any = await this.semaforoRepository.update(data.id, parameters);

                if (response.count > 0) {
                    return {status: 200, message: {message: 'Semaforo atualizada'}};
                }
                return {status: 400, message: {message: 'Semaforo não existe'}};
            }
            return {status: 404, message: {message: 'Semaforo atualizada'}};
        } catch (error: any) {
            handleError('Semaforo Controller', 'Update', error.message);
            throw new Error('[Controller] - Update Semaforo erro');
        }
    }
}
