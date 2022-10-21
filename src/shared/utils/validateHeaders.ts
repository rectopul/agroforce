/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
export async function validateHeaders(spreadSheet: any, headers: any) {
  const message: any = [];
  for (const index in headers) {
    if (String(headers[index]).toLocaleUpperCase()
    !== String(spreadSheet[0][index]).toLocaleUpperCase()) {
      message[index] += `<li style="text-align:left"> A ${index}ª coluna esta incorreta, o campo é ${spreadSheet[0][index]} mas deveria ser ${headers[index]}. </li> <br>`;
    }
  }
  const responseStringError = message.join('').replace(/undefined/g, '');

  return responseStringError;
}
