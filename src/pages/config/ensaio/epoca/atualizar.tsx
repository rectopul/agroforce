import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { IoMdArrowBack } from 'react-icons/io';
import { MdUpdate } from 'react-icons/md';
import { epocaService } from 'src/services';
import Swal from 'sweetalert2';
import {
  Button, Content,
  Input,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';

interface IEpocaProps {
  id: number;
  name: string;
  status: number;
}

export default function NovoLocal(epoca: IEpocaProps) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const router = useRouter();
  const formik = useFormik<IEpocaProps>({
    initialValues: {
      id: epoca.id,
      name: epoca.name,
      status: epoca.status,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) { return; }

      await epocaService.update({
        id: epoca.id,
        name: capitalize(values.name.trim()),
        status: epoca.status,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Época atualizada com sucesso!');
          router.push('/config/ensaio/epoca');
        } else {
          Swal.fire(response.message);
        }
      });
    },
  });

  function validateInputs(values: any) {
    if (!values.name) { const inputname: any = document.getElementById('name'); inputname.style.borderColor = 'red'; } else { const inputname: any = document.getElementById('name'); inputname.style.borderColor = ''; }
  }

  return (
    <>
      <Head>
        <title>Atualizar Época</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Atualizar Época</h1>
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
                Código
              </label>
              <Input
                disabled
                type="text"
                style={{ background: '#e5e7eb' }}
                id="id"
                name="id"
                value={epoca.id}
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
          "
          >
            <div className="w-30">
              <Button
                type="button"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                onClick={() => { router.back(); }}
              />
            </div>
            <div className="w-40">
              <Button
                type="submit"
                value="Atualizar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<MdUpdate size={18} />}
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
  const baseUrl = `${publicRuntimeConfig.apiUrl}/epoca`;
  const { token } = context.req.cookies;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const result = await fetch(`${baseUrl}/${context.query.id}`, requestOptions);

  const epoca = await result.json();

  return { props: epoca };
};
