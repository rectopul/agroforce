import { GetServerSideProps } from "next";
import { useFormik } from "formik";
import Head from "next/head";
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'
import { IoMdArrowBack } from "react-icons/io";
import { localService } from "src/services";
import { useEffect, ReactNode, useState } from "react";

import {
  TabHeader,
  Content,
  Input,
  Select,
  Button,
} from "../../../components";

import * as ITabs from '../../../shared/utils/dropdown';

interface ILocalProps {
  id: Number | any;
  name: String | any;
  pais: String | any;
  uf: String | any;
  city: String | any;
  address: String | any;
  latitude: String | any;
  longitude: String | any;
  altitude: String | any;
  created_by: Number;
  status: Number;
};

interface IUf {
  id: Number;
  npme: String;
  sigla: String;
}

interface ICity {
  id: Number;
  name: String;
  ufid: Number;
}

export interface IData {
  uf: Object | any;
  city: ICity;
}

export default function NovoLocal({ uf }: IData) {
  const { tmgDropDown, tabs } = ITabs.default;
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const ufs: object | any =  [];
  const [culturaSelecionada, setCulturaSelecionada] = useState<any>();
  const citys =  [{id: 'Campinas', name: "Campinas"}, {id: 'Santos', name: "Santos"}];
  const pais =  [{id: 'Brasil', name: "Brasil"}];
  const router = useRouter();
  const formik = useFormik<ILocalProps>({
    initialValues: {
      id: 1,
      name: '',
      pais: '',
      uf: '',
      city: '',
      address: '',
      latitude: '',
      longitude: '',
      altitude: '',
      created_by: userLogado.id,
      status: 1
    },
    onSubmit: (values) => {      
      validateInputs(values);
      if (!values.name || !values.pais || !values.uf || !values.city || !values.address || !values.latitude || !values.latitude || !values.altitude) { return; } 
  
      localService.create({
        name: values.name,
        pais: values.pais,
        uf: values.uf,
        city: values.city,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude,
        altitude: values.altitude,
        created_by: values.created_by,
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire('Local cadastrado com sucesso!')
          router.push('/config/local');
        } else {
          Swal.fire(response.message)
        }
      })
    },
  });

  uf.map((value: string | object | any) => {
    ufs.push({id: value.sigla, name: value.sigla, ufid: value.id});
  })

  function showCitys() {

  }

  function validateInputs(values: any) {
    if (!values.name) { let inputName: any = document.getElementById("name"); inputName.style.borderColor= 'red'; } else { let inputName: any = document.getElementById("name"); inputName.style.borderColor= ''; }
    if (!values.pais) { let inputPais: any = document.getElementById("pais"); inputPais.style.borderColor= 'red'; } else { let inputPais: any = document.getElementById("pais"); inputPais.style.borderColor= ''; }
    if (!values.uf) { let inputUf: any = document.getElementById("uf"); inputUf.style.borderColor= 'red'; } else { let inputUf: any = document.getElementById("uf"); inputUf.style.borderColor= ''; }
    if (!values.city) { let inputCity: any = document.getElementById("city"); inputCity.style.borderColor= 'red'; } else { let inputCity: any = document.getElementById("city"); inputCity.style.borderColor= ''; }
    if (!values.address) { let inputAddress: any = document.getElementById("address"); inputAddress.style.borderColor= 'red'; } else { let inputAddress: any = document.getElementById("address"); inputAddress.style.borderColor= ''; }
    if (!values.latitude) { let inputLatitude: any = document.getElementById("latitude"); inputLatitude.style.borderColor= 'red'; } else { let inputLatitude: any = document.getElementById("latitude"); inputLatitude.style.borderColor= ''; }
    if (!values.longitude) { let inputLongitude: any = document.getElementById("longitude"); inputLongitude.style.borderColor= 'red'; } else { let inputLongitude: any = document.getElementById("longitude"); inputLongitude.style.borderColor= ''; }
    if (!values.altitude) { let inputAltitude: any = document.getElementById("altitude"); inputAltitude.style.borderColor= 'red'; } else { let inputAltitude: any = document.getElementById("altitude"); inputAltitude.style.borderColor= ''; }
  }
  useEffect(() => {
}, [culturaSelecionada]);
  return (
    <>
      <Head>
        <title>Novo Local</title>
      </Head>


      <Content headerCotent={
        <TabHeader data={tabs} dataDropDowns={tmgDropDown} />
      }>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Novo usuário</h1>
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Código
              </label>
              <Input 
                type="text" 
                placeholder="11111"
                max="40"
                id="id"
                name="id"
                disabled
                readOnly
                onChange={formik.handleChange}
                value={formik.values.id}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Nome do Local
              </label>
              <Input 
                type="name" 
                placeholder="TMG-Agroforce" 
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Pais
              </label>
              <Select
                values={pais}
                id="pais"
                name="pais"
                onChange={formik.handleChange}
                value={formik.values.pais}
                selected={1}
              />
            </div>
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mb-4
          ">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Estado
              </label>
              <Select
                values={ufs}
                id="uf"
                name="uf"
                onChange={formik.handleChange}
                onBlur={e => setCulturaSelecionada(e.target.value)}
                value={formik.values.uf}
                selected={false}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Município
              </label>
              <Select
                values={citys}
                id="city"
                name="city"
                onChange={formik.handleChange}
                value={formik.values.city}
                selected={false}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Endereço
              </label>
              <Input 
                type="text" 
                placeholder="R: São Paulo"
                id="address"
                name="address"
                onChange={formik.handleChange}
                value={formik.values.address}
              />
            </div>
          </div>

          <div className="w-full
            flex
            justify-between
            gap-6
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Latitude
              </label>
              <Input 
                type="text" 
                placeholder="20 10 15"
                id="latitude"
                name="latitude"
                onChange={formik.handleChange}
                value={formik.values.latitude}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Longitude
              </label>
              <Input 
                type="text" 
                placeholder="20 10 30"
                id="longitude"
                name="longitude"
                onChange={formik.handleChange}
                value={formik.values.longitude}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Altitude
              </label>
              <Input 
                type="text" 
                placeholder="10 15 25"
                id="altitude"
                name="altitude"
                onChange={formik.handleChange}
                value={formik.values.altitude}
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
                type="submit"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                onClick={() => {router.push('/config/tmg/usuarios/')}}
              />
            </div>
            <div className="w-40">
              <Button 
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                onClick={() => {}}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}

export const getServerSideProps:GetServerSideProps = async ({req}) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/local`;
  const  token  =  req.cookies.token;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };

  const apiUF = await fetch(`${baseUrl}/uf`, requestOptions);

  const uf = await apiUF.json();
  return { props: { uf } }
}


