import getConfig from 'next/config';
import { fetchWrapper } from '../../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/not-auth/forgot-password`;

interface IForgotPassword {
  email: string;
  confirmEmail: string;
};

export const forgotPasswordService = {
  sendEmail,
};

async function sendEmail(data: IForgotPassword) {
  const send = await fetchWrapper.post(baseUrl, data);
  return send;
}
