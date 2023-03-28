/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { IoMdArrowBack } from 'react-icons/io';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { focoService } from '../../../../services/foco.service';
import { Button, Content, Input } from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';
import ComponentLoading from '../../../../components/Loading';

interface ICreateFoco {
  name: string;
  id_culture: number;
  created_by: number;
}

export default function Cadastro() {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  function validateInputs(values: any) {
    if (!values.name || values.group === 0) {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = 'red';
    } else {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = '';
    }
  }

  const formik = useFormik<ICreateFoco>({
    initialValues: {
      id_culture: Number(culture),
      name: '',
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) {
        Swal.fire(
          'Preencha todos os campos obrigatórios destacados em vermelho.',
        );
        setLoading(false);
        return;
      }

      await focoService
        .create({
          name: capitalize(formik.values.name?.trim()),
          id_culture: Number(culture),
          created_by: formik.values.created_by,
        })
        .then(({ status, message }) => {
          if (status === 200) {
            Swal.fire('Foco cadastrado com sucesso!');
            setLoading(false);
            router.back();
          } else {
            setLoading(false);
            Swal.fire(message);
          }
        });
    },
  });

  return (
    <>
      {loading && <ComponentLoading text="" />}
      <Head>
        <title>Novo foco</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Novo foco</h1>

          <div
            className="w-1/2
            flex
            justify-around
            gap-6
            mt-4
            mb-4
        "
          >
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *Nome
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                max="50"
                placeholder="ex: Foco"
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
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<AiOutlineFileSearch size={20} />}
                onClick={() => {
                  setLoading(true);
                }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}
