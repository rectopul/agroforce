export function removeEspecialAndSpace(options: any) {
  Object.keys(options).map((item: any) => {
    options[item] = options[item].replace(/^\s+|\s+$/g, '');
  });
  return options;
}
