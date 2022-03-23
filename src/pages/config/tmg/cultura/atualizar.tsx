import Head from 'next/head';
import { useFormik } from 'formik'
import { GetServerSideProps } from "next";
import getConfig from 'next/config';

import { cultureService } from 'src/services';

import { 
  Button,
  Content, 
  Input,
  TabHeader 
} from "../../../../components";

import  * as ITabs from '../../../../shared/utils/dropdown';
import Swal from 'sweetalert2';

export interface IUpdateCulture {
  id: number;
  name: string;
  status: number;
  created_by: number;
};

export default function Cultura(culture: IUpdateCulture) {
  const { tmgDropDown, tabs } = ITabs.default;

  const formik = useFormik<IUpdateCulture>({
    initialValues: {
      id: culture.id,
      name: culture.name,
      status: culture.status,
      created_by: culture.created_by
    },
    onSubmit: async (values) => {
      await cultureService.updateCulture({
        id: culture.id,
        name: formik.values.name,
        status: formik.values.status,
        created_by: formik.values.created_by
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Cultura atualizada com sucesso');
        } else {
          Swal.fire(response.message);
        }
      }).finally(() => {
        formik.values.name = culture.name;
      });
    },
  });

  return (
    <>
     <Head>
        <title>Atualizar cultura</title>
      </Head>
      
      <Content
        headerCotent={
          <TabHeader data={tabs} dataDropDowns={tmgDropDown} />
        }
      >

      <form 
        className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"

        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl">Nova cultura</h1>

        <div className="w-full
          flex
          justify-around
          gap-2
          mt-4
          mb-4
        ">
          <div className="w-full">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              Código
            </label>
            <Input value={culture.id} disabled style={{ background: '#e5e7eb' }} />
          </div>

          <div className="w-full h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              Nome cultura
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
       
        <div className="h-10 w-full
          flex
          justify-center
          mt-10
        ">
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

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/culture`;
  const  token  =  context.req.cookies.token;
  
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };

  const apiCulture = await fetch(`${baseUrl}/` + context.query.id, requestOptions);

  const culture = await apiCulture.json();

  return { props: culture }
}
