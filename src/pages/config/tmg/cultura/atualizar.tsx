import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { RiPlantLine } from 'react-icons/ri';
import { cultureService } from 'src/services';
import Swal from 'sweetalert2';
import {
  Button,
  Content,
  Input
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';

export interface IUpdateCulture {
  id: number;
  name: string;
  status: number;
};

export default function Cultura(culture: IUpdateCulture) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  const formik = useFormik<IUpdateCulture>({
    initialValues: {
      id: culture.id,
      name: culture.name,
      status: culture.status
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) return;

      await cultureService.updateCulture({
        id: culture.id,
        name: capitalize(formik.values.name),
        status: formik.values.status,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Cultura atualizada com sucesso');
          router.back();
        } else {
          setCheckInput("text-red-600");
          Swal.fire(response.message);
        }
      }).finally(() => {
        formik.values.name = culture.name;
      });
    },
  });

  function validateInputs(values: any) {
    if (!values.name) {
      let inputName: any = document.getElementById("name");
      inputName.style.borderColor = 'red';
    } else {
      let inputName: any = document.getElementById("name");
      inputName.style.borderColor = '';
    }
  }

  return (
    <>
      <Head>
        <title>Atualizar cultura</title>
      </Head>

      <Content contentHeader={tabsDropDowns}>
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
                icon={<RiPlantLine size={20} />}
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
  const baseUrl = `${publicRuntimeConfig.apiUrl}/culture`;
  const token = context.req.cookies.token;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  };

  const apiCulture = await fetch(`${baseUrl}/` + context.query.id, requestOptions);

  const culture = await apiCulture.json();

  return { props: culture }
}
