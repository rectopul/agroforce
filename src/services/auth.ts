import { v4 as uuid } from 'uuid'

type SignInRequestData = {
  email: string;
  password: string;
}

export async function signInRequest(data: SignInRequestData) {
  let token =  uuid();
  const user = await fetch('api/user/signIn', 
    {
      method: "POST", 
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({email: data.email, password:data.password, token: token })
    })
  .then((res) => res.json())
  .then((data) => data )
  .catch(function(err) {
    console.log(err)
  });

  if(!user) {
    token = "";
  }

  return {
    token: token,
    user: user
  }
}

// export async function recoverUserInformation(token: any) {
//   if (token) {
//     const r = await fetch('api/user/' + token)
//     .then((res) => res.json())
//     .then((data) => data )
//     .catch(function(err) {
//       console.log(err)
//     });
//     return {
//       user: r
//     }
//   }
// }