import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { RiPlantLine } from 'react-icons/ri';
import { sequenciaDelineamentoService } from 'src/services';
import Swal from 'sweetalert2';
import {
  Button,
  Content,
  Input,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';

export interface IUpdateSequenciaDelineamento {
  id: number;
  name: string;
  repeticao: number;
  sorteio: number;
  nt: number;
  bloco: number;
}

export default function Cultura(item: IUpdateSequenciaDelineamento) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  const formik = useFormik<IUpdateSequenciaDelineamento>({
    initialValues: {
      id: item.id,
      name: item.name,
      repeticao: item.repeticao,
      sorteio: item.sorteio,
      nt: item.nt,
      bloco: item.bloco,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) return;

      await sequenciaDelineamentoService.update({
        id: item.id,
        name: capitalize(formik.values.name),
        repeticao: formik.values.repeticao,
        sorteio: formik.values.sorteio,
        nt: formik.values.nt,
        bloco: formik.values.bloco,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Cultura atualizada com sucesso');
          router.back();
        } else {
          setCheckInput('text-red-600');
          Swal.fire(response.message);
        }
      });
    },
  });

  function validateInputs(values: any) {
    if (!values.name) {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = 'red';
    } else {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = '';
    }
  }

  return (
    <>
      <Head>
        <title>Atualizar cultura</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"

          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Nova cultura</h1>

          <div className="w-full
          flex
          gap-2
          mt-4
          mb-4
        "
          >
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Código
              </label>
              <Input value={item.id} disabled style={{ background: '#e5e7eb' }} />
            </div>

            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Nome
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="ex: Soja"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>

            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Repetição
              </label>
              <Input
                id="repeticao"
                name="repeticao"
                type="number"
                placeholder="ex: 1"
                onChange={formik.handleChange}
                value={formik.values.repeticao}
              />
            </div>
          </div>

          <div className="w-full
            flex
            gap-2
            mt-10
            mb-4
          "
          >
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Sorteio
              </label>
              <Input
                id="sorteio"
                name="sorteio"
                type="number"
                placeholder="ex: 1"
                onChange={formik.handleChange}
                value={formik.values.sorteio}
              />
            </div>
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                NT
              </label>
              <Input
                id="nt"
                name="nt"
                type="number"
                placeholder="ex: 1"
                onChange={formik.handleChange}
                value={formik.values.nt}
              />
            </div>
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Bloco
              </label>
              <Input
                id="bloco"
                name="bloco"
                type="number"
                placeholder="ex: 1"
                onChange={formik.handleChange}
                value={formik.values.bloco}
              />
            </div>
          </div>

          <div className="
            h-7 w-full
            flex
            gap-3
            justify-center
            mt-16
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
  const baseUrl = `${publicRuntimeConfig.apiUrl}/sequencia-delineamento`;
  const { token } = context.req.cookies;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const api = await fetch(`${baseUrl}/${context.query.id}`, requestOptions);

  const item = await api.json();

  return { props: item };
};
