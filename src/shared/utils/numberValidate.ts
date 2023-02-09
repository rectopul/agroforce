export function validateInteger(value: number): boolean {
  if (typeof value !== 'number'
      || Number(value) <= 0
      || !Number.isInteger(Number(value))) {
    return false;
  }
  return true;
}

export function validateDouble(value: any): boolean {
  if (parseInt(value, 10) !== value) {
    return true;
  }
  return false;
}

export function validateDecimal(value: any): boolean {
  const regex = /^\d+\.\d{0,5}$/;
  return (regex.test(value));
}
