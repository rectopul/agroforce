
import { NextApiRequest, NextApiResponse } from 'next';
import {UserController} from '../../../controllers/user.controller';
import { UserPermissionController } from 'src/controllers/user-permission.controller';
import nookies from 'nookies';

const jwt = require('jsonwebtoken');

import getConfig from 'next/config';
import { apiHandler } from '../../../helpers/api';

const { serverRuntimeConfig } = getConfig();

export default  apiHandler(handler);

function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new UserController();
    const PermissionController = new UserPermissionController();
    switch (req.method) {
        case 'POST':
          return authenticate();
          break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    async function authenticate() {
      const user = await Controller.signinUSer(req.body);
      let permisions;
      if (user) {
        permisions = await PermissionController.getUserPermissions(user.id); 
      }

      if (!user) throw 'Email ou senha é invalida!';

      // fazer a busca de permissoes 
  
      // create a jwt token that is valid for 7 days
      const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });

      // return basic user details and token
      return res.status(200).json({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          token: token,
          permission: permisions,
      });
    }
}

