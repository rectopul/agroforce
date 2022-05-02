import { capitalize } from "@mui/material";
import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Head from "next/head";
import { useRouter } from 'next/router';
import { IoMdArrowBack } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { tecnologiaService } from "src/services";
import Swal from 'sweetalert2';
import {
  Button, Content,
  Input
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';

interface ITecnologiaProps {
  id: number;
  name: string;
  created_by: number;
  status: number;
};

interface IData {
  tecnologia: ITecnologiaProps;
}

export default function NovoLocal({tecnologia}: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
    ? tab.statusTab = true
    : tab.statusTab = false
  ));
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const router = useRouter();
  const formik = useFormik<ITecnologiaProps>({
    initialValues: {
      id: tecnologia.id,
      name: capitalize(tecnologia.name),
      created_by: userLogado.id,
      status: 1
    },
    onSubmit: async (values) => {      
      validateInputs(values);
      if (!values.name)  { return; } 

      await tecnologiaService.update({
        id: values.id,
        name:values.name,
        created_by: Number(userLogado.id),
        status: 1
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire('Tecnologia atualizada com sucesso!');
          router.back();
        } else {
          Swal.fire(response.message);
        }
      })
    },
  });

  function validateInputs(values: any) {
    if (!values.name) { let inputname: any = document.getElementById("name"); inputname.style.borderColor= 'red'; } else { let inputname: any = document.getElementById("name"); inputname.style.borderColor= ''; }
  }

    return (
    <>
      <Head>
        <title>Atualizar tecnologia</title>
      </Head>

      <Content contentHeader={tabsDropDowns}>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Atualizar tecnologia</h1>
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
                id="id"
                style={{ background: '#e5e7eb' }}
                name="id"
                disabled
                onChange={formik.handleChange}
                value={formik.values.id}
              />
            </div> 
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Nome
              </label>
              <Input 
                type="text" 
                placeholder="Nome" 
                id="name"
                name="name"
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
                onClick={() => {router.back();}}
              />
            </div>
            <div className="w-40">
              <Button 
                type="submit"
                value="Atualizar"
                bgColor="bg-blue-600"
                icon={<MdDateRange size={18} />}
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


export const getServerSideProps:GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/tecnologia`;
  const  token  =  context.req.cookies.token;
  
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };

  const resU = await fetch(`${baseUrl}/` + context.query.id, requestOptions)

  const tecnologia = await resU.json();

  return { props: { tecnologia  } }
}