import { IExperiments } from '../../experimento/experimento.interface';

export interface IExperimentsGroup {
  id :number
  name :string
  experimentAmount:number
  tagsToPrint :number
  tagsPrinted :number
  totalTags :number
  status :string
  experiment: Array<IExperiments>
}

export interface IExperimentGroupFilter {
  filterExperimentGroup: string,
  filterQuantityExperiment: string,
  filterTagsToPrint: string,
  filterTagsPrinted: string,
  filterTotalTags: string,
  filterStatus: string,
  filterQtdExpFrom: string,
  filterQtdExpTo: string,
  filterTotalEtiqImprimirFrom: string,
  filterTotalEtiqImprimirTo: string,
  filterTotalEtiqImpressasFrom: string,
  filterTotalEtiqImpressasTo: string,
  filterTotalEtiqFrom: string,
  filterTotalEtiqTo: string,
}
