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

export function validateProtocolLevel(data: any) {
  const newData = data;
  const protocolLevel = data[1][0];
  const message: Array<String> = newData.map((item: any, index: number) => {
    if (item[0] !== protocolLevel && index !== 0) {
      return `<li style="text-align:left"> A ${index}ª linha esta incorreta, o protocol level tem que ser igual em toda planilha. </li> <br>`;
    }
  });
  const responseStringError = message.join('').replace(/undefined/g, '');

  return responseStringError;
}
