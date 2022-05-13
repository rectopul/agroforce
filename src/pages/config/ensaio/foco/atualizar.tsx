import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { IoMdArrowBack } from 'react-icons/io';
import { focoService } from 'src/services/foco.service';
import Swal from 'sweetalert2';
import {
  Button,
  Content,
  Input,
  Select
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';




export interface IUpdateFoco {
  id: number;
  name: string;
  status: number;
  group: number;
  created_by: number;
}

export default function Atualizar(foco: IUpdateFoco) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
    ? tab.statusTab = true
    : tab.statusTab = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;
  const grupos =  [
    {id: 1, name: "Grupo 1"},
    {id: 2, name: "Grupo 2"},
    {id: 3, name: "Grupo 3"},
    {id: 4, name: "Grupo 4"},
    {id: 5, name: "Grupo 5"},
    {id: 6, name: "Grupo 6"},
    {id: 7, name: "Grupo 7"}
  ];

  const formik = useFormik<IUpdateFoco>({
    initialValues: {
      id: foco.id,
      name: foco.name,
      group: foco.group,
      status: foco.status,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      await focoService.update({
        id: foco.id,
        name: capitalize(formik.values.name),
        id_culture: parseInt(culture),
        group: Number(values.group),
        status: foco.status,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Foco atualizado com sucesso!');
          router.back();
        } else {
          setCheckInput("text-red-600");
          Swal.fire(response.message);
        }
      });
    },
  });

  return (
    <>
     <Head>
        <title>Atualizar foco</title>
      </Head>
      
      <Content contentHeader={tabsDropDowns}>
      <form 
        className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"

        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl">Atualizar foco</h1>

        <div className="w-1/2
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
        ">
          <div className="w-full">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              <strong className={checkInput}>*</strong>
              Código
            </label>
            <Input value={foco.id} disabled style={{ background: '#e5e7eb' }} />
          </div>

          <div className="w-full">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              <strong className={checkInput}>*</strong>
              Nome
            </label>
            <Input
              id="name"
              name="name"
              type="text" 
              max="50" 
              placeholder="foco"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </div>
          <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                  *Grupos
              </label>
              <Select
                  values={grupos}
                  id="group"
                  name="group"
                  // required
                  onChange={formik.handleChange}
                  value={formik.values.group}
                  selected={false}
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
                icon={<IoMdArrowBack size={18} />}
                onClick={() => router.back()}
              />
            </div>
            <div className="w-40">
              <Button
                type="submit"
                value="Atualizar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<AiOutlineFileSearch size={20} />}
                onClick={() => {}}
              />
            </div>
          </div>
      </form>
      </Content>
    </>
  );
}

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/foco`;
  const  token  =  context.req.cookies.token;
  
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };

  const apiFoco = await fetch(`${baseUrlShow}/` + context.query.id, requestOptions);

  const foco = await apiFoco.json();

  return { props: foco }
}
