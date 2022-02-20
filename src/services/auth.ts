import { v4 as uuid } from 'uuid'
import { UserController } from '../controllers/user.controller';
import { useEffect, useState } from "react";


type SignInRequestData = {
  email: string;
  password: string;
}

export async function signInRequest(data: SignInRequestData) {
  const response = await fetch('api/user/signIn', 
    {
      method: "POST", 
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({email: data.email, password:data.password })
    })
  .then((res) => res.json())
  .then((data) => data )
  .catch(function(err) {
    console.log(err)
  });
  return {
    token: uuid(),
    user: { response }
  }
}

export async function recoverUserInformation() {

  return {
    user: {
      name: 'Diego Fernandes',
      email: 'diego@rocketseat.com.br',
      avatar_url: 'https://github.com/diego3g.png'
    }
  }
}