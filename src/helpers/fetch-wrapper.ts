import getConfig from 'next/config';

import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from 'react-icons/ai';
import { userService } from '../services';

const { publicRuntimeConfig } = getConfig();

function handleResponse(response: string | any) {
  return response.text().then((text: string) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].includes(response.status) && userService.userValue) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        userService.logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}

function authHeader(url: string | any) {
  // return auth header with jwt if user is logged in and request is to the api url
  const user = userService.userValue;
  const isLoggedIn = user && user.token;
  const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
}

async function get(url: any, params: any) {
  const urlParameters: any = new URL(url);
  urlParameters.search = new URLSearchParams(params).toString();
  const requestOptions: any = {
    method: 'GET',
    credentials: 'include',
    headers: authHeader(url),
  };
  const response = await fetch(urlParameters, requestOptions);
  return handleResponse(response);
}

async function post(url: any, body: any) {
  const requestOptions: object | any = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(url) },
    credentials: 'include',
    body: JSON.stringify(body),
  };
  const response = await fetch(url, requestOptions);
  return handleResponse(response);
}

async function put(url: any, body: any) {
  const requestOptions: object | any = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader(url) },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, requestOptions);
  return handleResponse(response);
}

// prefixed with underscored because delete is a reserved word in javascript
async function deleted(url: any, body: any) {
  const requestOptions: object | any = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeader(url) },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, requestOptions);
  return handleResponse(response);
}

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

// function skip(currentPages : any, parametersFilter: any){
//   const skip = currentPages * Number(take);
//   let parametersFilter = `skip=${skip}&take=${take}`;

//   if (filter) {
//     parametersFilter = `${parametersFilter}&${filter}`;
//   }

//   return { parametersFilter, currentPages };
// }
// async function RemoveExtraCultureId(parametersFilter){

//   const myArray = await parametersFilter.split("&id_culture");

//   if(myArray.length > 2){

//     parametersFilter = "";
//     parametersFilter = myArray[0]+"&id_culture"+myArray[1]
//   }
//   return parametersFilter;

// }

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
    case 'experimento':
      parametersFilter = await experimento(theArgs);
      break;

    case 'parcelas':
      parametersFilter = await parcelas(theArgs);
      break;

    default:
      parametersFilter = '';
  }

  return parametersFilter;
}

// experimento in list
function experimento(theArgs: any) {
  const [key, filterFoco, filterTypeAssay, filterProtocol, filterGli, filterExperimentName, filterTecnologia, filterCod, filterPeriod, filterDelineamento, filterRepetition, filterStatus, idSafra] = theArgs;

  const parametersFilter = `filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterGli=${filterGli}&filterExperimentName=${filterExperimentName}&filterTecnologia=${filterTecnologia}&filterPeriod=${filterPeriod}&filterRepetition=${filterRepetition}&filterDelineamento=${filterDelineamento}&idSafra=${idSafra}&filterProtocol=${filterProtocol}&filterCod=${filterCod}&filterStatus=${filterStatus}`;

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

// Get Values from Url
function getValueParams(ParameterString: any) {
  let c;
  if (localStorage.getItem('filterValueEdit')) {
    const convert = localStorage.getItem('filterValueEdit');
    const url_string = `http://www.example.com/t.html?${convert}`;
    const url = new URL(url_string);
    c = url.searchParams.get(ParameterString)?.toString();
  }

  return c;
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

function handleOrderG(columnG:any, orderG :any, orderListG:any) {
  let typeOrderG: any;
  let orderByG: any; // RR
  let arrowOrder : any;
  if (orderG == 1) {
    typeOrderG = 'asc';
  } else if (orderG == 2) {
    typeOrderG = 'desc';
  } else {
    typeOrderG = '';
  }

  if (orderListG === 2) {
    orderByG = 0;
    arrowOrder = AiOutlineArrowDown;
  } else {
    orderByG = orderListG + 1;
    if (orderListG === 1) {
      arrowOrder = AiOutlineArrowUp;
    } else {
      arrowOrder = '';
    }
  }
  return {
    typeOrderG, columnG, orderByG, arrowOrder,
  };
}

// helper functions

export const fetchWrapper = {
  get,
  post,
  put,
  deleted,
  handlePaginationGlobal,
  handleTotalGlobal,
  handleFilterParameter,
  handleOrderGlobal,
  getValueParams,
  skip,
  getValuesForFilter,
  handleOrderG,
};
