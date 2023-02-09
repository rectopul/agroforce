/* eslint-disable no-return-assign */
const CryptoJS = require('crypto');

const alg = 'aes-256-ctr';
const pwd = 'TMG2022';

function validationCPF(cpf: any) {
  const newCpf = cpf.replace(/[^\d]+/g, '');
  if (newCpf === '') return false;
  // Elimina CPFs invalidos conhecidos
  if (
    newCpf.length !== 11
    || newCpf === '00000000000'
    || newCpf === '11111111111'
    || newCpf === '22222222222'
    || newCpf === '33333333333'
    || newCpf === '44444444444'
    || newCpf === '55555555555'
    || newCpf === '66666666666'
    || newCpf === '77777777777'
    || newCpf === '88888888888'
    || newCpf === '99999999999'
  ) {
    return false;
  }
  // Valida 1o digito
  let add = 0;
  for (let i = 0; i < 9; i += 1) {
    add += Number(newCpf.charAt(i)) * (10 - i);
  }
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== Number(newCpf.charAt(9))) {
    return false;
  }
  // Valida 2o digito
  add = 0;
  for (let i = 0; i < 10; i += 1) {
    add += Number(newCpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) {
    rev = 0;
  }
  if (rev !== Number(newCpf.charAt(10))) {
    return false;
  }
  return true;
}

function Crypto(data: any, type: any) {
  if (type === 'cipher') {
    const cipher: any = CryptoJS.createCipher(alg, pwd);
    const newData = cipher.update(data, 'utf8', 'hex');
    return newData;
  }
  if (type === 'decipher') {
    const decipher = CryptoJS.createDecipher(alg, pwd);
    const newData = decipher.update(data, 'hex', 'utf8');
    return newData;
  }
}

function countChildrenForSafra(dataChildren: [], safraId: number = 0) {
  let countChildren: number = 0;
  if (safraId !== 0) {
    dataChildren.map((item: any) => (Number(item.id_safra) === safraId ? (countChildren += 1) : ''));
  }
  return countChildren;
}

function formatDate(data: any) {
  if( data ){
    const dia = data && data.getDate().toString();
    const diaF = dia &&  dia.length === 1 ? `0${dia}` : dia;
    const mes = data &&  (data.getMonth() + 1).toString(); // +1 pois no getMonth Janeiro começa com zero.
    const mesF = mes && mes.length === 1 ? `0${mes}` : mes;
    const anoF = data && data.getFullYear();
    const hour = data && data.getHours();
    const min = data && data.getMinutes() < 10 ? `0${ data && data.getMinutes()}` : data && data.getMinutes();
    return `${diaF}/${mesF}/${anoF} ${hour}:${min}`;
  }else{
    return `null`;
  }
}

function getFileExtension(filename: string) {
  return filename?.slice(((filename?.lastIndexOf('.') - 1) >>> 0) + 2);
}

function isNumeric(value: any) {
  if (String(value)?.length > 0) {
    const regex = /^[0-9]+$/;
    return regex.test(value);
  }
  return true;
}

function generateDigitEAN13(code: any) {
  let sum = 0;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(code[i]) * (i % 2 == 0 ? 1 : 3);
  }
  return (10 - (sum % 10)) % 10;
}

function generateDigitEAN8(code: any) {
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 6; i >= 0; i--) {
    if (i % 2 != 0) {
      sum1 += parseInt(code[i]);
    } else {
      sum2 += parseInt(code[i]);
    }
  }
  sum2 = sum2 * 3;

  let sum = sum1 + sum2;
  let checkSum = 10 - (sum % 10);
  if (checkSum == 10) checkSum = 0;

  return checkSum;
}

export const functionsUtils = {
  validationCPF,
  Crypto,
  countChildrenForSafra,
  formatDate,
  getFileExtension,
  isNumeric,
  generateDigitEAN13,
  generateDigitEAN8,
};
