import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useFormik } from 'formik';
import Head from 'next/head';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import {
  experimentGenotipeService,
  npeService,
} from 'src/services';
import InputMask from 'react-input-mask';

import { IoMdArrowBack } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';
import {
  Content, Input, Select, Button,
} from '../../../components';

import * as ITabs from '../../../shared/utils/dropdown';
import ComponentLoading from '../../../components/Loading';

interface ILayoultProps {
  id: number | any;
  esquema: string | any;
  op: string | any;
  semente_metros: number | any;
  disparos: number | any;
  divisor: number | any;
  largura: number | any;
  comp_fisico: number | any;
  comp_parcela: number | any;
  comp_corredor: number | any;
  t4_inicial: number | any;
  t4_final: number | any;
  df_inicial: number | any;
  df_final: number | any;
  localId: number | any;
  created_by: number | any;
  status: number;
}

interface INpeProps {
  id: number | any;
  safra: string | any;
  local: string | any;
  foco: string | any;
  epoca: number | any;
  tecnologia: string | any;
  cod_tec: number | any;
  groupId: number | any;
  type_assay: string | any;
  npei: number | any;
  npef: number | any;
  status: number | any;
  prox_npe: number | any;
}

interface ILocal {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  status: number;
}

interface IData {
  local: object | any;
  layoultEdit: ILayoultProps;
  npe: object | any;
}

export default function NovoLocal({
  local,
  layoultEdit,
  npe,
  idCulture,
  idSafra,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs.default;

  const tabsOperationMenu = tabsOperation.map((i) => (i.titleTab === 'AMBIENTE'
    ? { ...i, statusTab: true }
    : { ...i, statubsTab: false }));

  const [localMap, setIdLocalMap] = useState<ILocal[]>(() => local);
  const [idLocal, setIdLocal] = useState<number>(layoultEdit.localId);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [titleLocal, setTitleLocal] = useState<string>('');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD2fT6h_lQHgdj4_TgbwV6uDfZ23Hj0vKg',
  });

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const locais: object | any = [];
  const router = useRouter();
  const formik = useFormik<INpeProps>({
    initialValues: {
      id: npe?.id,
      safra: npe?.safra?.safraName,
      local: npe?.local?.name_local_culture,
      foco: npe?.foco?.name,
      epoca: Number(npe?.epoca),
      tecnologia: npe?.tecnologia?.name,
      cod_tec: npe?.tecnologia?.cod_tec,
      type_assay: npe?.type_assay?.name,
      groupId: Number(npe?.group?.id),
      npei: Number(npe?.npei),
      npef: Number(npe?.npef),
      status: Number(npe?.status),
      prox_npe: Number(npe?.prox_npe),
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.prox_npe) {
        return;
      }

      const parametersFilter = `filterStatus=1&npei=${values.prox_npe}`;
      await npeService.getAll(parametersFilter).then(async (response) => {
        if (response.total <= 0 || npe[0]?.id === response[0]?.id) {
          const groupId = values.groupId;
          const paramFilter = `id_culture=${idCulture}&id_safra=${idSafra}&npe=${values.prox_npe}&groupId=${groupId}`;
          await experimentGenotipeService
            .getAll(paramFilter)
            .then(async (response) => {
              if (response.total <= 0) {
                await npeService
                  .update({
                    id: values.id,
                    prox_npe: values.prox_npe,
                    npef: npe.status == 3 ? npe.npef : values.prox_npe,
                    npei_i: values.prox_npe,
                    edited: 1,
                  })
                  .then((response) => {
                    if (response.status === 200) {
                      Swal.fire('NPE atualizado com sucesso!');
                      setLoading(false);
                      router.back();
                    } else {
                      setLoading(false);
                      Swal.fire(response.message);
                    }
                  });
              } else {
                setLoading(false);
                Swal.fire({
                  title: "NPE Já usado !!!",
                  html:
                    `Não foi possível atualizar o prox npe, o prox npe inserido já foi usado pela parcela.<br/>` +
                    // `Cultura: ${idCulture}<br>` +
                    // `Safra: ${idSafra}<br>` +
                    // `GroupId: ${groupId}<br>` +
                    `Próx NPE: ${values.prox_npe}<br>`,
                });
              }
            });
        } else {
          setLoading(false);
          Swal.fire(
            'Não é possível atualizar o prox npe, o prox npe inserido já é consumido por outro npe.',
          );
        }
      });
    },
  });

  local.map((value: string | object | any) => {
    locais.push({ id: value.id, name: value.name });
  });

  function validateInputs(values: any) {
    if (!values.prox_npe) {
      const inputesquema: any = document.getElementById('prox_npe');
      inputesquema.style.borderColor = 'red';
    } else {
      const inputesquema: any = document.getElementById('prox_npe');
      inputesquema.style.borderColor = '';
    }
  }

  useEffect(() => {
    localMap.map((item: any) => {
      if (item.id === idLocal) {
        setLat(Number(-item.latitude));
        setLng(Number(-item.longitude));
        setTitleLocal(item.name);
      } else {
        lat;
        lng;
      }
    });
  }, [idLocal]);

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Atualizar Ambiente</title>
      </Head>

      <Content contentHeader={tabsOperationMenu} moduloActive="config">
        <form
          className="
          w-full
          bg-white
          shadow-md
          rounded
          px-4
          pt-2
          pb-4
          mt-0
        "
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Informações do NPE</h1>
          </div>

          <div
            className="w-full
            flex
            justify-around
            gap-4
            mt-4
            mb-4
          "
          >
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Safra
              </label>
              <Input
                type="text"
                placeholder="Safra"
                id="safra"
                name="safra"
                onChange={formik.handleChange}
                value={formik.values.safra}
                disabled
                style={{ background: '#e5e7eb' }}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Local
              </label>
              <Input
                type="text"
                placeholder="Local"
                id="local"
                name="local"
                onChange={formik.handleChange}
                value={formik.values.local}
                disabled
                style={{ background: '#e5e7eb' }}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Status
              </label>
              <Input
                type="text"
                placeholder="1"
                id="status"
                name="status"
                onChange={formik.handleChange}
                value={
                  formik.values.status == 3
                    ? 'SORTEADO'
                    : formik.values.status == 1
                      ? 'IMPORTADO'
                      : 'INACTIVE'
                }
                disabled
                style={{ background: '#e5e7eb' }}
              />
            </div>
          </div>

          <div
            className="w-full
            flex
            justify-around
            gap-4
            mb-4
          "
          >
            <div className="w-1/2">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Foco
              </label>
              <Input
                type="text"
                placeholder="Foco"
                id="foco"
                name="foco"
                onChange={formik.handleChange}
                value={formik.values.foco}
                disabled
                style={{ background: '#e5e7eb' }}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Epoca
              </label>
              <Input
                type="number"
                placeholder="1"
                id="epoca"
                name="epoca"
                onChange={formik.handleChange}
                value={formik.values.epoca}
                disabled
                style={{ background: '#e5e7eb' }}
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Tipo de Ensaio
              </label>
              <Input
                type="text"
                placeholder="Type Assay"
                id="type_assay"
                name="type_assay"
                onChange={formik.handleChange}
                value={formik.values.type_assay}
                disabled
                style={{ background: '#e5e7eb' }}
              />
            </div>
            <div className="w-1/3">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Cod Tec.
              </label>
              <Input
                size={7}
                type="number"
                placeholder="10"
                id="cod_tec"
                name="cod_tec"
                onChange={formik.handleChange}
                value={formik.values.cod_tec}
                disabled
                style={{ background: '#e5e7eb' }}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Tecnologia
              </label>
              <Input
                type="text"
                placeholder="Tecnologia"
                id="tecnologia"
                name="tecnologia"
                onChange={formik.handleChange}
                value={formik.values.tecnologia}
                disabled
                style={{ background: '#e5e7eb' }}
              />
            </div>
          </div>

          <div
            className="w-full
              flex
              justify-around
              gap-4
              mb-4
            "
          >
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                NPE Inicial
              </label>
              <Input
                type="number"
                placeholder="1"
                id="npei"
                name="npei"
                onChange={formik.handleChange}
                value={formik.values.npei}
                disabled
                style={{ background: '#e5e7eb' }}
              />
            </div>
            {/* <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                NPE Final
              </label>
              <Input
                type="number"
                placeholder="1"
                id="npef"
                name="npef"
                onChange={formik.handleChange}
                value={formik.values.npef}
                disabled
                style={{ background: '#e5e7eb' }}
              />
            </div> */}
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Prox NPE
              </label>
              <Input
                type="number"
                placeholder="0"
                id="prox_npe"
                name="prox_npe"
                onChange={formik.handleChange}
                value={formik.values.prox_npe}
              />
            </div>
          </div>

          <div className="w-1/2 flex gap-4 mb-4" />

          <div
            className="
            h-7 w-full
            flex
            gap-3
            justify-center
            mt-4
          "
          >
            <div className="w-40">
              <Button
                type="button"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                onClick={() => {
                  setLoading(true);
                  router.back();
                }}
              />
            </div>
            <div className="w-40">
              <Button
                type="submit"
                value="Atualizar"
                bgColor="bg-blue-600"
                icon={<MdDateRange size={18} />}
                textColor="white"
                onClick={() => { setLoading(true); }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrlLayout = `${publicRuntimeConfig.apiUrl}/layout-quadra`;
  const baseUrlLocal = `${publicRuntimeConfig.apiUrl}/local`;
  const baseUrlNpe = `${publicRuntimeConfig.apiUrl}/npe`;

  const { token } = context.req.cookies;
  const idCulture = context.req.cookies.cultureId;
  const idSafra = context.req.cookies.safraId;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiLocal = await fetch(baseUrlLocal, requestOptions);
  const resU = await fetch(`${baseUrlLayout}/47`, requestOptions);
  const apiNpe = await fetch(
    `${baseUrlNpe}/${context.query.id}`,
    requestOptions,
  );

  const npe = await apiNpe.json();
  const layoultEdit = await resU.json();
  let local = await apiLocal.json();
  local = local.response;
  return {
    props: {
      local,
      layoultEdit,
      npe,
      idCulture,
      idSafra,
    },
  };
};
