import { NextApiRequest, NextApiResponse } from 'next';
import { DepartamentController } from '../../../controllers/departament.controller';
import { apiHandler } from '../../../helpers/api';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '16mb',
    },
  },
};

export default apiHandler(handler);
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const departamentController = new DepartamentController();

  switch (req.method) {
    case 'GET':
      const result = await departamentController.listAllDepartments(req.query);
      res.status(200).json(result);
      break;
    case 'POST':
      const resultPost = await departamentController.postDepartament(req.body);
      res.status(200).json(resultPost);
      break;
    case 'PUT':
      const resultPut = await departamentController.updateDepartament(req.body);
      res.status(200).json(resultPut);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
