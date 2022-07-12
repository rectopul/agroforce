export interface IExperiments {
  id: number
  density: number
  period: number
  repetitionsNumber: number
  nlp: number
  clp: number
  eel: number
  experimentName: string
  comments: string
  orderDraw: string
  status: string
  assay_list: Array<any>
  local: Array<any>
  delineamento: Array<any>
}
