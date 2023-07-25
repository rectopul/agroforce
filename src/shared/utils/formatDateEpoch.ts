import moment from 'moment';

//const moment = require('moment');

function calcularData(data: number, precise: boolean = true) {
  // Separa a parte inteira (dias) e a parte decimal (hora, minutos e segundos)
  const [dias, decimal] = data.toString().split('.');
  
  // Converte a parte inteira para número de dias
  const numDias = parseFloat(dias);
  
  if(precise) {
    // Converte a parte decimal para milissegundos
    const milissegundos = Math.round(parseFloat(`0.${decimal}`) * 86400000);
    
    // Adiciona o número de dias e segundos à data de referência (epoch)
    return moment("1900-01-01").add(numDias, 'days').add(milissegundos, 'milliseconds');
    
  } else {
    // Converte a parte decimal para segundos
    const segundos = Math.round(parseFloat(`0.${decimal}`) * 86400000);
    
    // Adiciona o número de dias e segundos à data de referência (epoch)
    return moment("1900-01-01").add(numDias, 'days').add(segundos, 'seconds');
  }
  
}

// Função para validar se uma data fornecida é válida
export function validarData(data: string): boolean {
  // Utiliza a biblioteca moment.js para verificar se a data é válida
  return moment(data).isValid();
}

// Função para converter o número de dias com parte decimal em um timestamp em milissegundos
export function converterParaTimestamp(data: number) {
  // Chama a função auxiliar para calcular a data
  return calcularData(data).valueOf();
}

// Função para converter o número de dias com parte decimal em um timestamp no formato ISO 8601
export function converterParaTimestampISO(data: number) {
  // Chama a função auxiliar para calcular a data e retorna a representação ISO 8601
  return calcularData(data).toISOString();
}

// Função para converter o número de dias com parte decimal em uma string de timestamp no formato desejado
export function converterParaDataBanco(data: number) {
  // Chama a função auxiliar para calcular a data e formata no formato desejado
  return calcularData(data).format("YYYY-MM-DD HH:mm:ss");
}

export function converterEpochToDate(dataEpoch: number, precise:boolean = false): Date {
  // Chama a função auxiliar para calcular a data e formata no formato desejado
  return calcularData(dataEpoch, precise).toDate();
}

// Função para converter um objeto Date para a representação numérica inicial
export function converterDateParaNumeroInicial(date: Date): number {
  // Cria um objeto moment com a data fornecida
  const minhaData = moment(date);

  // Cria um objeto moment com a data de referência (1900-01-01)
  const dataReferencia = moment("1900-01-01");

  // Calcula a diferença entre as datas em milissegundos
  const diferencaEmMilissegundos = minhaData.diff(dataReferencia, 'milliseconds', true);
  console.log('diferencaEmMilissegundos', diferencaEmMilissegundos);
  // Converte a diferença em milissegundos para a representação numérica inicial
  const numeroInicial = diferencaEmMilissegundos / 86400000; // 86400000 milissegundos em um dia

  // Retorna a representação numérica inicial
  return numeroInicial;
}


// Função para converter um objeto Date para a representação numérica inicial
export function converterDateParaNumeroInicialImpreciso(date: Date): number {
  // Cria um objeto moment com a data fornecida
  const minhaData = moment(date);

  // Cria um objeto moment com a data de referência (1900-01-01)
  const dataReferencia = moment("1900-01-01");

  // Calcula a diferença entre as datas em milissegundos
  const diferencaEmMilissegundos = minhaData.diff(dataReferencia);
  console.log('diferencaEmMilissegundos', diferencaEmMilissegundos);
  // Converte a diferença em milissegundos para a representação numérica inicial
  const numeroInicial = diferencaEmMilissegundos / 86400000; // 86400000 milissegundos em um dia

  // Retorna a representação numérica inicial
  return numeroInicial;
}
