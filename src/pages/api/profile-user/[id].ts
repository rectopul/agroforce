import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../db/db';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  switch (req.method) {
    case ('GET'):
      const response = await prisma.user.findFirst({
        where: {
          id: Number(id),
        },
        include: {
          users_cultures: {
            select: {
              culture: {
                select: {
                  id: true,
                  name: true,
                  users_permissions: {
                    select: {
                      profile: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!response) {
        res.status(400).json({ message: 'Usuário não encontrado.' });
      }

      const user = {
        id: response?.id,
        name: response?.name,
        login: response?.login,
        cpf: response?.cpf,
        tel: response?.tel,
        password: response?.password,
        avatar: response?.avatar,
        registration: response?.registration,
        name_department: response?.department.name,
        status: response?.status,
        cultures: response?.users_cultures.map((item: any) => ({
          culture_id: item.culture.id,
          culture_name: item.culture.name,
          permissions: item.culture.users_permissions.map((item: any) => ({
            permission_id: item.profile.id,
            permission_name: item.profile.name,
          })),
        })),
      };

      res.status(200).json(user);
      break;

    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
