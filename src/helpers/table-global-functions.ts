import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
} from 'react-icons/ai';

// For global pagination
async function handlePaginationGlobal(currentPages: any, take: any, filter: any) {
  if (localStorage.getItem('filterValueEdit')) {
    filter = localStorage.getItem('filterValueEdit');
  } else {
    filter = filter;
  }

  // if(localStorage.getItem('orderSorting')){
  //   filter = localStorage.getItem('orderSorting');
  // }

  if (localStorage.getItem('pageBeforeEdit')) {
    currentPages = Number(localStorage.getItem('pageBeforeEdit'));
  } else {
    currentPages = currentPages;
  }

  const skip = currentPages * Number(take);
  let parametersFilter = `skip=${skip}&take=${take}`;

  if (filter) {
    parametersFilter = `${parametersFilter}&${filter}`;
  }

  return { parametersFilter, currentPages };
}

// Total pages global function
function handleTotalGlobal(currentPage: any, pages: any) {
  let value = 0;
  if (currentPage < 0) {
    value = 0;
  } else if (currentPage >= pages) {
    value = pages - 1;
  }

  return value;
}

// Manage filter parameters
async function handleFilterParameter(...theArgs: any) {
  let parametersFilter;

  const [key] = theArgs;

  switch (key) {
    case 'parcelas':
      parametersFilter = await parcelas(theArgs);
      break;

    default:
      parametersFilter = '';
  }

  return parametersFilter;
}

function parcelas(theArgs: any) {
  const [
    key,
    filterFoco,
    filterTypeAssay,
    filterNameTec,
    filterCodTec,
    filterGli,
    filterExperimentName,
    filterLocal,
    filterRepetitionFrom,
    filterRepetitionTo,
    filterStatus,
    filterNtFrom,
    filterNtTo,
    filterNpeFrom,
    filterNpeTo,
    filterGenotypeName,
    filterNca,
    idSafra,
  ] = theArgs;

  const parametersFilter = `filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterNameTec=${filterNameTec}&filterCodTec=${filterCodTec}&filterGli=${filterGli}&filterExperimentName=${filterExperimentName}&filterLocal=${filterLocal}&filterRepetitionFrom=${filterRepetitionFrom}&filterRepetitionTo=${filterRepetitionTo}&filterNtFrom=${filterNtFrom}&filterNtTo=${filterNtTo}&filterNpeFrom=${filterNpeFrom}&filterNpeTo=${filterNpeTo}&idSafra=${idSafra}&filterGenotypeName=${filterGenotypeName}&filterNca=${filterNca}&filterStatus=${filterStatus}`;

  return parametersFilter;
}

// Handle orders global
function handleOrderGlobal(
  column: any,
  order: any,
  filter: any,
  from: any,
) {
  let typeOrder: any;
  let parametersFilter: any;
  if (order === 1) {
    typeOrder = 'asc';
  } else if (order === 2) {
    typeOrder = 'desc';
  } else {
    typeOrder = '';
  }

  if (filter && typeof filter !== 'undefined') {
    if (typeOrder !== '') {
      parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
    } else {
      parametersFilter = filter;
    }
  } else if (typeOrder !== '') {
    parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}`;
  } else {
    parametersFilter = filter;
  }

  if (from == 'safra' || from == 'setor') {
    // Remove extra values here
    parametersFilter = removeExtraValues(parametersFilter, from, '&orderBy');
    // parametersFilter;
  }
  if (from == 'genotipo') {
    // Remove extra values here
    parametersFilter = removeExtraValues(parametersFilter, from, '&id_culture');
    // return parametersFilter;
  }

  // return skip(currentPages , parametersFilter);

  return parametersFilter;
}

function skip(currentPages : any, filter: any) {
  const take = 10;
  const skip = currentPages * Number(take);
  let parametersFilter = `skip=${skip}&take=${take}`;

  if (filter) {
    parametersFilter = `${parametersFilter}&${filter}`;
  }

  return parametersFilter;
}

function removeExtraValues(parametersFilter: any, from: any, remove: any) {
  const myArray = parametersFilter.split(remove);

  if (myArray.length > 2) {
    parametersFilter = '';
    parametersFilter = myArray[0] + remove + myArray[2];
  }

  return parametersFilter;
}

// Get value from Url.
function getValuesForFilter(ParameterString: any, filtersParams :any) {
  let c;
  if (filtersParams) {
    const convert = filtersParams;
    const url_string = `http://www.example.com/t.html?${convert}`;
    const url = new URL(url_string);
    c = url.searchParams.get(ParameterString)?.toString();
  }

  c = c == undefined ? '' : c;

  return c;
}

async function handleOrderG(columnG:any, orderG :any, orderListG:any) {
  let typeOrderG: any;
  let orderByG: any; // RR
  let arrowOrder : any;

  if (orderG == 1) {
    typeOrderG = 'asc';
  } else {
    typeOrderG = 'desc';
  }

  if (orderListG === 2) {
    orderByG = 0;
    arrowOrder = AiOutlineArrowDown;
  } else {
    orderByG = orderListG + 1;
    if (orderListG === 1) {
      arrowOrder = AiOutlineArrowUp;
    } else {
      arrowOrder = AiOutlineArrowDown;
    }
  }
  return {
    typeOrderG, columnG, orderByG, arrowOrder,
  };
}

// helper functions
export const tableGlobalFunctions = {
  handlePaginationGlobal,
  handleTotalGlobal,
  handleFilterParameter,
  handleOrderGlobal,
  skip,
  getValuesForFilter,
  handleOrderG,
};
