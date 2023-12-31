export function responseNullFactory(
  column: number,
  row: string,
  header: string,
) {
  return `<li style="text-align:left"> A ${column}º coluna da ${row}º linha está incorreta, o campo ${header} é obrigatório. </li> <br>`;
}

export function responseDiffFactory(
  column: number,
  row: string,
  header: string,
) {
  return `<li style="text-align:left"> A ${column}º coluna da ${row}º linha está incorreta, o campo ${header} é diferente do relacionado ao ensaio. </li> <br>`;
}

export function responsePositiveNumericFactory(
  column: number,
  row: string,
  header: string,
) {
  return `<li style="text-align:left"> A ${column}º coluna da ${row}º linha está incorreta, o campo ${header} deve ser numérico e positivo. </li> <br>`;
}

export function responseDoesNotExist(
  column: number,
  row: string,
  header: string,
) {
  return `<li style="text-align:left"> A ${column}º coluna da ${row}º linha está incorreta, o campo ${header} não existe no sistema. </li> <br>`;
}

export function responseGenericFactory(
  column: number,
  row: string,
  header: string,
  message: string,
) {
  return `<li style="text-align:left"> A ${column}º coluna da ${row}º linha está incorreta, o campo ${header} ${message}. </li> <br>`;
}

export function responseCompositeKeysFactory(
    column: number,
    row: string,
    message: string,
) {
  return `<li style="text-align:left"> A ${column}º coluna da ${row}º linha está incorreta, ${message}. </li> <br>`;
}