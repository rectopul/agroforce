import { NextApiRequest, NextApiResponse } from "next";
import { LoteGenotipoController } from "src/controllers/lote-genotipo.controller";

interface ILoteGenotipoDTO {
  id: number;
  id_genotipo: number;
  name: string;
  volume: number;
  status: number;
  created_by: number;
};

type ICreateLoteGenotipo = Omit<ILoteGenotipoDTO, "id" | "status">;

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    id_genotipo,
    name,
    volume,
    created_by,
  } = req.body;

  const loteGenotipoController = new LoteGenotipoController();

  switch(req.method) {
    case 'POST':
      const resultPost = await loteGenotipoController.create({
        id_genotipo: Number(id_genotipo),
        name,
        volume,
        created_by,
      });

      res.status(200).json(resultPost);
    break;

    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
