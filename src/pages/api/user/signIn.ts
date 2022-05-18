
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { SafraController } from 'src/controllers/safra.controller';
import { UserPermissionController } from 'src/controllers/user-permission.controller';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { UserController } from '../../../controllers/user.controller';
import { apiHandler } from '../../../helpers/api';

const jwt = require('jsonwebtoken');


const { serverRuntimeConfig } = getConfig();

export default  apiHandler(handler);

function handler(req: NextApiRequest, res: NextApiResponse) {
    const Controller =  new UserController();
    const PermissionController = new UserPermissionController();
    const PreferencesControllers = new UserPreferenceController();
    const safraController = new SafraController();

    switch (req.method) {
        case 'POST':
          return authenticate();
          break
        default:
          res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    async function authenticate() {
      const user: any = await Controller.signinUSer(req.body);
      let permisions;
      let preferences: object | any = new Object;
      let userCulture: object | any = new Object;
      let safras: object | any = new Object;
  
      if (user) {
        const validateLogin: object | any= await Controller.getAllUser({paramSelect:'id', app_login: 1, id: user.id, filterStatus: 1});

        if (validateLogin.total <= 0 || validateLogin.status == 400) throw 'Você não tem acesso a essa pagina, entre em contato com seu líder!';
    
        userCulture.culturas = await PermissionController.getByUserID(user.id);
        userCulture.culturas = userCulture.culturas.response;

        if (!userCulture.culturas || userCulture.culturas.status == 400 || userCulture.culturas.length === 0) throw 'Você está sem acesso as culturas, contate o seu lider!';
        
        let cultureSelecionada; 
        Object.keys(userCulture.culturas).forEach((item) => {
          if (userCulture.culturas[item].status == 1) {
            cultureSelecionada = userCulture.culturas[item].cultureId;
          }
        });

        userCulture.cultura_selecionada = cultureSelecionada || userCulture.culturas[0].cultureId;
        safras.safras = await safraController.getAllSafra({id_culture: userCulture.cultura_selecionada, filterStatus: 1}); 
        if (safras.safras.total > 0) {
          safras.safras = safras.safras.response;
          safras.safra_selecionada = safras.safras[0].id || 0;
        }

        permisions = await PermissionController.getUserPermissions(user.id); 
        preferences.usuario =  await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 1}); preferences.usuario = preferences.usuario.response[0];
        preferences.culture=  await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 2});  preferences.culture =  preferences.culture.response[0];
        preferences.safra=  await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 3}); preferences.safra = preferences.safra.response[0];
        preferences.local=  await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 4}); preferences.local = preferences.local.response[0];
        preferences.layout_quadra=  await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 5}); preferences.layout_quadra = preferences.layout_quadra.response[0];
        preferences.foco=  await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 6}); preferences.foco = preferences.foco.response[0];
        preferences.delineamento=  await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 7}); preferences.delineamento = preferences.delineamento.response[0];
        preferences.tecnologia = await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 8}); preferences.tecnologia = preferences.tecnologia.response[0];
        preferences.tipo_ensaio = await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 9}); preferences.tipo_ensaio = preferences.tipo_ensaio.response[0];
        preferences.genotipo =  await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 10}); preferences.genotipo = preferences.genotipo.response[0];
        preferences.department = await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 11}); preferences.department = preferences.department.response[0];
        preferences.lote = await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 12}); preferences.lote = preferences.lote.response[0];
        preferences.lote_portfolio=  await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 13}); preferences.lote_portfolio = preferences.lote_portfolio.response[0];
        preferences.npe=  await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 14}); preferences.npe = preferences.npe.response[0];
        // preferences.epoca = await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 15}); preferences.epoca = preferences.epoca.response[0];
        preferences.sequencia_delineamento = await PreferencesControllers.getAllPreferences({userId: user.id, module_id: 16}); preferences.sequencia_delineamento = preferences.sequencia_delineamento.response[0];
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
          // permission: permisions,
          preferences,
          userCulture,
          safras
      });
    }
}

