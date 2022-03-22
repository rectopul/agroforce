
import { NextApiRequest, NextApiResponse } from 'next';
import {UserController} from '../../../controllers/user.controller';
import { UserPermissionController } from 'src/controllers/user-permission.controller';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { UserCultureController } from 'src/controllers/user-culture.controller';

const jwt = require('jsonwebtoken');

import getConfig from 'next/config';
import { apiHandler } from '../../../helpers/api';

const { serverRuntimeConfig } = getConfig();

export default  apiHandler(handler);

function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new UserController();
    const PermissionController = new UserPermissionController();
    const PreferencesControllers = new UserPreferenceController();
    const userCultureController = new UserCultureController();

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
      let preferences: object | any = new Object;
      let userCulture: object | any = new Object;
      if (user) {
        userCulture.culturas = await (await userCultureController.getByUserID(user.id)).response;
        if (!userCulture.culturas) throw 'Você está sem acesso as culturas, contate o seu lider!';
        userCulture.cultura_selecionada = userCulture.culturas[0].id;
        permisions = await PermissionController.getUserPermissions(user.id); 
        preferences.usuario = await (await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 1})).response[0];
        preferences.safra= await (await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 2})).response[0]
        preferences.culture= await (await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 3})).response[0]
        preferences.local= await (await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 4})).response[0]
        preferences.layoult_quadra= await (await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 5})).response[0]
        preferences.delineamento= await (await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 7})).response[0]
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
          preferences,
          userCulture
      });
    }
}

