import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { RiFileExcel2Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { Button, CheckBox } from '../../../components';
import { Content } from '../../../components/Content';
import { profileService } from '../../../services';
import stylesCommon from '../../../shared/styles/common.module.css';
import LoadingComponent from '../../../components/Loading';

export default function Permissoes({
  allRoutes,
  profileId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  function Route({ key, route }: any) {
    return (
      <div className="inline ">
        <li id={key} className="mr-12">{ route }</li>
      </div>
    );
  }

  async function save() {
    setLoading(true);
    const els: any = document.querySelectorAll("input[type='checkbox']");
    const selecionados: any = {};

    for (let i = 0; i < els.length; i += 1) {
      if (els[i].checked) {
        selecionados[els[i].id] += (els[i].value ? `${els[i].value},` : '');
      }
    }

    const { status, message } = await profileService.update({ selecionados, profileId });
    if (status === 200) {
      Swal.fire(message);
      router.back();
    } else {
      Swal.fire(message);
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Permissões</title>
      </Head>

      {loading && <LoadingComponent text="" />}

      <Content
        contentHeader={[]}
        moduloActive="config"
      >
        <div className={stylesCommon.container}>
          <ul>
            {allRoutes.map((route: any) => (
              <>
                <Route key={route.id} route={route.screenRoute} />
                {route.permission[0]?.permissions?.map((element: any) => (
                  <CheckBox
                    name={element.title}
                    id={route.screenRoute}
                    title={element.title?.toString()}
                    value={element.value}
                    defaultChecked={element.checked}
                  />
                ))}
              </>
            ))}
          </ul>
          <div>
            <Button
              title="Salvar"
              value="Salvar"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={save}
            />
          </div>
        </div>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}: any) => {
  const { token } = req.cookies;
  const profileId = query.id;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/permissions`;

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(`profileId=${profileId}`).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const {
    newResult: allRoutes,
  } = await fetch(
    urlParameters.toString(),
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allRoutes,
      profileId,
    },
  };
};

// const routes: any = [
//   {
//     id: 1,
//     routes: 'config/tmg/cultura',
//     permissions: [
//       { value: 'view', title: 'Ver', checked: true },
//       { value: 'create', title: 'Criar', checked: false },
//       { value: 'edit', title: 'Editar', checked: false },
//       { value: 'disable', title: 'Inativar', checked: true },
//     ],
//   },

//   {
//     id: 2,
//     routes: 'config/tmg/genotipo',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 3,
//     routes: 'config/tmg/lote',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 4,
//     routes: 'config/tmg/safra',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 5,
//     routes: 'config/tmg/setor',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 6,
//     routes: 'config/tmg/usuarios',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 7,
//     routes: 'config/ensaio/foco',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 8,
//     routes: 'config/ensaio/tecnologia',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 9,
//     routes: 'config/ensaio/tipo-ensaio',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 10,
//     routes: 'config/delineamento/delineamento',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 11,
//     routes: 'config/delineamento/delineamento/sequencia-delineamento',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 12,
//     routes: 'config/local/lugar-local',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 13,
//     routes: 'config/local/unidade-cultura',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 14,
//     routes: 'config/quadra',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 15,
//     routes: 'config/quadra/layout-quadra',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 16,
//     routes: 'listas/rd',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 17,
//     routes: 'listas/genotipos-ensaio',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Inativar',
//     ],
//   },

//   {
//     id: 18,
//     routes: 'listas/experimento',
//     permissions: [
//       'Ver',
//       'Importar',
//       'Editar',
//       'Excluir',
//     ],
//   },

//   {
//     id: 19,
//     routes: 'listas/parcelas-experimento',
//     permissions: [
//       'Ver',
//     ],
//   },

//   {
//     id: 20,
//     routes: 'operacao/ambiente',
//     permissions: [
//       'Ver',
//       'Importar',
//       'Editar',
//       'Sortear',
//       'Excluir',
//     ],
//   },

//   {
//     id: 21,
//     routes: 'operacao/etiquetagem',
//     permissions: [
//       'Ver',
//       'Criar',
//       'Editar',
//       'Imprimir',
//       'Excluir',
//     ],
//   },

//   {
//     id: 22,
//     routes: 'relatorios/logs',
//     permissions: [
//       'Ver',
//     ],
//   },

// ];

// const routesx = [
//   {
//     config: {
//       tmg: {
//         cultura: 'config/tmg/cultura',
//         genotipo: 'config/tmg/genotipo',
//         lote: 'config/tmg/lote',
//         safra: 'config/tmg/safra',
//         setor: 'config/tmg/setor',
//         usuarios: 'config/tmg/usuarios',
//       },
//       ensaio: {
//         foco: 'config/ensaio/foco',
//         tecnologia: 'config/ensaio/tecnologia',
//         'tipo-ensaio': 'config/ensaio/tipo-ensaio',
//       },
//       delineamento: {
//         delineamento: 'config/delineamento/delineamento',
//         sequencia: 'config/delineamento/delineamento/sequencia-delineamento',
//       },
//       local: {
//         local: 'config/local/lugar-local',
//         'unidade-cultura': 'config/local/unidade-cultura',
//       },
//       quadras: {
//         quadra: 'config/quadra',
//         'layout-quadra': 'config/quadra/layout-quadra',
//       },
//     },
//     listas: {
//       rd: {
//         rd: 'listas/rd',
//       },
//       ensaios: {
//         ensaio: 'listas/ensaio',
//         genotipos_ensaio: 'listas/genotipos-ensaio',
//       },
//       experimentos: {
//         experimento: 'listas/experimento',
//         'parcelas-experimento': 'listas/parcelas-experimento',
//       },
//     },
//     operacao: {
//       ambiente: {
//         ambiente: 'listas/ambiente',
//         experimento: 'listas/experimento',
//       },
//       etiquetagem: {
//         etiquetagem: 'listas/etiquetagem',
//       },
//     },
//     relatorios: {
//       logs: {
//         logs: 'listas/logs',
//       },
//     },
//   },
// ];