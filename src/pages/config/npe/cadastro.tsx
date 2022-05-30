import { GetServerSideProps } from "next";
import Head from "next/head";
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useJsApiLoader } from '@react-google-maps/api';
import Swal from 'sweetalert2'

import { layoutQuadraService } from "src/services";

import {
  Content,
  Input,
  Select,
  Button,
} from "../../../components";

import * as ITabs from '../../../shared/utils/dropdown';
import { IoMdArrowBack } from "react-icons/io";
import { FiUserPlus } from "react-icons/fi";

interface ILayoultProps {
  id: Number | any;
  esquema: String | any;
  op: String | any;
  semente_metros: Number | any;
  disparos: Number | any;
  divisor: Number | any;
  largura: Number | any;
  comp_fisico: Number | any;
  comp_parcela: Number | any;
  comp_corredor: Number | any;
  t4_inicial: Number | any;
  t4_final: Number | any;
  df_inicial: Number | any;
  df_final: Number | any;
  localId: Number | any;
  created_by: number | any;
  status: Number;
};
export interface IData {
  local: object | any;
}

interface ILocal {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  status: number;
}

export default function NovoNPE({ local }: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'QUADRAS'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const [localMap, setIdLocalMap] = useState<ILocal[]>(() => local);
  const [idLocal, setIdLocal] = useState<number>(0);
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

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const locais: object | any = [];
  const router = useRouter();
  const formik = useFormik<ILayoultProps>({
    initialValues: {
      id: 1,
      esquema: '',
      op: '',
      semente_metros: '',
      disparos: '',
      divisor: '',
      largura: '',
      comp_fisico: '',
      comp_parcela: '',
      comp_corredor: '',
      t4_inicial: '',
      t4_final: '',
      df_inicial: '',
      df_final: '',
      localId: '',
      created_by: userLogado.id,
      status: 1
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!idLocal) { let inputlocalId: any = document.getElementById("localId"); inputlocalId.style.borderColor = 'red'; } else { let inputlocalId: any = document.getElementById("localId"); inputlocalId.style.borderColor = ''; }
      if (!values.esquema || !values.op || !values.semente_metros || !values.disparos || !values.divisor || !values.largura || !values.comp_fisico || !values.comp_parcela || !values.comp_corredor || !values.t4_inicial || !values.t4_final || !values.df_inicial || !values.df_final || !idLocal) { return; }

      await layoutQuadraService.create({
        esquema:values.esquema,
        op:values.op,
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
        status: 1
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Layout Quadra cadastrado com sucesso!')
          router.back()
        } else {
          Swal.fire(response.message)
        }
      })
    },
  });

  local.map((value: string | object | any) => {
    locais.push({ id: value.id, name: value.name });
  })

  function validateInputs(values: any) {
    if (!values.esquema) { let inputesquema: any = document.getElementById("esquema"); inputesquema.style.borderColor = 'red'; } else { let inputesquema: any = document.getElementById("esquema"); inputesquema.style.borderColor = ''; }
    if (!values.op) { let inputop: any = document.getElementById("op"); inputop.style.borderColor = 'red'; } else { let inputop: any = document.getElementById("op"); inputop.style.borderColor = ''; }
    if (!values.semente_metros) { let inputsemente_metros: any = document.getElementById("semente_metros"); inputsemente_metros.style.borderColor = 'red'; } else { let inputsemente_metros: any = document.getElementById("semente_metros"); inputsemente_metros.style.borderColor = ''; }
    if (!values.disparos) { let inputdisparos: any = document.getElementById("disparos"); inputdisparos.style.borderColor = 'red'; } else { let inputdisparos: any = document.getElementById("disparos"); inputdisparos.style.borderColor = ''; }
    if (!values.divisor) { let inputdivisor: any = document.getElementById("divisor"); inputdivisor.style.borderColor = 'red'; } else { let inputdivisor: any = document.getElementById("divisor"); inputdivisor.style.borderColor = ''; }
    if (!values.largura) { let inputlargura: any = document.getElementById("largura"); inputlargura.style.borderColor = 'red'; } else { let inputlargura: any = document.getElementById("largura"); inputlargura.style.borderColor = ''; }
    if (!values.comp_fisico) { let inputcomp_fisico: any = document.getElementById("comp_fisico"); inputcomp_fisico.style.borderColor = 'red'; } else { let inputcomp_fisico: any = document.getElementById("comp_fisico"); inputcomp_fisico.style.borderColor = ''; }
    if (!values.comp_parcela) { let inputcomp_parcela: any = document.getElementById("comp_parcela"); inputcomp_parcela.style.borderColor = 'red'; } else { let inputcomp_parcela: any = document.getElementById("comp_parcela"); inputcomp_parcela.style.borderColor = ''; }
    if (!values.comp_corredor) { let inputcomp_corredor: any = document.getElementById("comp_corredor"); inputcomp_corredor.style.borderColor = 'red'; } else { let inputcomp_corredor: any = document.getElementById("comp_corredor"); inputcomp_corredor.style.borderColor = ''; }
    if (!values.t4_inicial) { let inputt4_inicial: any = document.getElementById("t4_inicial"); inputt4_inicial.style.borderColor = 'red'; } else { let inputt4_inicial: any = document.getElementById("t4_inicial"); inputt4_inicial.style.borderColor = ''; }
    if (!values.t4_final) { let inputt4_final: any = document.getElementById("t4_final"); inputt4_final.style.borderColor = 'red'; } else { let inputt4_final: any = document.getElementById("t4_final"); inputt4_final.style.borderColor = ''; }
    if (!values.df_inicial) { let inputdf_inicial: any = document.getElementById("df_inicial"); inputdf_inicial.style.borderColor = 'red'; } else { let inputdf_inicial: any = document.getElementById("df_inicial"); inputdf_inicial.style.borderColor = ''; }
    if (!values.df_final) { let inputdf_final: any = document.getElementById("df_final"); inputdf_final.style.borderColor = 'red'; } else { let inputdf_final: any = document.getElementById("df_final"); inputdf_final.style.borderColor = ''; }
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
    })
  }, [idLocal]);

  return (
    <>
      <Head>
        <title>Novo NPE</title>
      </Head>

      <Content contentHeader={tabsDropDowns}>
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
            <h1 className="text-2xl">Novo NPE</h1>
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
          ">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Local
              </label>
              <Select
                values={locais}
                id="localId"
                name="localId"
                onChange={(e) => setIdLocal(parseInt(e.target.value))}
                value={idLocal}
                selected={idLocal}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Safra
              </label>
              <Select
                values={locais}
                id="localId"
                name="localId"
                onChange={(e) => setIdLocal(parseInt(e.target.value))}
                value={idLocal}
                selected={idLocal}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Foco
              </label>
              <Select
                values={locais}
                id="localId"
                name="localId"
                onChange={(e) => setIdLocal(parseInt(e.target.value))}
                value={idLocal}
                selected={idLocal}
              />
            </div>
          </div>
          <div className="w-full
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
          ">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Tipo Ensaio
              </label>
              <Select
                values={locais}
                id="localId"
                name="localId"
                onChange={(e) => setIdLocal(parseInt(e.target.value))}
                value={idLocal}
                selected={idLocal}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *OGM
              </label>
              <Select
                values={locais}
                id="localId"
                name="localId"
                onChange={(e) => setIdLocal(parseInt(e.target.value))}
                value={idLocal}
                selected={idLocal}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Época
              </label>
              <Select
                values={locais}
                id="localId"
                name="localId"
                onChange={(e) => setIdLocal(parseInt(e.target.value))}
                value={idLocal}
                selected={idLocal}
              />
            </div>
          </div>
          <div className="
            h-10 w-full
            flex
            gap-3
            justify-center
            mt-10
          ">
            <div className="w-30">
              <Button
                type="button"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                onClick={() => { router.back(); }}
                icon={<IoMdArrowBack size={18} />}
              />
            </div>
            <div className="w-40">
              <Button
                type="submit"
                value="Cadastrar"
                icon={<FiUserPlus size={18} />}
                bgColor="bg-blue-600"
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { publicRuntimeConfig } = getConfig();
  const token = req.cookies.token;
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  };

  const baseUrlLocal = `${publicRuntimeConfig.apiUrl}/local`;
  const param = `filterStatus=1`;
  const urlParameters: any = new URL(baseUrlLocal);
  urlParameters.search = new URLSearchParams(param).toString();

  const apiLocal = await fetch(urlParameters.toString(), requestOptions);
  const apiSafra = await fetch(`${publicRuntimeConfig.apiUrl}/safra`, requestOptions);

  let local = (await apiLocal.json()).response;
  let safras = (await apiSafra.json()).response;
  return { props: { local } }
}


