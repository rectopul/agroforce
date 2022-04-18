export const AZ = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];


function toLetter(columnNumber: any) {

  let letras = "ABCDEFGHIJKLMNOPQRSTUVXWYZ";

  let columnName = "";

  while (columnNumber > 0) {
    let rem = columnNumber % 26;

    if (rem == 0) {
      columnName = "Z" + columnName;
      columnNumber = Math.floor(columnNumber / 26) - 1;
    } else {
      columnName = letras.charAt(rem - 1) + columnName;
      columnNumber = Math.floor(columnNumber / 26);
    }
  }
  return columnName;
}