import getConfig from 'next/config';

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
    headers: authHeader(url),
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

  if (localStorage.getItem('pageBeforeEdit') != null) {
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

// async function RemoveExtraCultureId(parametersFilter){

//   const myArray = await parametersFilter.split("&id_culture");

//   if(myArray.length > 2){
//     console.log(RemoveExtraCultureId)

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

    case "safra":
      parametersFilter = await safra(theArgs);
      break;

    case "genotipo":
      parametersFilter = await genotipo(theArgs);
      break;

    case "lote":
      parametersFilter = await lote(theArgs);
      break;

    case "setor":
      parametersFilter = await setor(theArgs);
      break;

    case "usuarios":
      parametersFilter = await usuarios(theArgs);
      break;

    case "cultura":
      parametersFilter = await cultura(theArgs);
      break;



    default:
      parametersFilter = '';
  }

  return parametersFilter;
}

function safra(theArgs: any) {

  const [key1, filterStatus, filterSafra, filterYear, filterStartDate, filterEndDate, cultureId] = theArgs;
  const parametersFilter = `filterStatus=${filterStatus}&filterSafra=${filterSafra}&filterYear=${filterYear}&filterStartDate=${filterStartDate}&filterEndDate=${filterEndDate}&id_culture=${cultureId}`;

  return parametersFilter;
}

function genotipo(theArgs: any) {

  const [key2, filterGenotipo, filterMainName, filterCruza, filterTecnologiaCod, filterTecnologiaDesc, filterGmr, idCulture, idSafra, filterGmrRangeTo, filterGmrRangeFrom] = theArgs;

  const parametersFilter = `&filterGenotipo=${filterGenotipo}&filterMainName=${filterMainName}&filterCruza=${filterCruza}&filterTecnologiaCod=${filterTecnologiaCod}&filterTecnologiaDesc=${filterTecnologiaDesc}&filterGmr=${filterGmr}&id_culture=${idCulture}&id_safra=${idSafra}&filterGmrRangeFrom=${filterGmrRangeFrom}&filterGmrRangeTo=${filterGmrRangeTo}&`;

  return parametersFilter;
}


function lote(theArgs: any) {

  const [key3, filterYear1, filterCodLote, filterNcc, filterFase, filterPeso, filterSeeds, filterGenotipo1, filterMainName1, filterGmr1, filterBgm, filterTecnologiaCod1, filterTecnologiaDesc1,] = theArgs;

  const parametersFilter = `&filterYear=${filterYear1}&filterCodLote=${filterCodLote}&filterNcc=${filterNcc}&filterFase=${filterFase}&filterPeso=${filterPeso}&filterSeeds=${filterSeeds}&filterGenotipo=${filterGenotipo1}&filterMainName=${filterMainName1}&filterGmr=${filterGmr1}&filterBgm=${filterBgm}&filterTecnologiaCod=${filterTecnologiaCod1}&filterTecnologiaDesc=${filterTecnologiaDesc1}`;

  return parametersFilter;
}


function setor(theArgs: any) {

  const [key4, filterStatus2, filterSearch] = theArgs;
  const parametersFilter = `filterStatus=${filterStatus2 || 1}&filterSearch=${filterSearch}`;

  return parametersFilter;
}

function usuarios(theArgs: any) {

  const [key, filterStatus, filterName, filterLogin] = theArgs;
  const parametersFilter = `filterStatus=${filterStatus || 1
    }&filterName=${filterName}&filterLogin=${filterLogin}`;

  return parametersFilter;
}

function cultura(theArgs: any) {

  const [key, filterStatus, filterSearch] = theArgs;
  const parametersFilter = `filterStatus=${filterStatus || 1
    }&filterSearch=${filterSearch}`;

  return parametersFilter;
}


//Handle orders global  
function handleOrderGlobal(column: any, order: any, filter: any, from: any) {

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

  if (from == "safra" || from == "setor") {
    // Remove extra values here
    parametersFilter = removeExtraValues(parametersFilter, from);
    return parametersFilter;
  }
  else if (from == "genotipo") {
    return parametersFilter;
  }
  else {
    return parametersFilter;
  }

}

function removeExtraValues(parametersFilter: any, from: any) {

  const myArray = parametersFilter.split("&orderBy");

  if (myArray.length > 2) {
    parametersFilter = "";
    parametersFilter = myArray[0] + "&orderBy" + myArray[2]
  }

  return parametersFilter;
}

// Get Values from Url
function getValueParams(ParameterString: any) {

  let c;
  if (localStorage.getItem("filterValueEdit")) {
    let convert = localStorage.getItem("filterValueEdit");
    let url_string = `http://www.example.com/t.html?${convert}`;
    let url = new URL(url_string);
    c = url.searchParams.get(ParameterString)?.toString();
  }

  return c;
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
};
