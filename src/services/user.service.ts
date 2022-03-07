import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router'

import { fetchWrapper } from '../helpers';

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
    createUsers,
    updateUsers
};

function login(email: any, password: any) {
    return fetchWrapper.post(`${baseUrl}/signIn`, { email, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function createUsers(data: any) {
    return fetchWrapper.post(baseUrl, data);
}

function updateUsers(data: any) {
    return fetchWrapper.put(baseUrl, data);
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/login');
}

function getAll(parameters: any) {
    return fetchWrapper.get(baseUrl, parameters);
}

function getPermissions(parameters: any) {
    return fetchWrapper.get(baseUrl + '/permissions', parameters);
}
