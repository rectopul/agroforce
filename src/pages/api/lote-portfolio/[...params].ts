import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../helpers/api';
import { prisma } from '../db/db';

export default  apiHandler(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id_lote } = req.query;

  if (req.method !== 'GET') res.status(405).end(`Method ${req.method} Not Allowed`);

  const response = await prisma.portfolio.findMany({
    where: {
      id_lote: Number(id_lote),
    },
    include: {
      lote: {
        select: {
          id: true,
          name: true,
          volume: true,
          status: true,
        }
      }
    }
  });

  const data = response.map(item => {
    return {
      id: item.id,
      id_culture: item.id_culture,
      genealogy: item.genealogy,

      id_lote: item.lote.id,
      name_lote: item.lote.name,
			volume_lote: item.lote.volume,
			status_lote: item.lote.status,
    }
  });

  return res.status(200).json(data);
}
