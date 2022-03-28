import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'
import { typeAssayService } from "src/services";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';

import {
  Content,
  Input,
  Button,
} from "../../../../components";

import * as ITabs from '../../../../shared/utils/dropdown';
import { IoMdArrowBack } from "react-icons/io";
import { RiOrganizationChart } from "react-icons/ri";

interface ITypeAssayProps {
  id: Number | any;
  name: String | any;
  created_by: Number;
  status: Number;
};

interface IData {
  typeAssayEdit: ITypeAssayProps;
}


export default function NovoLocal({typeAssayEdit}: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
    ? tab.statusTab = true
    : tab.statusTab = false
  ));
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const router = useRouter();
  const formik = useFormik<ITypeAssayProps>({
    initialValues: {
      id: typeAssayEdit.id,
      name: typeAssayEdit.name,
      created_by: userLogado.id,
      status: 1
    },
    onSubmit: (values) => {      
      validateInputs(values);
      if (!values.name)  { return; } 

      typeAssayService.update({
        id: values.id,
        name:values.name,
        created_by: Number(userLogado.id),
        status: 1
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire('Tipo de Ensaio atualizado com sucesso!')
          router.push('/config/ensaio/tipo-ensaio');
        } else {
          Swal.fire(response.message)
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
        <title>Atualizar Tipo Ensaio</title>
      </Head>

      <Content contentHeader={tabsDropDowns}>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Atualizar Tipo Ensaio</h1>
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
                disabled
                type="text" 
                placeholder="Nome" 
                style={{ background: '#e5e7eb' }}
                id="id"
                name="id"
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
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<RiOrganizationChart size={18} />}
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
  const baseUrl = `${publicRuntimeConfig.apiUrl}/type-assay`;
  const  token  =  context.req.cookies.token;
  
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };

  const resU = await fetch(`${baseUrl}/` + context.query.id, requestOptions)

  const typeAssayEdit = await resU.json();

  return { props: { typeAssayEdit  } }
}