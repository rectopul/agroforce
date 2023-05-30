export default function handleError(file: string, local: string, error: any, details?:any ) {
  console.error(new Date().toISOString(), `[${file}] ${local} error \n ${error}`, details);

  if (typeof window === 'undefined') {
    const newrelic = require('newrelic');
    newrelic.noticeError("handleError: "+error, details);
  } else {
    
  }
  
  console.trace("rastreio de pilha");
}