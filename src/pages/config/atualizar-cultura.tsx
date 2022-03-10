import Head from 'next/head';
import { useFormik } from 'formik'
import { BsCheckLg } from "react-icons/bs";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';

import { cultureService } from 'src/services';

import { 
  Button,
  Content, 
  Input, 
  Select, 
  TabHeader 
} from "../../components";

export default function Cultura({cultureEdit}:any) {
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const optionStatus =  [{id: 1, name: "Ativo"}, {id: 0, name: "Inativo"}];

  const tabs = [
    { title: 'TMG', value: <BsCheckLg />, status: true },
    { title: 'ENSAIO', value: <BsCheckLg />, status: false  },
    { title: 'LOCAL', value: <BsCheckLg />, status: false  },
    { title: 'DELINEAMENTO', value: <BsCheckLg />, status: false  },
    { title: 'NPE', value: <BsCheckLg />, status: false  },
    { title: 'QUADRAS', value: <BsCheckLg />, status: false  },
    { title: 'CONFIG. PLANILHAS', value: <BsCheckLg />, status: false },
  ];

  const formik = useFormik({
    initialValues: {
      id: cultureEdit.id,
      name: cultureEdit.name,
      status: cultureEdit.status,
      created_by: userLogado.id,
    },
    onSubmit: values => {
      cultureService.updateCulture({
        id: cultureEdit.id,
        name: formik.values.name,
        status: formik.values.status,
        created_by: formik.values.created_by,
      }).then((response) => {
        if (response.status == 200) {
          alert("Cultura atualizada com sucesso");
        }
      })
    },
  });

  return (
    <>
     <Head>
        <title>Atualizar cultura</title>
      </Head>
      
      <Content
        headerCotent={
          <TabHeader data={tabs} />
        }
      >

      <div className=" w-full
        h-20
        flex
        items-center
        gap-2
        px-5
        rounded-lg
        border-b border-blue-600
        shadow
        bg-white
      ">
        <div className="h-10 w-32">
          <Button 
            value="Usuário"
            bgColor="bg-blue-600"
            textColor="white"
            onClick={() => {}}
          />
        </div>
        <div className="h-10 w-32">
          <Button 
            value="Safra"
            bgColor="bg-blue-600"
            textColor="white"
            onClick={() => {}}
          />
        </div>
        <div className="h-10 w-32">
          <Button 
            value="Portfólio"
            bgColor="bg-blue-600"
            textColor="white"
            onClick={() => {}}
          />
        </div>
      </div>

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
              ID cultura
            </label>
            <Input value={cultureEdit.id} disabled style={{ background: '#e5e7eb' }} />
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

          <div className="w-full h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              Status
            </label>
            <Select
                values={optionStatus}
                id="status"
                name="status"
                onChange={formik.handleChange}
                value={formik.values.status}
                selected={cultureEdit.status}
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


export const getServerSideProps:GetServerSideProps = async ({req}) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/culture`;
  const  token  =  req.cookies.token;
  
  const requestOptions: object | any = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer  ${token}` }
  };
  const res = await fetch(`${baseUrl}/` + 1, requestOptions)
  const cultureEdit = await res.json();

  return { props: { cultureEdit } }
}
