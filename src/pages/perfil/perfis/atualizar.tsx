/* eslint-disable react/destructuring-assignment */
import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { RiPlantLine } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { profileService } from '../../../services';
import { Button, Content, Input } from '../../../components';
import * as ITabs from '../../../shared/utils/dropdown';
import ComponentLoading from '../../../components/Loading';

export default function Cultura(profile: any) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();
  const userLogado = JSON.parse(localStorage.getItem('user') as string);

  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik<any>({
    initialValues: {
      id: profile.id,
      name: profile.name,
      created_by: 0,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) {
        Swal.fire('Preencha todos os campos obrigatórios destacados em vermelho.');
        setLoading(false);
        return;
      }
      await profileService
        .update({
          id: profile.id,
          name: capitalize(formik.values.name),
          createdBy: Number(userLogado.id),
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Perfil atualizada com sucesso');
            setLoading(false);
            router.back();
          } else {
            setLoading(false);
            Swal.fire(response.message);
          }
        })
        .finally(() => {
          formik.values.name = profile.name;
        });
    },
  });

  function validateInputs(values: any) {
    if (!values.name || !values.desc) {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = 'red';
    } else {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = '';
    }
  }

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Atualizar perfil</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar perfil</h1>

          <div
            className="w-full
          flex
          justify-around
          gap-2
          mt-4
          mb-4
        "
          >

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Nome
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
          </div>

          <div
            className="
            h-7 w-full
            flex
            gap-3
            justify-center
            mt-10
          "
          >
            <div className="w-40">
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
                icon={<RiPlantLine size={20} />}
                onClick={() => { setLoading(true); }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/profile`;
  const { token } = context.req.cookies;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const { response: profile } = await fetch(
    `${baseUrl}/${context.query.id}`,
    requestOptions,
  ).then((data) => data.json());

  return { props: profile };
};
