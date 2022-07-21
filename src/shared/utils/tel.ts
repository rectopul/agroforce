export function handleFormatTel(tel: string): string {
  const handleTel = tel.replace(
    /(\d{2})(\d{5})(\d{4})/,
    (regex, arg1, arg2, arg3) => {
      const newTel = `(${arg1}) ${arg2}-${arg3}`;
      return newTel;
    },
  );

  return handleTel;
}
