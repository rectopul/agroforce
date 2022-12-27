export function removeEspecialAndSpace(options: any) {
  Object.keys(options).map((item: any) => {
    if (typeof options[item] === 'string') {
      options[item] = options[item].replace(/^\s+|\s+$/g, '');
    }
  });
  return options;
}
