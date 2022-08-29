import { GetServerSideProps } from 'next';
import { useFormik } from 'formik';
import Head from 'next/head';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import Swal from 'sweetalert2';
import { layoutQuadraService } from 'src/services';
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

interface ILocal {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  status: number;
}

export interface IData {
  local: object | any;
  layoultEdit: ILayoultProps;
}

export default function NovoLocal({ local, layoultEdit }: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'QUADRAS'
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
  const formik = useFormik<ILayoultProps>({
    initialValues: {
      id: layoultEdit.id,
      esquema: layoultEdit.esquema,
      op: layoultEdit.op,
      semente_metros: layoultEdit.semente_metros,
      disparos: layoultEdit.disparos,
      divisor: layoultEdit.divisor,
      largura: layoultEdit.largura,
      comp_fisico: layoultEdit.comp_fisico,
      comp_parcela: layoultEdit.comp_parcela,
      comp_corredor: layoultEdit.comp_corredor,
      t4_inicial: layoultEdit.t4_inicial,
      t4_final: layoultEdit.t4_final,
      df_inicial: layoultEdit.df_inicial,
      df_final: layoultEdit.df_final,
      localId: layoultEdit.localId,
      created_by: userLogado.id,
      status: 1,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.esquema || !values.op || !values.semente_metros || !values.disparos || !values.divisor || !values.largura || !values.comp_fisico || !values.comp_parcela || !values.comp_corredor || !values.t4_inicial || !values.t4_final || !values.df_inicial || !values.df_final || !idLocal) { return; }

      await layoutQuadraService.update({
        id: values.id,
        esquema: values.esquema,
        op: values.op,
        semente_metros: Number(values.semente_metros),
        disparos: Number(values.disparos),
        divisor: Number(values.divisor),
        largura: values.largura,
        comp_fisico: values.comp_fisico,
        comp_parcela: values.comp_parcela,
        comp_corredor: values.comp_corredor,
        t4_inicial: Number(values.t4_inicial),
        t4_final: Number(values.t4_final),
        df_inicial: Number(values.df_inicial),
        df_final: Number(values.df_final),
        localId: idLocal,
        created_by: Number(userLogado.id),
        status: 1,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Layout quadra atualizado com sucesso!');
          router.back();
        } else {
          Swal.fire(response.message);
        }
      });
    },
  });

  local.map((value: string | object | any) => {
    locais.push({ id: value.id, name: value.name });
  });

  function validateInputs(values: any) {
    if (!values.esquema) { const inputesquema: any = document.getElementById('esquema'); inputesquema.style.borderColor = 'red'; } else { const inputesquema: any = document.getElementById('esquema'); inputesquema.style.borderColor = ''; }
    if (!values.op) { const inputop: any = document.getElementById('op'); inputop.style.borderColor = 'red'; } else { const inputop: any = document.getElementById('op'); inputop.style.borderColor = ''; }
    if (!values.localId) { const inputlocalId: any = document.getElementById('localId'); inputlocalId.style.borderColor = 'red'; } else { const inputlocalId: any = document.getElementById('localId'); inputlocalId.style.borderColor = ''; }
    if (!values.semente_metros) { const inputsemente_metros: any = document.getElementById('semente_metros'); inputsemente_metros.style.borderColor = 'red'; } else { const inputsemente_metros: any = document.getElementById('semente_metros'); inputsemente_metros.style.borderColor = ''; }
    if (!values.disparos) { const inputdisparos: any = document.getElementById('disparos'); inputdisparos.style.borderColor = 'red'; } else { const inputdisparos: any = document.getElementById('disparos'); inputdisparos.style.borderColor = ''; }
    if (!values.divisor) { const inputdivisor: any = document.getElementById('divisor'); inputdivisor.style.borderColor = 'red'; } else { const inputdivisor: any = document.getElementById('divisor'); inputdivisor.style.borderColor = ''; }
    if (!values.largura) { const inputlargura: any = document.getElementById('largura'); inputlargura.style.borderColor = 'red'; } else { const inputlargura: any = document.getElementById('largura'); inputlargura.style.borderColor = ''; }
    if (!values.comp_fisico) { const inputcomp_fisico: any = document.getElementById('comp_fisico'); inputcomp_fisico.style.borderColor = 'red'; } else { const inputcomp_fisico: any = document.getElementById('comp_fisico'); inputcomp_fisico.style.borderColor = ''; }
    if (!values.comp_parcela) { const inputcomp_parcela: any = document.getElementById('comp_parcela'); inputcomp_parcela.style.borderColor = 'red'; } else { const inputcomp_parcela: any = document.getElementById('comp_parcela'); inputcomp_parcela.style.borderColor = ''; }
    if (!values.comp_corredor) { const inputcomp_corredor: any = document.getElementById('comp_corredor'); inputcomp_corredor.style.borderColor = 'red'; } else { const inputcomp_corredor: any = document.getElementById('comp_corredor'); inputcomp_corredor.style.borderColor = ''; }
    if (!values.t4_inicial) { const inputt4_inicial: any = document.getElementById('t4_inicial'); inputt4_inicial.style.borderColor = 'red'; } else { const inputt4_inicial: any = document.getElementById('t4_inicial'); inputt4_inicial.style.borderColor = ''; }
    if (!values.t4_final) { const inputt4_final: any = document.getElementById('t4_final'); inputt4_final.style.borderColor = 'red'; } else { const inputt4_final: any = document.getElementById('t4_final'); inputt4_final.style.borderColor = ''; }
    if (!values.df_inicial) { const inputdf_inicial: any = document.getElementById('df_inicial'); inputdf_inicial.style.borderColor = 'red'; } else { const inputdf_inicial: any = document.getElementById('df_inicial'); inputdf_inicial.style.borderColor = ''; }
    if (!values.df_final) { const inputdf_final: any = document.getElementById('df_final'); inputdf_final.style.borderColor = 'red'; } else { const inputdf_final: any = document.getElementById('df_final'); inputdf_final.style.borderColor = ''; }
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
          overflow-y-scroll
        "
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Novo Layout</h1>
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
                *Esquema
              </label>
              <Input
                type="text"
                placeholder="14x08(p4)-PY"
                id="esquema"
                name="esquema"
                onChange={formik.handleChange}
                value={formik.values.esquema}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *OP
              </label>
              <Input
                type="text"
                placeholder="QMCG-01"
                id="op"
                name="op"
                onChange={formik.handleChange}
                value={formik.values.op}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Local
              </label>
              <Select
                values={locais}
                id="localId"
                name="localId"
                onChange={(e) => setIdLocal(Number(e.target.value))}
                value={idLocal}
                selected={idLocal}
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
                *Sementes por Metros
              </label>
              <Input
                type="number"
                placeholder="10"
                id="semente_metros"
                name="semente_metros"
                onChange={formik.handleChange}
                value={formik.values.semente_metros}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Disparos
              </label>
              <Input
                type="text"
                placeholder="1"
                id="disparos"
                name="disparos"
                onChange={formik.handleChange}
                value={formik.values.disparos}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Divisor
              </label>
              <Input
                type="text"
                placeholder="1"
                id="divisor"
                name="divisor"
                onChange={formik.handleChange}
                value={formik.values.divisor}
              />
            </div>
          </div>

          <div className="w-full
            flex
            justify-between
            gap-6
            mb-4
          "
          >
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Largura
              </label>
              <InputMask
                className="shadow
                 appearance-none
                 bg-white bg-no-repeat
                 border border-solid border-gray-300
                 rounded
                 w-full
                 py-2 px-3
                 text-gray-900
                 leading-tight
                 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
               "
                mask="99.99"
                type="text"
                placeholder="25.2"
                id="largura"
                name="largura"
                onChange={formik.handleChange}
                value={formik.values.largura}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Comp. Físico
              </label>
              <InputMask
                className="shadow
                 appearance-none
                 bg-white bg-no-repeat
                 border border-solid border-gray-300
                 rounded
                 w-full
                 py-2 px-3
                 text-gray-900
                 leading-tight
                 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
               "
                mask="99.99"
                type="text"
                placeholder="25.2"
                id="comp_fisico"
                name="comp_fisico"
                onChange={formik.handleChange}
                value={formik.values.comp_fisico}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Comp. da Parcela
              </label>
              <InputMask
                className="shadow
                 appearance-none
                 bg-white bg-no-repeat
                 border border-solid border-gray-300
                 rounded
                 w-full
                 py-2 px-3
                 text-gray-900
                 leading-tight
                 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
               "
                mask="99.99"
                type="text"
                placeholder="25.2"
                id="comp_parcela"
                name="comp_parcela"
                onChange={formik.handleChange}
                value={formik.values.comp_parcela}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Comp. Corredor
              </label>
              <InputMask
                className="shadow
                 appearance-none
                 bg-white bg-no-repeat
                 border border-solid border-gray-300
                 rounded
                 w-full
                 py-2 px-3
                 text-gray-900
                 leading-tight
                 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
               "
                mask="99.99"
                type="text"
                placeholder="25.2"
                id="comp_corredor"
                name="comp_corredor"
                onChange={formik.handleChange}
                value={formik.values.comp_corredor}
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
                *T4 Inicial
              </label>
              <Input
                type="number"
                placeholder="10"
                id="t4_inicial"
                name="t4_inicial"
                onChange={formik.handleChange}
                value={formik.values.t4_inicial}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *T4 Final
              </label>
              <Input
                type="text"
                placeholder="1"
                id="t4_final"
                name="t4_final"
                onChange={formik.handleChange}
                value={formik.values.t4_final}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *DF Inicial
              </label>
              <Input
                type="text"
                placeholder="1"
                id="df_inicial"
                name="df_inicial"
                onChange={formik.handleChange}
                value={formik.values.df_inicial}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *DF Final
              </label>
              <Input
                type="text"
                placeholder="1"
                id="df_final"
                name="df_final"
                onChange={formik.handleChange}
                value={formik.values.df_final}
              />
            </div>
          </div>

          <div className="
            w-full
            h-4/6
            my-4
            mt-10
          "
          >
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 7,
                  color: '#fff',
                }}
                center={position}
                zoom={17}
              // onLoad={onLoad}
              // onUnmount={onUnmount}
              >
                <Marker
                  position={position}
                  options={{
                    label: {
                      text: titleLocal,
                      className: 'mb-14 text-gray-50',
                    },
                  }}
                />
              </GoogleMap>
            ) : <></>}
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
  const baseUrlLayoult = `${publicRuntimeConfig.apiUrl}/layoult-quadra`;
  const baseUrlLocal = `${publicRuntimeConfig.apiUrl}/local`;

  const { token } = context.req.cookies;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiLocal = await fetch(baseUrlLocal, requestOptions);
  const resU = await fetch(`${baseUrlLayoult}/${context.query.id}`, requestOptions);

  const layoultEdit = await resU.json();
  let local = await apiLocal.json();
  local = local.response;
  return { props: { local, layoultEdit } };
};
