import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useState } from "react";
import { BiUser } from "react-icons/bi";
import { Content } from "../../components/Content";
import commonStyles from '../../shared/styles/common.module.css';
import styles from './styles.module.css';

interface IProfilePermission {
  permission_id?: number;
  permission_name: string;
}

interface ICulture {
  culture_id: number;
  culture_name: string;
  permissions: IProfilePermission[];
}

interface IProfileProps {
  id?: number;
  avatar?: string;
  name: string;
  email: string;
  cpf: string;
  tel: string;
  registration: number;
  name_department: string;
  jivochat: number;
  app_login: number;
  status: number;
  cultures: ICulture[];
}

interface User {
  user: IProfileProps;
}

export default function Perfil({user}: User) {
  const [avatar, setAvatar] = useState(user.avatar);
  const inputUploadAvatar = `block w-full text-sm text-slate-500
  file:mr-4 file:py-2 file:px-4
  file:rounded-full file:border-0
  file:text-sm file:font-semibold
  file:bg-violet-50 file:text-violet-700
  hover:file:bg-violet-100`;

  // console.log(JSON.stringify(user, null, 2));

  return (
    <>
      <Head>
        <title>{user.name}</title>
      </Head>
      <Content
        contentHeader={[]}
      >
        <div className={styles.container}>
          <div>
            <div className={styles.headerProfile}>
              {avatar !== '' ? (
                  <div className={styles.containerAvatarHeader}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={styles.avatarLg}
                      src={String(avatar)}
                      alt={user.name}
                    />
                    <input
                      type="file"
                      className={inputUploadAvatar}
                      onChange={(e) => console.log(e.target.files?.item(0)?.name)}
                    />
                  </div>
              ) : (
                <div className={styles.containerAvatarHeader}>
                  <div className={styles.avatarLg}>
                    <BiUser size='95%' className="m-auto" />
                  </div>
                  <input type="file" className={inputUploadAvatar}/>
                </div>
              )}

              <div className={styles.containerUserName}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userDepartment}>{user.name_department}</span>
              </div>
            </div>

            <div className={styles.containerContent}>
              <h2 className={commonStyles.titlePage}>Dados pessoais</h2>
              <div className={styles.content}>
                <div>
                  <label>E-mail: </label>
                  <span>{user.email}</span>
                </div>

                <div>
                  <label>CPF: </label>
                  <span>{user.cpf}</span>
                </div>

                <div>
                  <label>Contato: </label>
                  <span>{user.tel}</span>
                </div>

                <div>
                  <label>Matricula: </label>
                  <span>{user.registration}</span>
                </div>

                <div>
                  <label>Setor: </label>
                  <span>{user.name_department}</span>
                </div>

                <div>
                  <label>Acesso ao Jivochat: </label>
                  <span>{user.jivochat === 1 ? "Sim" : "Não"}</span>
                </div>

                <div>
                  <label>Acesso ao App: </label>
                  <span>{user.app_login === 1 ? "Sim" : "Não"}</span>
                </div>

                <div>
                  <label>Status: </label>
                  <span>{user.status === 1 ? "Ativo" : "Inativo"}</span>
                </div>
              </div>

              <h2 className={commonStyles.titlePage}>Cultura e permissões</h2>

              <div className={styles.content}>
                {user.cultures.map((item) => (
                  <div key={item.culture_id}>
                    <label>{item.culture_name}: </label>
                    <span>{item.permissions.map((permission) => (
                      permission.permission_name + ', '
                    ))}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Content>
   </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/testes`;

  const { token } =  context.req.cookies;
  const { id } = context.query;

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  } as RequestInit | undefined;
  
  const reponse = await fetch(`${baseUrl}/` + id, requestOptions);

  const user = await reponse.json();

  // console.log(JSON.stringify(user, null, 2));

  return {
    props: {
      user,
    }
  }
}
