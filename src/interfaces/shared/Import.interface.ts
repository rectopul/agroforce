export interface IReturnObject {
  status: number
  response?: Array<any> | any
  message?: string | unknown
  total?: number
}

export interface ImportValidate {
  spreadSheet: Array<any>
  idSafra: number
  idCulture: number
  created_by: number
}
