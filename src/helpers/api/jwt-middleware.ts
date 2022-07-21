import getConfig from 'next/config';

const expressJwt = require('express-jwt');
const util = require('util');

const { serverRuntimeConfig } = getConfig();

export { jwtMiddleware };

function jwtMiddleware(req: any, res:any) {
  const middleware = expressJwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256'] }).unless({
    path: [
      // public routes that don't require authentication
      '/api/user/signIn',
      '/api/not-auth/forgot-password',
    ],
  });

  return util.promisify(middleware)(req, res);
}
