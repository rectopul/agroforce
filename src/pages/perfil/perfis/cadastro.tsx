import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { RiPlantLine } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { capitalize } from '@mui/material';
import { profileService } from '../../../services';
import { Button, Content, Input } from '../../../components';
import * as ITabs from '../../../shared/utils/dropdown';
import ComponentLoading from '../../../components/Loading';

export default function Cadastro() {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const formik = useFormik<any>({
    initialValues: {
      name: '',
      createdBy: Number(userLogado.id),
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) {
        Swal.fire('Preencha todos os campos obrigatórios destacados em vermelho.');
        setLoading(false);
        return;
      }

      await profileService
        .create({
          name: capitalize(formik.values.name?.trim()),
          createdBy: formik.values.createdBy,
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Perfil cadastrado com sucesso!');
            setLoading(false);
            router.back();
          } else {
            setLoading(false);
            Swal.fire(response.message);
          }
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
        <title>Cadastro de perfis</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="
            w-full
            bg-white
            shadow-md
            rounded
            p-8"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Novo perfil</h1>

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
                Nome
              </label>
              <Input
                type="text"
                id="name"
                name="name"
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
