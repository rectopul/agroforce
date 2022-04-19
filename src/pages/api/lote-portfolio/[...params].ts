import { NextApiRequest, NextApiResponse } from 'next';
import { LoteController } from '../../../controllers/lote.controller';
import { apiHandler } from '../../../helpers/api';
import { prisma } from '../db/db';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const loteController = new LoteController();
  
  const { id_portfolio } = req.query;

  switch (req.method) {
    case 'GET':
      // const responseGet = loteController.listAll({id_portfolio, ...req});
      // res.status(200).json(responseGet);

      const responseGet = await prisma.lote.findMany({
        where: {
          id_portfolio: Number(id_portfolio),
        },
        include: {
          portfolio: {
            select: {
              id: true,
              genealogy: true,
              id_culture: true,
            }
          }
        }
      });
    
      const data = responseGet.map(item => {
        return {
          id: item.id,
          id_portfolio: item.portfolio.id,
          id_culture: item.portfolio.id_culture,
          genealogy: item.portfolio.genealogy,
          name: item.name,
          volume: item.volume,
          status: item.status,
        }
      });
    
      res.status(200).json(data);

      break
    case 'PUT':
        const resultPut = await loteController.update(req.body);
        res.status(200).json(resultPut);
        break
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
