import { NextApiRequest, NextApiResponse } from "next";
import { UserController } from '../../../controllers/user.controller';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, avatar } = req.body;

  const userController = new UserController();

  if (req.method !== 'PUT') {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const result = await userController.updateAvatar(Number(id), avatar);
  
    res.status(200).json(result);
  } catch  {
    res.status(405).end(`Usuário não encontrado.`);
  }
}
