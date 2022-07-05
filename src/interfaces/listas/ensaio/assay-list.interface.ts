export interface IAssayList {
  id: number
  id_safra: number
  foco: { name: string }
  type_assay: { name: string }
  tecnologia: { name: string }
  gli: string
  period: number
  protocol_name: string
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
  filterFoco: string
  filterTypeAssay: string
  filterGli: string
  filterTechnology: string
  filterTreatmentNumber: string
  filterStatusAssay: string
  orderBy: string
  typeOrder: string
}
