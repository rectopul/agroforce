import { NextApiRequest, NextApiResponse } from 'next';
import { CulturaController } from '../../../controllers/cultura.controller';
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
  const Controller = new CulturaController();

  switch (req.method) {
    case 'GET':
      const result = await Controller.getAllCulture(req.query);
      res.status(200).json(result);
      break;
    case 'POST':
      const resultPost = await Controller.postCulture(req.body);
      res.status(200).json(resultPost);
      break;
    case 'PUT':
      const resultPut = await Controller.updateCulture(req.body);
      res.status(200).json(resultPut);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
