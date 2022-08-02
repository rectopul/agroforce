import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
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
} from '../../../../../components';
import * as ITabs from '../../../../../shared/utils/dropdown';

interface ISequenciaDelineamento {
  id_delineamento: number;
  name: string;
  repeticao: number;
  sorteio: number;
  nt: number;
  bloco: number;
  created_by: number;
}

interface IIdDelineamento {
  id_delineamento: number;
}

export default function Cadastro({ id_delineamento }: IIdDelineamento) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'DELINEAMENTO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  const userLogado = JSON.parse(localStorage.getItem('user') as string);

  const formik = useFormik<ISequenciaDelineamento>({
    initialValues: {
      id_delineamento,
      name: '',
      repeticao: 0,
      sorteio: 0,
      nt: 0,
      bloco: 0,
      created_by: Number(userLogado.id),
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) return;

      alert(JSON.stringify(values, null, 2));

      await sequenciaDelineamentoService.create({
        id_delineamento,
        name: capitalize(values.name),
        repeticao: values.repeticao,
        sorteio: values.sorteio,
        nt: values.nt,
        bloco: values.bloco,
        created_by: formik.values.created_by,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire({
            title: 'Cadastrado realizado com sucesso!',
            text: 'Sequência de delineamento cadastrado!',
          });
          router.back();
        } else {
          setCheckInput('text-red-600');
          Swal.fire(response.message);
        }
      });
    },
  });

  function validateInputs(values: ISequenciaDelineamento) {
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
        <title>Nova sequencia de delineamento</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"

          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Nova sequencia de delineamento</h1>

          <div className="w-full
            flex
            gap-2
            mt-4
            mb-4
          "
          >
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Nome
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="ex: P1-64"
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
            h-10 w-full
            flex
            gap-3
            justify-center
            mt-10
          "
          >
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

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const { id_delineamento } = params as any;

  return {
    props: {
      id_delineamento,
    },
  };
};
