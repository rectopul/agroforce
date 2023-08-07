import moment from 'moment';

//const moment = require('moment');

export function convertSerialDateToJSDate(serial: number): Date {
  // Excel armazena as datas como número de dias a partir de "1899-12-30" (não 1900-01-01)
  // Nesse dia, o valor seria zero
  const startEpoch = new Date(Date.UTC(1899, 11, 30));

  // Calcular os dias completos e a fração do dia
  const days = Math.floor(serial);
  const dayFraction = serial - days;

  // Calcular o número de milissegundos para a parte do dia e os dias totais
  const millisecondsInADay = 24 * 60 * 60 * 1000;
  const dayMilliseconds = dayFraction * millisecondsInADay;

  // Adicionar os dias e a fração do dia aos milissegundos iniciais
  const totalMilliseconds = startEpoch.getTime() + (days * millisecondsInADay) + dayMilliseconds;

  // // Converter de volta para a data
  // const dateObj = new Date(totalMilliseconds);
  //
  // const mm = moment(dateObj);
  
  return new Date(totalMilliseconds);
}

export function calcularData(data: number, precise: boolean = true) {
  return moment(convertSerialDateToJSDate(data));
}

// Função para converter um objeto Date em uma string datetime SQL UTC
export function convertDateToSQLDatetimeUTC(dateEpochSerial:number): string {
  const dateJs = convertSerialDateToJSDate(dateEpochSerial);
  return moment.utc(dateJs).format('YYYY-MM-DD HH:mm:ss.SSS');
}

// Função para converter um objeto Date em uma string datetime SQL
export function convertDateToSQLDatetime(date: Date, formatoUtc:boolean = false): string {
  if(formatoUtc){
    return moment.utc(date).format('YYYY-MM-DD HH:mm:ss.SSS');
  } else {
    // O formato 'YYYY-MM-DD HH:mm:ss.SSS' corresponde ao formato datetime(3) do SQL
    return moment(date).format('YYYY-MM-DD HH:mm:ss.SSS');
  }
}

// Função para converter o número de dias com parte decimal em uma string de timestamp no formato desejado
export function converterParaDataBanco(data: number) {
  // Chama a função auxiliar para calcular a data e formata no formato desejado
  return calcularData(data).format("YYYY-MM-DD HH:mm:ss");
}

export function convertDateToExcelFormat(date: Date): string {
  // O formato 'DD/MM/YYYY HH:mm:ss' corresponde ao formato de data do Excel
  return moment.utc(date).format('DD/MM/YYYY HH:mm:ss');
}

// Função para validar se uma data fornecida é válida
export function validarData(data: string): boolean {
  // Utiliza a biblioteca moment.js para verificar se a data é válida
  return moment(data).isValid();
}

// Função para converter o número de dias com parte decimal em um timestamp em milissegundos
export function converterParaTimestamp(data: number) {
  // Chama a função auxiliar para calcular a data
  return convertSerialDateToJSDate(data).valueOf();
}

// Função para converter o número de dias com parte decimal em um timestamp no formato ISO 8601 CUIDADO AQUI ADICIONA + 3 HORAS
export function converterParaTimestampISO(data: number) {
  // Chama a função auxiliar para calcular a data e retorna a representação ISO 8601
  return calcularData(data).toISOString();
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

function calcularDataOld(data: number, precise: boolean = true) {
  // Separa a parte inteira (dias) e a parte decimal (hora, minutos e segundos)
  const [dias, decimal] = data.toString().split('.');
  // Converte a parte inteira para número de dias
  const numDias = parseFloat(dias);

  if(precise) {
    // Converte a parte decimal para milissegundos
    const milissegundos = Math.round(parseFloat(`0.${decimal}`) * 86400000);
    // Adiciona o número de dias e segundos à data de referência (epoch)
    return moment("1900-01-01").add(numDias, 'days').add(milissegundos, 'milliseconds');
  }
  else {
    // Converte a parte decimal para segundos
    const segundos = Math.round(parseFloat(`0.${decimal}`) * 86400000);
    // Adiciona o número de dias e segundos à data de referência (epoch)
    return moment("1900-01-01").add(numDias, 'days').add(segundos, 'seconds');
  }

}
