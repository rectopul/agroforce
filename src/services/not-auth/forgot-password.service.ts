import getConfig from 'next/config';
import { fetchWrapper } from '../../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/not-auth/forgot-password`;

interface IForgotPassword {
  login: string;
  confirmLogin: string;
}

export const forgotPasswordService = {
  sendLogin,
};

async function sendLogin(data: IForgotPassword) {
  const send = await fetchWrapper.post(baseUrl, data);
  return send;
}
