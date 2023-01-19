import getConfig from 'next/config';

import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
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

async function postFile(url: any, body: any) {
  
  const requestOptions: object | any = {
    method: 'POST',
    headers: { ...authHeader(url) },
    body: body
  };
  const response = await fetch(url, requestOptions);
  return handleResponse(response);
}

export const fetchWrapper = {
  get,
  post,
  put,
  deleted,
  postFile,
};
