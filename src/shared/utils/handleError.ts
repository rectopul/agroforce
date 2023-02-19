export default function handleError(file: string, local: string, error: any) {
  console.error(new Date().toISOString(), `[${file}] ${local} error \n ${error}`);
  console.trace("rastreio de pilha");
}
~[]