import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { IoMdArrowBack } from 'react-icons/io';
import InputMask from "react-input-mask";
import { grupoService } from 'src/services/grupo.service';
import Swal from 'sweetalert2';
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import {
  Button,
  Content,
  Select,
  Input
} from "../../../../../components";
import * as ITabs from '../../../../../shared/utils/dropdown';

interface ICreateFoco {
  safra: string;
  group: number;
  id_foco: number;
  created_by: number;
}

export default function Cadastro({ grupo }: any) {
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
  const grupos = [
    { id: 1, name: "Grupo 1" },
    { id: 2, name: "Grupo 2" },
    { id: 3, name: "Grupo 3" },
    { id: 4, name: "Grupo 4" },
    { id: 5, name: "Grupo 5" },
    { id: 6, name: "Grupo 6" },
    { id: 7, name: "Grupo 7" }
  ];

  const formik = useFormik<any>({
    initialValues: {
      id_foco: parseInt(grupo.foco.id),
      safra: grupo.safra.id,
      group: grupo.grupo,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      await grupoService.update({
        id: Number(grupo.id),
        id_safra: Number(grupo.safra.id),
        id_foco: parseInt(grupo.foco.id),
        grupo: Number(values.group),
        created_by: Number(formik.values.created_by),
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Grupo atualizado com sucesso!');
          router.back();
        } else {
          setCheckInput("text-red-600");
          Swal.fire(response.message)
        }
      }).finally(() => {
        formik.values.safra = '';
      });
    },
  });

  return (
    <>
      <Head>
        <title>Novo</title>
      </Head>

      <Content contentHeader={tabsDropDowns}>
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"

          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Novo</h1>

          <div className="w-1/2
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
        ">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Safra
              </label>
              <Input
                id="safra"
                style={{ background: '#e5e7eb' }}
                name="safra"
                type="text"
                disabled
                max="50"
                value={grupo.safra.safraName}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Grupos
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
                mask={'99'}
                id="group"
                name="group"
                required
                onChange={formik.handleChange}
                value={formik.values.group}
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
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<AiOutlineFileSearch size={20} />}
                onClick={() => { }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/grupo`;
  const token = context.req.cookies.token;
  const id_grupo = context.query.id;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  };

  const apiGrupo = await fetch(`${baseUrlShow}/` + id_grupo, requestOptions);

  const grupo = await apiGrupo.json();
  console.log(grupo);
  return {
    props: {
      grupo
    }
  }
}

