export interface IReturnObject {
  status: number
  message?: string
}

export interface ImportValidate {
  idLog: number
  spreadSheet: Array<any>
  idSafra: number
  idCulture: number
  createdBy: number
}
