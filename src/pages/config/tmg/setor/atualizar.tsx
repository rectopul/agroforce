import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { MdDateRange } from "react-icons/md";

import { departmentService } from "src/services";

import { 
  Button, 
  Content, 
  Input, 
  Radio,
  TabHeader 
} from "src/components";
import Swal from "sweetalert2";
import * as ITabs from '../../../../shared/utils/dropdown';

interface IDepartmentProps {
  id: number;
  name: string;
};

export default function AtualizarSafra(item: IDepartmentProps) {
  const { tmgDropDown, tabs } = ITabs.default;

  tabs.map((tab) => (
    tab.title === 'TMG'
    ? tab.status = true
    : tab.status = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  // const [checkeBox, setCheckeBox] = useState<boolean>();
  // const select = [
  //   { id: 1, name: "Ativo" },
  //   { id: 2, name: "Inativo" },
  // ];
  
  // const userLogado = JSON.parse(localStorage.getItem("user") as string);

  const formik = useFormik<IDepartmentProps>({
    initialValues: {
      id: item.id,
      name: item.name
    },
    onSubmit: async (values) => {
      if (values.id !== item.id) throw new Error("Dados inválidos");

      await departmentService.update({
        id: item.id,
        name: formik.values.name,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Safra atualizada com sucesso!');
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
      <Head><title>Atualizar setor</title></Head>
      <Content headerCotent={
        <TabHeader data={tabs} dataDropDowns={tmgDropDown} />
      }>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar setor</h1>

          <div className="w-full flex gap-5 mt-4">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Código
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                required
                disabled
                id="id"
                name="id"
                value={formik.values.id}
              />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Nome
              </label>
              <Input
                type="text"
                required
                id="name"
                name="name"
                maxLength={50}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
          </div>

          <div className="h-10 w-full
            flex
            gap-3
            justify-center
            mt-12
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
                value="Atualizar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<MdDateRange size={18} />}
                onClick={() => {}}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
};

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrlList = `${publicRuntimeConfig.apiUrl}/department`;
  const  token  =  context.req.cookies.token;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };

  const apiItem = await fetch(`${baseUrlList}/` + context.query.id, requestOptions);

  const item = await apiItem.json();

  return { props: item  }
}
