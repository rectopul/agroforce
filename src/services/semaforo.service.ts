import getConfig from 'next/config';
import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/semaforo`;
const semaforoSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('semaforo') as string));

export const semaforoService = {
  semaforo: semaforoSubject.asObservable(),
  get semaforoValue() { return semaforoSubject.value; },
  getAll,
  update,
  verifica,
  finaliza,
  finalizaAcao,
};

function getAll(parameters: any) {
  return fetchWrapper.get(baseUrl, parameters);
}

function update(data: any) {
  return fetchWrapper.put(baseUrl, data);
}

function verifica(sessao: string, acao: string, user: number = 0, tipo: string = 'front', automatico: string = 's') {
  return fetchWrapper.get(baseUrl + '/verifica', {
    sessao,
    acao,
    user,
    tipo,
    automatico,
  });
}

function finaliza(sessao: string, acao: string) {
  return fetchWrapper.post(baseUrl + '/verifica', {
    sessao,
    acao,
  });
}

function finalizaAcao(id: number, sessao: string) {
  return fetchWrapper.deleted(baseUrl + '/verifica', {
    id,
    sessao
  });
}