import { IExperiments } from '../experimento/experimento.interface';

export interface IAssayList {
  id: number
  id_safra: number
  foco: object | any
  type_assay: object | any
  tecnologia: object | any
  experiment: object | any
  gli: string
  bgm: number
  project: string
  status: string
  comments: string
}

export interface IGenotypeTreatment {
  id: number;
  id_safra: number;
  idAssayList: number;
  id_genotipo: number;
  id_lote: number;
  treatment_number: number;
  status: number;
  nca: number;
  comments: string;
}

export interface IGenotypeTreatmentGrid {
  allGenotypeTreatment: IGenotypeTreatment[];
  assayList: IAssayList;
  totalItens: number;
  idAssayList: number;
  idSafra: number | any
  itensPerPage: number;
  filterApplication: object | any;
  allExperiments: Array<IExperiments>
  totalExperiments: number
}

export interface IAssayListGrid {
  allAssay: IAssayList[];
  totalItems: number;
  filter: string
  itensPerPage: number
  filterApplication: string
  idCulture: number;
  idSafra: number;
  pageBeforeEdit: number
  filterBeforeEdit: string
}

export interface IAssayListFilter {
  filterCod: string | any
  filterTratFrom: string | any
  filterTratTo: string | any
  filterFoco: string
  filterTypeAssay: string
  filterGli: string
  filterTechnology: string
  filterTreatmentNumber: string
  filterStatusAssay: string
  orderBy: string
  typeOrder: string
}
