import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useFormik } from 'formik';
import Head from 'next/head';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import { experimentGenotipeService, layoutQuadraService, npeService } from 'src/services';
import InputMask from 'react-input-mask';

import { IoMdArrowBack } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';
import {
  Content,
  Input,
  Select,
  Button,
} from '../../../components';

import * as ITabs from '../../../shared/utils/dropdown';
import npe from 'src/pages/api/npe';

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
    }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'NPE'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const [localMap, setIdLocalMap] = useState<ILocal[]>(() => local);
  const [idLocal, setIdLocal] = useState<number>(layoultEdit.localId);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [titleLocal, setTitleLocal] = useState<string>('');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD2fT6h_lQHgdj4_TgbwV6uDfZ23Hj0vKg',
  });

  const position = {
    lat,
    lng,
  };

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const locais: object | any = [];
  const router = useRouter();
  const formik = useFormik<INpeProps>({
    initialValues: {
      id: npe.id,
      safra: npe.safra.safraName,
      local: npe.local.name_local_culture,
      foco: npe.foco.name,
      epoca: Number(npe.epoca),
      tecnologia: npe.tecnologia.name,
      cod_tec: npe.tecnologia.cod_tec,
      type_assay: npe.type_assay.name,
      npei: Number(npe.npei),
      npef: Number(npe.npef),
      status: Number(npe.status),
      prox_npe: Number(npe.prox_npe),
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.prox_npe) { return; }

      const parametersFilter = `filterStatus=1&npei=${values.prox_npe}`;
      await npeService.getAll(parametersFilter).then(async (response) => {
        if (response.total <= 0) {
          const paramFilter = `npe=${values.prox_npe}`;
          await experimentGenotipeService.getAll(paramFilter).then(async (response) => {
            if (response.total <= 0) {
              await npeService.update({
                id: values.id,
                prox_npe: values.prox_npe,
                npef: values.prox_npe,
                edited: 1,
              }).then((response) => {
                if (response.status === 200) {
                  Swal.fire('NPE atualizado com sucesso!');
                  router.back();
                } else {
                  Swal.fire(response.message);
                }
              });
            }
          })
        } else {
          Swal.fire('Unable to update prox npe')
        }
      });
    },
  });

  local.map((value: string | object | any) => {
    locais.push({ id: value.id, name: value.name });
  });

  function validateInputs(values: any) {
    if (!values.prox_npe) { const inputesquema: any = document.getElementById('prox_npe'); inputesquema.style.borderColor = 'red'; } else { const inputesquema: any = document.getElementById('prox_npe'); inputesquema.style.borderColor = ''; }
  }

  useEffect(() => {
    localMap.map((item) => {
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
      <Head>
        <title>Atualizar Layout Quadra</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="
          w-full
          h-full
          bg-white
          shadow-md
          rounded
          px-8
          pt-6
          pb-8
          mt-2
        "
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Informações do NPE</h1>
          </div>

          <div className="w-full
            flex
            justify-around
            gap-6
            mt-4
            mb-4
          "
          >
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
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
              <label className="block text-gray-900 text-sm font-bold mb-2">
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
          </div>

          <div className="w-full
            flex
            justify-around
            gap-6
            mb-4
          "
          >
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
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
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
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
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
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

          <div className="w-full
              flex
              justify-around
              gap-6
              mb-4
            "
          >
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Cod Tec.
              </label>
              <Input
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
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Type Assay
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
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
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
            <div className="w-full">
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
            </div>
          </div>

          <div className="w-full
              flex
              justify-around
              gap-6
              mb-4
            "
          >
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Status
              </label>
              <Input
                type="text"
                placeholder="1"
                id="status"
                name="status"
                onChange={formik.handleChange}
                value={formik.values.status == 3 ? 'SORTEADO' : (formik.values.status == 1 ? 'IMPORTADO' : 'INACTIVE')}
                disabled
                style={{ background: '#e5e7eb' }}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
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

          <div className="
            h-7 w-full
            flex
            gap-3
            justify-center
            mt-10
          "
          >
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
            <div className="w-40">
              <Button
                type="submit"
                value="Atualizar"
                bgColor="bg-blue-600"
                icon={<MdDateRange size={18} />}
                textColor="white"
                onClick={() => { }}
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

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiLocal = await fetch(baseUrlLocal, requestOptions);
  const resU = await fetch(`${baseUrlLayout}/47`, requestOptions);
  const apiNpe = await fetch(`${baseUrlNpe}/${context.query.id}`, requestOptions);

  const npe = await apiNpe.json();
  const layoultEdit = await resU.json();
  let local = await apiLocal.json();
  local = local.response;
  return { props: { local, layoultEdit, npe } };
};
