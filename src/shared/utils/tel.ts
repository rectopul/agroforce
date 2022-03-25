export function handleFormatTel(tel: string): string {
  let handleTel = tel.replace(/(\d{2})(\d{5})(\d{4})/,
  function( regex, arg1, arg2, arg3) {
    tel =`(${arg1}) ${arg2}-${arg3}`;
    return tel;
  });

  return tel;
}
