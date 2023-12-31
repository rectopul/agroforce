export interface IReturnObject {
  status: number
  response?: Array<any> | any
  message?: string | unknown
  total?: number | any
}

export interface ImportValidate {
  idLog?: number
  spreadSheet: Array<any>
  idSafra: number
  idCulture: number
  created_by: number
}

export interface ImportValidateWithSession extends ImportValidate {
  sessao: string
}
