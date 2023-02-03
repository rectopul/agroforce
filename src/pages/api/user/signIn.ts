import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { SafraController } from '../../../controllers/safra.controller';
import { UserPermissionController } from '../../../controllers/user-permission.controller';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import { UserController } from '../../../controllers/user.controller';
import { apiHandler } from '../../../helpers/api';

const jwt = require('jsonwebtoken');

const { serverRuntimeConfig } = getConfig();

function handler(req: NextApiRequest, res: NextApiResponse) {
  const Controller = new UserController();
  const PermissionController = new UserPermissionController();
  const PreferencesControllers = new UserPreferenceController();
  const safraController = new SafraController();

  async function authenticate() {
    const user: any = await Controller.signInUSer(req.body);
    const preferences: object | any = {};
    const userCulture: object | any = {};
    const safras: object | any = {};

    if (user) {
      const validateLogin: object | any = await Controller.getAll({
        paramSelect: 'id', id: user.id, filterStatus: 1,
      });

      if (validateLogin.total <= 0 || validateLogin.status === 400) throw new Error('Você não tem acesso a essa pagina, entre em contato com seu líder!');

      userCulture.culturas = await PermissionController.getByUserID(user.id);
      userCulture.culturas = userCulture.culturas.response;

      if (!userCulture.culturas || userCulture.culturas.status === 400 || userCulture.culturas.length === 0) throw new Error('Você está sem acesso as culturas, contate o seu lider!');

      let cultureSelecionada;
      Object.keys(userCulture.culturas).forEach((item: any) => {
        if (userCulture.culturas[item].status === 1) {
          cultureSelecionada = userCulture.culturas[item].cultureId;
        }
      });
      userCulture.cultura_selecionada = cultureSelecionada || userCulture.culturas[0]?.cultureId;

      safras.safras = await safraController.getAll({
        id_culture: userCulture.cultura_selecionada, filterStatus: 1, orderBy: 'safraName', typeOrder: 'desc',
      });
      if (safras.safras.total > 0) {
        safras.safras = safras.safras.response;
        safras.safra_selecionada = safras.safras[0]?.id || 0;
      }

      preferences.usuario = await PreferencesControllers.getAll({
        userId: user.id, module_id: 1,
      });
      preferences.usuario = preferences.usuario.response[0];

      preferences.culture = await PreferencesControllers.getAll({
        userId: user.id, module_id: 2,
      });
      preferences.culture = preferences.culture.response[0];

      preferences.safra = await PreferencesControllers.getAll({
        userId: user.id, module_id: 3,
      });
      preferences.safra = preferences.safra.response[0];

      preferences.local = await PreferencesControllers.getAll({
        userId: user.id, module_id: 4,
      });
      preferences.local = preferences.local.response[0];

      preferences.layout_quadra = await PreferencesControllers.getAll({
        userId: user.id, module_id: 5,
      });
      preferences.layout_quadra = preferences.layout_quadra.response[0];

      preferences.foco = await PreferencesControllers.getAll({
        userId: user.id, module_id: 6,
      });
      preferences.foco = preferences.foco.response[0];

      preferences.delineamento = await PreferencesControllers.getAll({
        userId: user.id, module_id: 7,
      });
      preferences.delineamento = preferences.delineamento.response[0];

      preferences.tecnologia = await PreferencesControllers.getAll({
        userId: user.id, module_id: 8,
      });
      preferences.tecnologia = preferences.tecnologia.response[0];

      preferences.tipo_ensaio = await PreferencesControllers.getAll({
        userId: user.id, module_id: 9,
      });
      preferences.tipo_ensaio = preferences.tipo_ensaio.response[0];

      preferences.genotipo = await PreferencesControllers.getAll({
        userId: user.id, module_id: 10,
      });
      preferences.genotipo = preferences.genotipo.response[0];

      preferences.department = await PreferencesControllers.getAll({
        userId: user.id, module_id: 11,
      });
      preferences.department = preferences.department.response[0];

      preferences.lote = await PreferencesControllers.getAll({
        userId: user.id, module_id: 12,
      });
      preferences.lote = preferences.lote.response[0];

      preferences.lote_portfolio = await PreferencesControllers.getAll({
        userId: user.id, module_id: 13,
      });
      preferences.lote_portfolio = preferences.lote_portfolio.response[0];

      preferences.npe = await PreferencesControllers.getAll({
        userId: user.id, module_id: 14,
      });
      preferences.npe = preferences.npe.response[0];

      preferences.sequencia_delineamento = await PreferencesControllers.getAll({
        userId: user.id, module_id: 16,
      });
      preferences.sequencia_delineamento = preferences.sequencia_delineamento.response[0];

      preferences.quadras = await PreferencesControllers.getAll({
        userId: user.id, module_id: 17,
      });
      preferences.quadras = preferences.quadras.response[0];

      preferences.dividers = await PreferencesControllers.getAll({
        userId: user.id, module_id: 18,
      });
      preferences.dividers = preferences.dividers.response[0];

      preferences.layout_children = await PreferencesControllers.getAll({
        userId: user.id, module_id: 19,
      });
      preferences.layout_children = preferences.layout_children.response[0];

      preferences.group = await PreferencesControllers.getAll({
        userId: user.id, module_id: 20,
      });
      preferences.group = preferences.group.response[0];

      preferences.unidadeCultura = await PreferencesControllers.getAll({
        userId: user.id, module_id: 21,
      });
      preferences.unidadeCultura = preferences.unidadeCultura.response[0];

      preferences.experimento = await PreferencesControllers.getAll({
        userId: user.id, module_id: 22,
      });
      preferences.experimento = preferences.experimento.response[0];

      preferences.envelope = await PreferencesControllers.getAll({
        userId: user.id, module_id: 24,
      });
      preferences.envelope = preferences.envelope.response[0];

      preferences.rd = await PreferencesControllers.getAll({
        userId: user.id, module_id: 25,
      });
      preferences.rd = preferences.rd.response[0];

      preferences.assayList = await PreferencesControllers.getAll({
        userId: user.id, module_id: 26,
      });
      preferences.assayList = preferences.assayList.response[0];

      preferences.genotypeTreatment = await PreferencesControllers.getAll({
        userId: user.id, module_id: 27,
      });
      preferences.genotypeTreatment = preferences.genotypeTreatment.response[0];

      preferences.ambiente = await PreferencesControllers.getAll({
        userId: user.id, module_id: 28,
      });
      preferences.ambiente = preferences.ambiente.response[0];

      preferences.etiquetagem = await PreferencesControllers.getAll({
        userId: user.id, module_id: 29,
      });
      preferences.etiquetagem = preferences.etiquetagem.response[0];

      preferences.parcelas = await PreferencesControllers.getAll({
        userId: user.id, module_id: 30,
      });
      preferences.parcelas = preferences.parcelas.response[0];

      preferences.historico_etiquetagem = await PreferencesControllers.getAll({
        userId: user.id, module_id: 31,
      });
      preferences.historico_etiquetagem = preferences.historico_etiquetagem.response[0];
    }

    if (!user) throw new Error('Login ou senha é invalida!');

    // fazer a busca de permissoes

    // create a jwt token that is valid for 7 days
    const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });

    // return basic user details and token
    return res.status(200).json({
      id: user.id,
      login: user.login,
      name: user.name,
      avatar: user.avatar,
      token,
      preferences,
      userCulture,
      safras,
    });
  }

  switch (req.method) {
    case 'POST':
      return authenticate();
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '16mb',
    },
  },
};

export default apiHandler(handler);