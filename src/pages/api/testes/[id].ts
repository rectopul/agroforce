import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../db/db";

interface IProfilePermission {
  id?: number;
  name: string;
}

interface ICulture {
  id?: number;
  name: string;
  permissions: IProfilePermission[];
}

interface IProfileProps {
  id?: number;
  avatar: string | undefined;
  name: string;
  email: string;
  cpf: string;
  tel: string;
  registration: number;
  name_department: string;
  jivochat: string;
  app_login: string;
  status: string;
  cultures: ICulture[];
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method !== 'GET') {
    res.status(404).end();
  }

  const { id } = req.query;

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
                    }
                  }
                }
              }
            }
          }
        }
      },
      // users_permissions: {
      //   where: {
      //     userId: Number(id),
          // cultureId: parseInt(context.req.cookies.cultureId),
        // },
        // select: {
        //   id: true,

          // profile: {
          //   select: {
          //     id: true,
          //     name: true,
          //   }
          // },
          // culture: {
          //   select: {
          //     id: true,
          //     name: true,
          //     users_permissions: {
          //       select: {
          //         profile: {
          //           select: {
          //             id: true,
          //             name: true,
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
        // },
      // },
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    }
  });

  if (!response) {
    res.status(400).json({message: 'Usuário não encontrado.'});
  }

  const user = {
    id: response?.id,
    name: response?.name,
    email: response?.email,
    cpf: response?.cpf,
    tel: response?.tel,
    password: response?.password,
    avatar: response?.avatar,
    registration: response?.registration,
    name_department: response?.department.name,
    jivochat: response?.jivochat,
    app_login: response?.app_login,
    status: response?.status,
    cultures: response?.users_cultures.map(item => {
      return {
        culture_id: item.culture.id,
        culture_name: item.culture.name,
        permissions: item.culture.users_permissions.map(item => {
          return {
            permission_id: item.profile.id,
            permission_name: item.profile.name,
          }
        })
      }
    })
  }

 res.status(200).json(user);
}
