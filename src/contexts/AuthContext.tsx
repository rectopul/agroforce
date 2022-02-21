import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from 'nookies'
import Router from 'next/router'

import {  signInRequest } from "../services/auth";

type User = {
  name: string;
  email: string;
  id_profile: number;
}

type SignInData = {
  email: string;
  password: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null)
  console.log(user)
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'token': token } = parseCookies()

    if (token) {
      // recoverUserInformation(token).then(response => {
      //   setUser(response.user)
      // })
    } else {
      Router.push('/');
    }
  }, [])

  async function signIn({ email, password }: SignInData) {
    const { token, user } = await signInRequest({
      email,
      password,
    })

    if (token && token != "") {
      setCookie(undefined, 'token', token, {
        maxAge: 60 * 60 * 1, // 1 hour
      })
  
      setUser(user)
  
      Router.push('/listagem');
    } 
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}