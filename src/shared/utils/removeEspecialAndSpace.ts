export function removeEspecialAndSpace(options: any) {
  Object.keys(options).map((item: any) => {
    if (item.includes('filter')) {
      console.log(options[item]);
    }
  });

  return options;
}
