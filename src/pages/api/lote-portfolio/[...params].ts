import { NextApiRequest, NextApiResponse } from 'next';
import { LotePortfolioController } from '../../../controllers/lote-portfolio.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const lotePortfolioController =  new LotePortfolioController();
  const { id_portfolio, id_culture } = req.query;

  switch (req.method) {
    case 'GET':
      const result = await lotePortfolioController.list(Number(id_portfolio), Number(id_culture));
      res.status(result.status).json(result.response);
      break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
