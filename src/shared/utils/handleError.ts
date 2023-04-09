export default function handleError(file: string, local: string, error: any, details?:any ) {
  console.error(new Date().toISOString(), `[${file}] ${local} error \n ${error}`, details);
  const newrelic = require('newrelic');
  newrelic.noticeError("handleError: "+error, details);
  console.trace("rastreio de pilha");
}