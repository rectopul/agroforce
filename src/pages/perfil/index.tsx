import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import { Button } from 'src/components';
import { userService } from 'src/services';
import { getCPF } from 'src/shared/utils/formatCpf';
import { handleFormatTel } from 'src/shared/utils/tel';
import Swal from 'sweetalert2';
import { Content } from '../../components/Content';
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
  id: number;
  avatar: string;
  name: string;
  login: string;
  cpf: string;
  tel: string;
  registration: number;
  name_department: string;
  status: number;
  cultures: ICulture[];
}

interface User {
  user: IProfileProps;
}

interface IUpdateAvatar {
  id: number;
  avatar: string;
}

export default function Perfil({ user }: User) {
  const [avatar, setAvatar] = useState<string>(user.avatar);
  const [visibleTag, setVisibleTag] = useState<string>('hidden');

  const uploadAvatar = async (event: FormEvent | any) => {
    setVisibleTag('flex');

    const file = event.target.files[0];
    const base64 = await convertBase64(file) as string;

    setAvatar(base64);
  };

  const convertBase64 = (file: Blob) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (() => {
      resolve(fileReader.result);
    });

    fileReader.onerror = ((error) => {
      reject(error);
    });
  });

  const formik = useFormik<IUpdateAvatar>({
    initialValues: {
      id: user.id,
      avatar,
    },
    onSubmit: async () => {
      await userService.profileUpdateAvatar({
        id: user.id,
        avatar,
      }).then(() => {
        Swal.fire({
          title: 'Avatar atualizado com sucesso!',
        });
      }).catch(() => {
        Swal.fire({
          title: 'Erro ao atualizar o avatar do usuário!',
        });
      }).finally(() => {
        setVisibleTag('hidden');
        document.location.reload();
      });
    },
  });

  return (
    <>
      <Head>
        <title>{user.name}</title>
      </Head>
      <Content
        contentHeader={[]}
        // moduloActive="config"
      >
        <div className={styles.container}>
          <div>
            <div className={styles.headerProfile}>
              <form id="form" className={styles.form} onSubmit={formik.handleSubmit}>
                <div className={styles.containerAvatarHeader}>
                  <div className="shrink-0">
                    <label htmlFor="avatar">
                      <input
                        style={{ display: 'none' }}
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        multiple={false}
                        onChange={(e) => {
                          uploadAvatar(e);
                        }}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formik.values.avatar}
                        alt="upload de foto"
                        className={styles.avatarEdit}
                        title={`Editar avatar de ${user.name}`}
                      />
                    </label>
                  </div>
                </div>
                {avatar && (
                  <div className="w-52 h-11">
                    <button
                      type="submit"
                      className={
                        visibleTag === 'flex'
                          ? `${visibleTag}w-full h-full px-2 flex items-center justify-center gap-2 text-white bg-blue-600 rounded border border-t-white shadow-md`
                          : `${visibleTag}w-full h-full flex items-center justify-center gap-2 text-white bg-blue-600 rounded border border-t-white shadow-md`
                      }
                    >
                      <MdOutlineAddAPhoto className={visibleTag} />
                      <span className={visibleTag}>Atualizar avatar</span>
                    </button>
                  </div>
                )}
              </form>

              <div className={styles.containerUserName}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userDepartment}>{user.name_department}</span>
              </div>
            </div>

            <div className={styles.containerContent}>
              <h2
                className={commonStyles.titlePage}
                style={{
                  fontSize: 20, marginTop: 0,
                }}
              >
                Dados pessoais

              </h2>
              <div className={styles.content} style={{ padding: 10 }}>
                <div>
                  <label>Login: </label>
                  <span>{user.login}</span>
                </div>

                <div>
                  <label>CPF: </label>
                  <span>{getCPF(user.cpf)}</span>
                </div>

                <div>
                  <label>Contato: </label>
                  <span>{handleFormatTel(user.tel)}</span>
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
                  <label>Status: </label>
                  <span>{user.status === 1 ? 'Ativo' : 'Inativo'}</span>
                </div>
              </div>

              <h2
                className={commonStyles.titlePage}
                style={{
                  fontSize: 20, marginTop: 5,
                }}
              >
                Cultura e permissões
              </h2>

              <div className={styles.content} style={{ padding: 10 }}>
                {user.cultures.map((item) => (
                  <div key={item.culture_id}>
                    <label>
                      {item.culture_name}
                      :
                      {' '}
                    </label>
                    <span>
                      {item.permissions.map((permission) => (
                        `${permission.permission_name}, `
                      ))}

                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.buttonFooter}>
              <div className="w-40">
                <Button
                  type="button"
                  value="Voltar"
                  bgColor="bg-red-600"
                  textColor="white"
                  icon={<IoMdArrowBack size={18} />}
                  onClick={() => { router.back(); }}
                />
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
  const baseUrl = `${publicRuntimeConfig.apiUrl}/profile-user`;

  const { token } = context.req.cookies;
  const { id } = context.query;

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const reponse = await fetch(`${baseUrl}/${Number(id)}`, requestOptions);

  const user = await reponse.json();

  if (!user.avatar) {
    user.avatar = 'https://media-exp1.licdn.com/dms/image/C4E0BAQGtzqdAyfyQxw/company-logo_200_200/0/1609955662718?e=2147483647&v=beta&t=sfA6x4MWOhWda5si7bHHFbOuhpz4ZCTdeCPtgyWlAag';
  }

  return {
    props: {
      user,
    },
  };
};
