import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { IoMdArrowBack } from 'react-icons/io';
import { departmentService } from 'src/services';
import Swal from 'sweetalert2';
import { Button, Content, Input } from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';
import ComponentLoading from '../../../../components/Loading';

interface IDepartmentProps {
  name: string;
  created_by: number;
}

export default function Safra() {
  const { TabsDropDowns } = ITabs.default;

  const [loading, setLoading] = useState<boolean>(false);

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  const userLogado = JSON.parse(localStorage.getItem('user') as string);

  const formik = useFormik<IDepartmentProps>({
    initialValues: {
      name: '',
      created_by: Number(userLogado.id),
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) {
        Swal.fire('Preencha todos os campos obrigatórios destacados em vermelho.');
        setLoading(false);
        return;
      }

      try {
        await departmentService
          .create({
            name: (formik.values.name?.trim()),
            created_by: formik.values.created_by,
          })
          .then((response) => {
            if (response.status === 200) {
              Swal.fire('Setor cadastrado com sucesso!');
              setLoading(false);
              router.back();
            } else {
              setCheckInput('text-red-600');
              setLoading(false);
              Swal.fire(response.message);
            }
          });
      } catch (error) {
        setLoading(false);
        Swal.fire({
          title: 'Falha ao criar setor',
          html: `Ocorreu um erro ao criar setor. Tente novamente mais tarde.`,
          width: '800',
        });
      }
    },
  });

  function validateInputs(values: any) {
    // for of values and trim fields typeof string
    for (const key in values) {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim();
      }
    }
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
        <title>Cadastro de setor</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Novo setor</h1>

          <div
            className="
            w-full
            flex
            gap-2
            mt-4
            mb-4
          "
          >
            <div className="w-2/4 h-10 mt-2">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                <strong className={checkInput}>* </strong>
                Nome
              </label>
              <Input
                type="text"
                maxLength={50}
                id="name"
                name="name"
                placeholder="ex: Administração"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
          </div>

          <div
            className="
            h-7
            w-full
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
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<HiOutlineOfficeBuilding size={18} />}
                onClick={() => { setLoading(true); }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}
