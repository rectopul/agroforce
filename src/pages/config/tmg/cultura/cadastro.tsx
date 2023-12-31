import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { RiPlantLine } from 'react-icons/ri';
import { cultureService } from 'src/services';
import Swal from 'sweetalert2';
import { setCookies } from 'cookies-next';
import { Button, Content, Input } from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';
import ComponentLoading from '../../../../components/Loading';

interface ICreateCulture {
  name: string;
  desc: string;
  status: number;
  created_by: number;
}

export default function Cadastro() {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const formik
    = useFormik<ICreateCulture>({
    initialValues: {
      name: '',
      desc: '',
      status: 1,
      created_by: Number(userLogado.id),
    },
    onSubmit: async (values:any) => {
      
      // for of values and trim fields typeof string
      for (const key in values) {
        if (typeof values[key] === 'string') {
          values[key] = values[key].trim();
        }
      }
      
      
      validateInputs(values);
      if (!values.name || !values.desc) {
        Swal.fire('Preencha todos os campos obrigatórios destacados em vermelho.');
        setLoading(false);
        return;
      }

      try {
        await cultureService
          .createCulture({
            name: formik.values.name.toUpperCase(),
            desc: formik.values.desc?.trim(),
            status: formik.values.status,
            created_by: formik.values.created_by,
          })
          .then((response) => {
            if (response.status === 200) {
              Swal.fire('Cultura cadastrada com sucesso!');
              setLoading(false);
              router.back();
            } else {
              setLoading(false);
              Swal.fire(response.message);
            }
          });
      } catch (error) {
        setLoading(false);
        Swal.fire({
          title: 'Falha ao cadastrar cultura',
          html: `Ocorreu um erro ao cadastrar cultura. Tente novamente mais tarde.`,
          width: '800',
        });
      }
    },
  });

  // useEffect(() => {
  //   setCookies('lastPage', 'cadastro');
  // })

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
        <title>Cadastro de cultura</title>
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
          <h1 className="text-2xl">Nova cultura</h1>

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
                <strong>*</strong>
                Código Reduzido
              </label>
              <Input
                type="text"
                maxLength={2}
                id="name"
                name="name"
                placeholder="ex: AL"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="w-2/4 h-10 mt-2">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                <strong>*</strong>
                Nome
              </label>
              <Input
                type="text"
                maxLength={10}
                id="desc"
                name="desc"
                placeholder="ex: Algodão"
                onChange={formik.handleChange}
                value={formik.values.desc}
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
