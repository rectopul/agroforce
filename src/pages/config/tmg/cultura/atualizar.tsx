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
import { cultureService } from 'src/services';
import Swal from 'sweetalert2';
import { Button, Content, Input } from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';
import ComponentLoading from '../../../../components/Loading';

export interface IUpdateCulture {
  id: number;
  name: string;
  desc: string;
  created_by: number;
}

export default function Cultura(culture: IUpdateCulture) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();
  const userLogado = JSON.parse(localStorage.getItem('user') as string);

  const [checkInput, setCheckInput] = useState('text-black');

  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik<IUpdateCulture>({
    initialValues: {
      id: culture.id,
      name: culture.name,
      desc: culture.desc,
      created_by: 0,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name || !values.desc) {
        Swal.fire('Preencha todos os campos obrigatórios destacados em vermelho.');
        setLoading(false);
        return;
      }
      await cultureService
        .updateCulture({
          id: culture.id,
          name: capitalize(formik.values.name),
          desc: capitalize(formik.values.desc?.trim()),
          created_by: Number(userLogado.id),
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Cultura atualizada com sucesso');
            setLoading(false);
            router.back();
          } else {
            setLoading(false);
            Swal.fire(response.message);
          }
        })
        .finally(() => {
          formik.values.name = culture.name;
        });
    },
  });

  function validateInputs(values: any) {
    if (!values.name || !values.desc) {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = 'red';
      const inputDesc: any = document.getElementById('desc');
      inputDesc.style.borderColor = 'red';
    } else {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = '';
      const inputDesc: any = document.getElementById('desc');
      inputDesc.style.borderColor = '';
    }
  }

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Atualizar cultura</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar cultura</h1>

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
                <strong className={checkInput}>*</strong>
                Código Reduzido
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                style={{ background: '#f9fafb' }}
                disabled
                maxLength={2}
                placeholder="ex: AL"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                <strong className={checkInput}>*</strong>
                Nome
              </label>
              <Input
                id="desc"
                name="desc"
                type="text"
                maxLength={10}
                placeholder="ex: Algodão"
                onChange={formik.handleChange}
                value={formik.values.desc}
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
  const baseUrl = `${publicRuntimeConfig.apiUrl}/culture`;
  const { token } = context.req.cookies;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiCulture = await fetch(
    `${baseUrl}/${context.query.id}`,
    requestOptions,
  );

  const culture = await apiCulture.json();

  return { props: culture };
};
