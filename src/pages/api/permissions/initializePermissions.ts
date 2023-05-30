import {NextApiRequest, NextApiResponse} from 'next';
import {ImportController} from '../../../controllers/import.controller';
import {apiHandler} from '../../../helpers/api';
import initializePermissions from "../../../shared/utils/initializePermissions";
import handleError from "../../../shared/utils/handleError";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  switch (req.method) {
    case 'GET': {

      try {
        const permissionsNotFoundArray = initializePermissions();
        res.status(200).json({message: 'Permissions initialized successfully', data: permissionsNotFoundArray || [] });
      } catch (error: any) {
        handleError('Permissions controller - initializePermissions', 'GetAll', error.message);
        res.status(400).json({message: error.message, data: [] });
      }

      break;
    }
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiHandler(handler);