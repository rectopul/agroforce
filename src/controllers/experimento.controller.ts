import { ExperimentoRepository } from 'src/repository/experimento.repository';

// type Updategenotipo = Omit<genotipo, 'created_by'>;
export class ExperimentoController {
  public readonly required = 'Campo obrigatório';

  repository = new ExperimentoRepository();

  async getAll(options: any) {
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
      } else {
        parameters.status = 1;
      }

      if (options.filterGenotipo) {
        options.filterGenotipo = '{"contains":"' + options.filterGenotipo + '"}';
        parameters.name_genotipo = JSON.parse(options.filterGenotipo);
      }

      if (options.filterCruza) {
        let temp = options.filterCruza.split(' ');
        temp = temp[1] ? `${temp[0]}+${temp[1]}` : temp[0];
        options.filterCruza = temp;
        options.filterCruza = '{"contains":"' + options.filterCruza + '"}';
        parameters.cruza = JSON.parse(options.filterCruza);
      }

      if (options.paramSelect) {
        const objSelect = options.paramSelect.split(',');
        Object.keys(objSelect).forEach((item) => {
          if (objSelect[item] === 'tecnologia') {
            select[objSelect[item]] = true;
          } else {
            select[objSelect[item]] = true;
          }
        });
        select = Object.assign({}, select);
      } else {
        select = { 
             id: true,
             id_s1: true,
             id_dados: true,
             id_tecnologia: true,
             name_main: true,
             name_public: true,
             name_experiment: true,
             name_alter : true,
             elit_name  : true,
             type: true,
             gmr : true,
             bgm : true,
             cruza: true,
             progenitor_f_direto: true,
             progenitor_m_direto: true,
             progenitor_f_origem: true,
             progenitor_m_origem: true,
             progenitores_origem: true,
             parentesco_completo: true,
             status: true,
             tecnologia: { select: { name: true, cod_tec: true} } };
      }
      
      if (options.id_culture) {
        parameters.id_culture = parseInt(options.id_culture);
      }

      if (options.id_dados) {
        parameters.id_dados = String(options.id_dados);
      }

      if (options.cruza) {
        parameters.cruza = options.cruza;
      }

      if (options.genealogy) {
        parameters.genealogy = options.genealogy;
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

      const response: object | any = await this.repository.findAll(
        parameters,
        select,
        take,
        skip,
        orderBy
      );

      if (!response && response.total <= 0) {
        return { status: 400, response: [], total: 0, message: 'nenhum resultado encontrado' };
      } else {
        return { status: 200, response, total: response.total };
      }
    } catch (err) {
      console.log(err);
      return { status: 400, response: [], total: 0 };
    }
  }

  async getOne(id: number) {
    try {
      if (!id) throw new Error('Dados inválidos');

      const response = await this.repository.findOne(id);

      if (!response) throw new Error('Item não encontrado');

      return { status: 200, response };
    } catch (err) {
      return { status: 400, message: err };
    }
  }

  async create(data: any) {
    try {
      const response = await this.repository.create(data);
      return { status: 201, message: 'Genealogia cadastrada', response };
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'Erro no cadastrado' };
    }
  }

  async update(data: any) {
    try {

      const experimento: any = await this.repository.findOne(data.id);

      if (!experimento) return { status: 400, message: 'Genótipo não encontrado' };

      await this.repository.update(experimento.id, data);

      return { status: 200, message: 'Genótipo atualizado' };
    } catch (err) {
      console.log(err);
      return { status: 404, message: 'Erro ao atualizar' };
    }
  }
}
