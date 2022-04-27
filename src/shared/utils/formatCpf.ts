export function saveCPF(value: string): string {
  let cpf = value.replace(".", "");
  cpf = cpf.replace(".", "");
  cpf = cpf.replace("-", "");

  return cpf;
}

export function getCPF(value: string): string {
  value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,
  function( regex, arg1: string, arg2: string, arg3: string, arg4: string) {
    value =`${arg1}.${arg2}.${arg3}-${arg4}`;
    
    return value;
  });

  return value;
}
