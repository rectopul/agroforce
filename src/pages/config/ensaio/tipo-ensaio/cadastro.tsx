/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { IoMdArrowBack } from 'react-icons/io';
import { RiOrganizationChart } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { typeAssayService } from '../../../../services/tipo-ensaio.service';
import {
  Button, Content, Input, Select,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';

interface ITypeAssayProps {
  id_culture: number;
  name: string | any;
  protocolName: string | any;
  created_by: number;
  status: number;
}

export default function NovoTipoEnsaio() {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  const router = useRouter();

  function validateInputs(values: any) {
    if (!values.name) {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = 'red';
    } else {
      const inputName: any = document.getElementById('name');
      inputName.style.borderColor = '';
    }
  }

  const formik = useFormik<ITypeAssayProps>({
    initialValues: {
      id_culture: Number(culture),
      name: '',
      protocolName: 'Avanço',
      created_by: userLogado.id,
      status: 1,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.name) {
        Swal.fire('Preencha todos os campos obrigatórios');
        return;
      }

      await typeAssayService
        .create({
          id_culture: Number(culture),
          name: capitalize(values.name),
          protocol_name: values.protocolName,
          created_by: Number(userLogado.id),
          status: 1,
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Tipo de Ensaio cadastrado com sucesso!');
            router.back();
          } else {
            Swal.fire(response.message);
          }
        });
    },
  });

  const protocols = [{ name: 'Avanço' }, { name: 'Produtividade' }];

  return (
    <>
      <Head>
        <title>Novo Tipo Ensaio</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Novo Tipo Ensaio</h1>
          </div>

          <div className="w-full flex items-start gap-5 mt-4">
            <div className="w-4/12 h-6">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Nome
              </label>
              <Input
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>

            <div className="w-4/12 h-6">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Protocolo
              </label>
              <Select
                name="protocolName"
                onChange={formik.handleChange}
                selected={protocols[0]}
                values={protocols.map((name) => name)}
              />
            </div>
          </div>

          <div
            className="
            h-7 w-full
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
                onClick={() => {
                  router.back();
                }}
              />
            </div>
            <div className="w-40">
              <Button
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                icon={<RiOrganizationChart size={18} />}
                textColor="white"
                onClick={() => {}}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}
