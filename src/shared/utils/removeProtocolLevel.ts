export function removeProtocolLevel(data: any) {
  const newData = data;
  const newSpreadSheet = newData.spreadSheet.map((item: any) => {
    const newItem = item;
    newItem.shift();
    return newItem;
  });
  newData.spreadSheet = newSpreadSheet;
  return newData;
}
