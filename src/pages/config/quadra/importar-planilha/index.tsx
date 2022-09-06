/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import Head from 'next/head';
import readXlsxFile from 'read-excel-file';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import { FiUserPlus } from 'react-icons/fi';
import React, { useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { importService } from '../../../../services';
import {
  Button, Content, Input,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';
import ComponentLoading from '../../../../components/Loading';

export default function Importar(
  { safra }: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();
  const router = useRouter();

  tabsDropDowns.map((tab) => (tab.titleTab === 'QUADRAS' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const [loading, setLoading] = useState(false);

  const safras: object | any = [];
  safra.forEach((value: string | object | any) => {
    safras.push({ id: value.safraName, name: value.safraName });
  });

  function readExcel(value: any) {
    const userLogado = JSON.parse(localStorage.getItem('user') as string);

    readXlsxFile(value[0]).then((rows) => {
      setLoading(true);

      importService.validate({
        table: 'BLOCK',
        spreadSheet: rows,
        moduleId: 17,
        idSafra: userLogado.safras.safra_selecionada,
        idCulture: userLogado.userCulture.cultura_selecionada,
        created_by: userLogado.id,
      }).then((response) => {
        setLoading(false);

        if (response.message !== '') {
          Swal.fire({
            html: response.message,
            width: '900',
          });
          if (!response.erro) {
            router.back();
          }
        }
      });
    });

    (document.getElementById('inputFile') as any).value = null;
  }

  const formik = useFormik<any>({
    initialValues: {
      input: [],
      genotipo: '',
    },
    onSubmit: async () => {
      const inputFile: any = document.getElementById('inputFile');
      readExcel(inputFile.files);
    },
  });
  return (
    <>
      {loading && <ComponentLoading text="Importando planilha, aguarde..." />}

      <Head>
        <title>Importação Genótipo</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full
                flex
                justify-around
                gap-6
                mt-4
                mb-4
            "
          >
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Excel
              </label>
              <Input
                type="file"
                required
                id="inputFile"
                name="inputFile"
              />
            </div>
          </div>
          <div className="
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
                onClick={() => { router.back(); }}
                icon={<IoMdArrowBack size={18} />}
              />
            </div>
            <div className="w-40">
              <Button
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<FiUserPlus size={18} />}
                onClick={() => { }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }: any) => {
  const { publicRuntimeConfig } = getConfig();
  const { token } = req.cookies;
  const { cultureId } = req.cookies;

  const param = `filterStatus=1&id_culture=${cultureId}`;

  const urlParametersSafra: any = new URL(`${publicRuntimeConfig.apiUrl}/safra`);
  urlParametersSafra.search = new URLSearchParams(param).toString();

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiSafra = await fetch(urlParametersSafra.toString(), requestOptions);
  let safra: any = await apiSafra.json();

  safra = safra.response;
  return { props: { safra } };
};
