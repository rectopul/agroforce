export interface ITreatment {
  id: number;
  id_safra: number;
  idAssayList: number;
  genotipo: any;
  id_lote: number;
  treatment_number: number;
  status: number;
  nca: number;
  comments: string;
}

export interface ITreatmentGrid {
  allTreatments: ITreatment[];
  assaySelect: Array<Object>;
  genotypeSelect: Array<Object>;
  totalItems: number;
  idAssayList: number;
  idSafra: number | any
  itensPerPage: number;
  filterApplication: object | any;
  pageBeforeEdit: number
  filterBeforeEdit: string

}

export interface ITreatmentFilter {
  filterFoco: string
  filterTypeAssay: string
  filterTechnology: string
  filterGli: string
  filterBgm: string
  filterTreatmentsNumber: string
  filterStatus: string
  filterCodTec: string
  filterStatusAssay: string
  filterGenotypeName: string
  filterNca: string
  orderBy: string
  typeOrder: string
  filterBgmTo: string
  filterBgmFrom: string
  filterNtTo: string
  filterNtFrom: string
  filterStatusT: string
}
