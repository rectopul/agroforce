
import { NextApiRequest, NextApiResponse } from 'next';
import { PortfolioController } from '../../../controllers/portfolio.controller';
import { apiHandler } from '../../../helpers/api';

export default  apiHandler(handler);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  const portfolioController =  new PortfolioController();

  switch (req.method) {
    case 'GET':
      const result = await portfolioController.listAllPortfolios(req.query);
      res.status(200).json(result);
      break
    case 'POST':
      const resultPost = await portfolioController.createPortfolio(req.body);
      res.status(201).json(resultPost);
      break
    case 'PUT':
      let resultPut = await portfolioController.updatePortfolio(req.body);  
      res.status(200).json(resultPut);
      break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
