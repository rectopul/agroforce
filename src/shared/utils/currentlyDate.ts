export function getCurrentlyDate(): string {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const currentlyDate = `${day}/${month}/${year}`;

  return currentlyDate;
}

export function getCurrentlyMonthYear(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const currentlyMonthYear = `${month}/${year}`;

  return currentlyMonthYear;
}
