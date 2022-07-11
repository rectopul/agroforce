export default function handleOrderForeign(orderBy: any, orderType: any) {
  const orderColumn = (orderBy.split('.')[0]);
  const foreignColumn = (orderBy.split('.')[1]);
  switch (orderColumn) {
    case 'local':
      return `{ "${orderColumn}": {"${foreignColumn}": "${orderType}" } }`;
    case 'safra':
      return `{ "${orderColumn}": {"${foreignColumn}": "${orderType}" } }`;
    case 'foco':
      return `{ "${orderColumn}": {"${foreignColumn}": "${orderType}" } }`;
    case 'type_assay':
      return `{ "${orderColumn}": {"${foreignColumn}": "${orderType}" } }`;
    case 'tecnologia':
      return `{ "${orderColumn}": {"${foreignColumn}": "${orderType}" } }`;
    case 'localPreparo':
      return `{ "${orderColumn}": {"${foreignColumn}": "${orderType}" } }`;
    case 'genotipo':
      return `{ "${orderColumn}": {"${foreignColumn}": "${orderType}" } }`;
    case 'ensaio':
      return `{ "${orderColumn}": {"${foreignColumn}": "${orderType}" } }`;
    default:
      return undefined;
  }
}
