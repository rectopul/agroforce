import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { IoMdArrowBack } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';
import { delineamentoService } from 'src/services';
import Swal from 'sweetalert2';
import {
  Button, Content,
  Input,
} from '../../../components';
import * as ITabs from '../../../shared/utils/dropdown';

interface IDelineamentoProps {
  id: number | any;
  name: string | any;
  repeticao: number;
  trat_repeticao: number;
  created_by: number;
  status: number;
}

export interface IData {
  delineamentoEdit: object | any;
}

export default function NovoLocal({ delineamentoEdit }: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'DELINEAMENTO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const router = useRouter();
  const formik = useFormik<IDelineamentoProps>({
    initialValues: {
      id: delineamentoEdit.id,
      name: capitalize(delineamentoEdit.name),
      repeticao: delineamentoEdit.repeticao,
      trat_repeticao: delineamentoEdit.trat_repeticao,
      created_by: userLogado.id,
      status: 1,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name || !values.repeticao || !values.trat_repeticao) { return; }

      await delineamentoService.update({
        id: values.id,
        name: values.name,
        repeticao: Number(values.repeticao),
        trat_repeticao: Number(values.trat_repeticao),
        created_by: Number(userLogado.id),
        status: 1,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Delineamento cadastrado com sucesso!');
          router.back();
        } else {
          Swal.fire(response.message);
        }
      });
    },
  });

  function validateInputs(values: any) {
    if (!values.name) { const inputname: any = document.getElementById('name'); inputname.style.borderColor = 'red'; } else { const inputname: any = document.getElementById('name'); inputname.style.borderColor = ''; }
    if (!values.repeticao) { const inputrepeticao: any = document.getElementById('repeticao'); inputrepeticao.style.borderColor = 'red'; } else { const inputrepeticao: any = document.getElementById('repeticao'); inputrepeticao.style.borderColor = ''; }
    if (!values.trat_repeticao) { const inputtrat_repeticao: any = document.getElementById('trat_repeticao'); inputtrat_repeticao.style.borderColor = 'red'; } else { const inputtrat_repeticao: any = document.getElementById('trat_repeticao'); inputtrat_repeticao.style.borderColor = ''; }
  }

  return (
    <>
      <Head>
        <title>Atualizar Delineamento</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Atualizar Delineamento</h1>
          </div>

          <div className="w-full
            flex
            justify-around
            gap-6
            mt-4
            mb-4
          "
          >
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Nome
              </label>
              <Input
                type="text"
                placeholder="Nome Delineamento"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Repetição
              </label>
              <Input
                type="text"
                placeholder="4"
                id="repeticao"
                name="repeticao"
                style={{ background: '#e5e7eb' }}
                disabled
                onChange={formik.handleChange}
                value={Number(formik.values.repeticao)}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Trat. Repetição
              </label>
              <Input
                type="text"
                placeholder="14x08(p4)-PY"
                id="trat_repeticao"
                name="trat_repeticao"
                style={{ background: '#e5e7eb' }}
                disabled
                onChange={formik.handleChange}
                value={Number(formik.values.trat_repeticao)}
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
                value="Atualizar"
                bgColor="bg-blue-600"
                icon={<MdDateRange size={18} />}
                textColor="white"
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
  const baseUrl = `${publicRuntimeConfig.apiUrl}/delineamento`;
  const { token } = context.req.cookies;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const resU = await fetch(`${baseUrl}/${context.query.id}`, requestOptions);

  const delineamentoEdit = await resU.json();

  return { props: { delineamentoEdit } };
};
