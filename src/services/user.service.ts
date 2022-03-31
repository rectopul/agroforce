import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'
import { userCultureService } from './user-culture.service';
import { fetchWrapper } from '../helpers';
import { functionsUtils } from 'src/shared/utils/functionsUtils';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/user`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user') as string));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout,
    getAll,
    getPermissions,
    create,
    update,
    logoutSign
};

async function login(email: any, password: any) {
    return fetchWrapper.post(`${baseUrl}/signIn`, { email, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function create(data: any) {
    return fetchWrapper.post(baseUrl, data);
}

function update(data: any) {
    return fetchWrapper.put(baseUrl, data);
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/login');
}

async function logoutSign(email: any, cultures: object | any) {
   let user = await userService.getAll({email: email, paramSelect: ['password', 'id']});
   userCultureService.update({userId:user.response[0].id});
   userCultureService.update({cultureId: cultures.selecionada, status: 1, idUser: user.response[0].id});
   
   localStorage.removeItem('user');
   userSubject.next(null);
   let login =  await userService.login(email, functionsUtils.Crypto(user.response[0].password, 'decipher')) 
   if (login) {
       Router.push('/');
   }
}

function getAll(parameters: any) {
    return fetchWrapper.get(baseUrl, parameters);
}

function getPermissions(parameters: any) {
    return fetchWrapper.get(baseUrl + '/permissions', parameters);
}
