import { NextApiRequest, NextApiResponse } from 'next';
import { DepartamentController } from 'src/controllers/departament.controller';
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
  const Controller = new DepartamentController();
  switch (req.method) {
    case 'GET':
      const response = await Controller.getAllDepartaments();
      res.status(200).json(response);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
