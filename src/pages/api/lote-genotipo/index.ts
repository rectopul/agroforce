import { NextApiRequest, NextApiResponse } from "next";
import { LoteGenotipoController } from "src/controllers/lote-genotipo.controller";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id_genotipo } = req.query;

  const loteGenotipoController = new LoteGenotipoController();

  switch(req.method) {
    case 'GET':
      const resultGet = await loteGenotipoController.list(Number(id_genotipo));
    
      res.status(200).json(resultGet.data);
    break;

    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
