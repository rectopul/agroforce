export default function handleError(file: string, local: string, error: any, details?: any) {
  console.error(new Date().toISOString(), `[${file}] ${local} error \n ${error}`, details);

  if (typeof window === 'undefined') {
    const newrelic = require('newrelic');
    newrelic.noticeError("handleError: " + error, details);
  } else {

  }

  console.trace("rastreio de pilha");
}

// crie um erro customizado para semaforo, precisa receber o status e reponse
// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
// https://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax-babel
// https://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax-babel
export class SemaforoError extends Error {
  private response: any = {};
  private error: any = {};
  private status: number = 500;

  constructor(message: string, response: any = null, status: number = 500, error: any = {}) {
    super(message);

    this.name = 'SemaforoError';

    this.response = response;
    this.error = error;
    this.status = status;
    
  }

  toString() {
    return `${this.name} [${this.status}]: ${this.message} - ${this.fullResponse(this.response)}`;
  }
  
  // função statica que retorna a condição em que o semáforo pode ser finalizado
  static isSemaforoErrorAuthorizeFinalized(error: any) {
    return !(error instanceof SemaforoError) || (error instanceof SemaforoError && error.status === 409);
  }

  // função que retorna o response object em string
  fullResponse(response: any) {
    return JSON.stringify(this.response);
  }

}