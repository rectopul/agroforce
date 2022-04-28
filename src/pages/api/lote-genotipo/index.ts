import { NextApiRequest, NextApiResponse } from "next";
import { LoteGenotipoController } from "src/controllers/lote-genotipo.controller";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id_genotipo } = req.query;
  const { id, name, volume }  = req.body;

  const loteGenotipoController = new LoteGenotipoController();

  switch(req.method) {
    case 'GET':
      const resultGet = await loteGenotipoController.list(Number(id_genotipo));
    
      res.status(200).json(resultGet.data);
    break;
    case 'PUT':
      const resultPut = await loteGenotipoController.update({
        id: Number(id),
        name: name,
        volume: Number(volume),
      });
    
      res.status(200).json(resultPut);
    break;

    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
