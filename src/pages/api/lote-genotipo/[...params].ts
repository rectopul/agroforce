import { NextApiRequest, NextApiResponse } from 'next';
import { LoteController } from '../../../controllers/lote.controller';
import { apiHandler } from '../../../helpers/api';
import { prisma } from '../db/db';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const loteController = new LoteController();
  
  const { id_genotipo } = req.query;

  switch (req.method) {
    case 'GET':
      const responseGet = await prisma.lote.findMany({
        where: {
          id_portfolio: Number(id_genotipo),
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
          id_culture: item.portfolio.id_culture,
          id_genotipo: item.portfolio.id,
          genealogy: item.portfolio.genealogy,
          name: item.name,
          volume: item.volume,
          status: item.status,
        }
      });
    
      res.status(200).json(data);

    break;
    case 'PUT':
      const resultPut = await loteController.update(req.body);
      res.status(200).json(resultPut);
    break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
