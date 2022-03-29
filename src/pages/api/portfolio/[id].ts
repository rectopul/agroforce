import { NextApiRequest, NextApiResponse } from 'next';
import { PortfolioController } from '../../../controllers/portfolio.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const portfolioController =  new PortfolioController();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const result: any = await portfolioController.getOnePortfolio(Number(id));
      res.status(result.status).json(result.response);
      break
    case 'PUT':
      const resultPut = await portfolioController.updatePortfolio(req.body);
      res.status(200).json(resultPut);
      break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
