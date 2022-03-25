import Head from 'next/head';
import { useFormik } from 'formik'
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Swal from 'sweetalert2';

import { focoService } from 'src/services/foco.service';

import { 
  Button,
  Content, 
  Input,
  TabHeader 
} from "../../../../components";

import  * as ITabs from '../../../../shared/utils/dropdown';
import { IoMdArrowBack } from 'react-icons/io';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { useState } from 'react';

export interface IUpdateFoco {
  id: number;
  name: string;
  status: number;
  created_by: number;
}

export default function Atualizar(foco: IUpdateFoco) {
  const { ensaiosDropDown, tabs } = ITabs.default;
  
  tabs.map((tab) => (
    tab.title === 'ENSAIO'
    ? tab.status = true
    : tab.status = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const optionStatus =  [{id: 1, name: "Ativo"}, {id: 0, name: "Inativo"}];

  const formik = useFormik<IUpdateFoco>({
    initialValues: {
      id: foco.id,
      name: foco.name,
      status: foco.status,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      await focoService.update({
        id: foco.id,
        name: formik.values.name,
        status: foco.status,
        created_by: foco.created_by,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Foco cadastrado com sucesso!');
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
      
      <Content
        headerCotent={
          <TabHeader data={tabs} dataDropDowns={ensaiosDropDown} />
        }
      >

      <form 
        className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"

        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl">Atualizar foco</h1>

        <div className="w-full
          flex 
          justify-around
          gap-2
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

          <div className="w-full h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              <strong className={checkInput}>*</strong>
              Nome
            </label>
            <Input
              id="name"
              name="name"
              type="text" 
              max="50" 
              placeholder="ex: Soja"
              onChange={formik.handleChange}
              value={formik.values.name}
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
