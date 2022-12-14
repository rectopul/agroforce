import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { IoMdArrowBack } from 'react-icons/io';
import { Button, Content, Input } from 'src/components';
import { departmentService } from 'src/services';
import Swal from 'sweetalert2';
import * as ITabs from '../../../../shared/utils/dropdown';
import ComponentLoading from '../../../../components/Loading';

interface IDepartmentProps {
  id: number;
  name: string;
  status: number;
}

export default function AtualizarSafra(item: IDepartmentProps) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  const [loading, setLoading] = useState<boolean>(false);

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  const formik = useFormik<IDepartmentProps>({
    initialValues: {
      id: item.id,
      name: item.name,
      status: item.status,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) {
        Swal.fire('Preencha todos os campos obrigatórios destacados em vermelho.');
        setLoading(false);
        return;
      }

      await departmentService
        .update({
          id: item.id,
          name: capitalize(formik.values.name),
          status: item.status,
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Setor atualizado com sucesso!');
            setLoading(false);
            router.back();
          } else {
            setCheckInput('text-red-600');
            setLoading(false);
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
    {loading && <ComponentLoading text="" />}
      <Head>
        <title>Atualizar setor</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar setor</h1>

          <div className="w-full flex gap-5 mt-4">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                <strong className={checkInput}>*</strong>
                Nome
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                maxLength={50}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
          </div>

          <div
            className="h-7 w-full
            flex
            gap-3
            justify-center
            mt-12
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
                value="Atualizar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<HiOutlineOfficeBuilding size={18} />}
                onClick={() => {setLoading(true);}}
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
  const baseUrlList = `${publicRuntimeConfig.apiUrl}/department`;
  const { token } = context.req.cookies;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiItem = await fetch(
    `${baseUrlList}/${context.query.id}`,
    requestOptions,
  );

  const item = await apiItem.json();

  return { props: item };
};
