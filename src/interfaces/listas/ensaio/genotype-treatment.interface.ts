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
  allTreatments : ITreatment[],
  assaySelect : Array<Object>,
  genotypeSelect :Array<Object>,
  totalItems :number|any,
  itensPerPage :number |any,
  filterApplication :object |any,
  idCulture :number |any,
  idSafra :number |any,
  pageBeforeEdit : object |any,
  filterBeforeEdit :object |any,
  orderByserver:number |any,
  typeOrderServer : number |any,
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
  filterNcaFrom: string
  filterNcaTo: string
  orderBy: string
  typeOrder: string
  filterBgmTo: string
  filterBgmFrom: string
  filterNtTo: string
  filterNtFrom: string
  filterStatusT: string
  filterGgenCod: string
  filterGgenName: string
  filterBgmGenotypeTo: string
  filterBgmGenotypeFrom: string
  filterGmrTo: string
  filterGmrFrom: string
}
