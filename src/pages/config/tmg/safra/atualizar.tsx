import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';
import { Button, Content, Input } from 'src/components';
import { safraService } from 'src/services';
import Swal from 'sweetalert2';
import * as ITabs from '../../../../shared/utils/dropdown';

interface ISafraProps {
  id: number;
  // id_culture: number;
  safraName: string;
  year: number;
  plantingStartTime: string;
  plantingEndTime: string;
  status: number;
}

interface Input {
  safraName: string;
  year: number;
  plantingStartTime: string;
  plantingEndTime: string;
}

export default function AtualizarSafra(safra: ISafraProps) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  const [checkeBox, setCheckeBox] = useState<boolean>();
  const [checkeBox2, setCheckeBox2] = useState<boolean>();

  const select = [
    { id: 1, name: 'Ativo' },
    { id: 2, name: 'Inativo' },
  ];

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  const formik = useFormik<ISafraProps>({
    initialValues: {
      id: safra.id,
      // id_culture: safra.id_culture,
      safraName: safra.safraName,
      year: safra.year,
      plantingStartTime: '',
      plantingEndTime: '',
      status: safra.status,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.safraName || !values.year) {
        Swal.fire('Preencha todos os campos obrigatórios');
        return;
      }

      let plantingStartTime;
      let plantingEndTime;

      if (values.plantingStartTime) {
        plantingStartTime = new Intl.DateTimeFormat('pt-BR').format(
          new Date(formik.values.plantingStartTime),
        );
      }

      if (values.plantingEndTime) {
        plantingEndTime = new Intl.DateTimeFormat('pt-BR').format(
          new Date(formik.values.plantingEndTime),
        );
      }

      await safraService
        .updateSafras({
          id: safra.id,
          // id_culture: safra.id_culture,
          safraName: formik.values.safraName,
          year: Number(formik.values.year),
          plantingStartTime,
          plantingEndTime,
          status: formik.values.status,
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Safra atualizada com sucesso!');
            router.back();
          } else {
            Swal.fire(response.message);
          }
        });
    },
  });

  function validateInputs(values: Input) {
    if (!values.safraName || !values.year) {
      const inputSafraName: any = document.getElementById('safraName');
      const inputYear: any = document.getElementById('year');
      inputSafraName.style.borderColor = 'red';
      inputYear.style.borderColor = 'red';
    } else {
      const inputSafraName: any = document.getElementById('safraName');
      const inputYear: any = document.getElementById('year');
      inputSafraName.style.borderColor = '';
      inputYear.style.borderColor = '';
    }
  }

  return (
    <>
      <Head>
        <title>Atualizar safra</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar safra</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-4">
            <div className="w-4/12 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                <strong className={checkInput}>*</strong>
                Safra
              </label>
              <Input
                id="safraName"
                name="safraName"
                disabled
                style={{ background: '#e5e7eb' }}
                placeholder="___________"
                maxLength={10}
                onChange={formik.handleChange}
                value={formik.values.safraName}
              />
            </div>

            <div className="w-4/12 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                <strong className={checkInput}>*</strong>
                Ano
              </label>
              <Input
                id="year"
                name="year"
                maxLength={4}
                disabled
                style={{ background: '#e5e7eb' }}
                placeholder="____"
                onChange={formik.handleChange}
                value={formik.values.year}
              />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Período ideal de início de plantio
              </label>
              <Input
                type="date"
                id="plantingStartTime"
                name="plantingStartTime"
                onChange={formik.handleChange}
                value={formik.values.plantingStartTime}
              />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Período ideal do fim do plantio
              </label>
              <Input
                type="date"
                id="plantingEndTime"
                name="plantingEndTime"
                onChange={formik.handleChange}
                value={formik.values.plantingEndTime}
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
                type="submit"
                value="Atualizar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<MdDateRange size={18} />}
                onClick={() => {
                  formik.submitForm;
                }}
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
  const baseUrlList = `${publicRuntimeConfig.apiUrl}/safra`;
  const { token } = context.req.cookies;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiSafra = await fetch(
    `${baseUrlList}/${context.query.id}`,
    requestOptions,
  );

  const safra = await apiSafra.json();

  return { props: safra };
};
