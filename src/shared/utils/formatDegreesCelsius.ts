export function saveDegreesCelsius(value: string): string {
  let degreesCelsius = value.replace("°", "");
  degreesCelsius = degreesCelsius.replace("'", "");
  degreesCelsius = degreesCelsius.replace(".", "");
  degreesCelsius = degreesCelsius.replace(`"`, "");

  return degreesCelsius;
}

export function getDegreesCelsius(value: string): string {
  value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/,
  function( regex, arg1: string, arg2: string, arg3: string, arg4: string) {
    value =`${arg1}°${arg2}'${arg3}.${arg4}"`;
    
    return value;
  });

  return value;
}
