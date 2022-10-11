/* eslint-disable no-return-assign */
const CryptoJS = require("crypto");

const alg = "aes-256-ctr";
const pwd = "TMG2022";

function validationCPF(cpf: any) {
  const newCpf = cpf.replace(/[^\d]+/g, "");
  if (newCpf === "") return false;
  // Elimina CPFs invalidos conhecidos
  if (
    newCpf.length !== 11 ||
    newCpf === "00000000000" ||
    newCpf === "11111111111" ||
    newCpf === "22222222222" ||
    newCpf === "33333333333" ||
    newCpf === "44444444444" ||
    newCpf === "55555555555" ||
    newCpf === "66666666666" ||
    newCpf === "77777777777" ||
    newCpf === "88888888888" ||
    newCpf === "99999999999"
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
  if (type === "cipher") {
    const cipher: any = CryptoJS.createCipher(alg, pwd);
    const newData = cipher.update(data, "utf8", "hex");
    return newData;
  }
  if (type === "decipher") {
    const decipher = CryptoJS.createDecipher(alg, pwd);
    const newData = decipher.update(data, "hex", "utf8");
    return newData;
  }
}

function countChildrenForSafra(dataChildren: [], safraId: number = 0) {
  let countChildren: number = 0;
  if (safraId !== 0) {
    dataChildren.map((item: any) =>
      Number(item.id_safra) === safraId ? (countChildren += 1) : ""
    );
  }
  return countChildren;
}

function formatDate(data: any) {
  const dia = data.getDate().toString();
  const diaF = dia.length === 1 ? `0${dia}` : dia;
  const mes = (data.getMonth() + 1).toString(); // +1 pois no getMonth Janeiro começa com zero.
  const mesF = mes.length === 1 ? `0${mes}` : mes;
  const anoF = data.getFullYear();
  const hour = data.getHours();
  const min =
    data.getMinutes() < 10 ? `0${data.getMinutes()}` : data.getMinutes();
  return `${diaF}/${mesF}/${anoF} ${hour}:${min}`;
}

function getFileExtension(filename: string) {
  return filename?.slice(((filename?.lastIndexOf(".") - 1) >>> 0) + 2);
}

export const functionsUtils = {
  validationCPF,
  Crypto,
  countChildrenForSafra,
  formatDate,
  getFileExtension,
};
