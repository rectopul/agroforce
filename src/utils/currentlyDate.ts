export function currentlyDate(): string {
  let date = new Date();
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();
  let currentlyDate = `${day}/${month}/${year}`;

  return currentlyDate;
}

export function currentlyMonthYear(): string {
  let date = new Date();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();
  let currentlyMonthYear = `${month}/${year}`;

  return currentlyMonthYear;
}
