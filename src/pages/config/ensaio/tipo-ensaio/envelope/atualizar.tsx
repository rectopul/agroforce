/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { useFormik } from 'formik';
import { useState } from 'react';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { IoMdArrowBack } from 'react-icons/io';
import Swal from 'sweetalert2';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { envelopeService } from '../../../../../services';
import { Button, Content, Input } from '../../../../../components';
import ComponentLoading from '../../../../../components/Loading';
import * as ITabs from '../../../../../shared/utils/dropdown';

export default function Cadastro({ envelope }: any) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();

  const userLogado = JSON.parse(localStorage.getItem('user') as string);

  const [loading, setLoading] = useState<boolean>(false);

  function validateInputs(values: any) {
    if (!values.seeds) {
      const inputSeeds: any = document.getElementById('seeds');
      inputSeeds.style.borderColor = 'red';
    } else {
      const inputSeeds: any = document.getElementById('seeds');
      inputSeeds.style.borderColor = '';
    }
  }
  const formik = useFormik<any>({
    initialValues: {
      id_foco: Number(envelope.type_assay.id),
      safra: envelope.safra.id,
      seeds: envelope.seeds,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.seeds) {
        Swal.fire(
          'Preencha todos os campos obrigatórios destacados em vermelho.',
        );
        return;
      }

      setLoading(true);

      try {
        await envelopeService
          .update({
            id: Number(envelope.id),
            id_safra: Number(envelope.safra.id),
            id_type_assay: Number(envelope.type_assay.id),
            seeds: Number(values.seeds),
            created_by: Number(formik.values.created_by),
          })
          .then((response) => {
            if (response.status === 200) {
              Swal.fire('Envelope atualizado com sucesso!');
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
          title: 'Falha ao atualizar envelope',
          html: `Ocorreu um erro ao atualizar envelope. Tente novamente mais tarde.`,
          width: '800',
        });
      }
    },
  });

  return (
    <>
      <Head>
        <title>Atualizar Envelope</title>
      </Head>

      {loading && <ComponentLoading />}

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar Envelope</h1>

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
                Safra
              </label>
              <Input
                id="safra"
                style={{ background: '#e5e7eb' }}
                name="safra"
                type="text"
                disabled
                max="50"
                value={envelope.safra.safraName}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *Quant de sementes por envelope
              </label>
              <Input
                id="seeds"
                name="seeds"
                onChange={formik.handleChange}
                value={formik.values.seeds}
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
                value="Atualizar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<AiOutlineFileSearch size={20} />}
                onClick={() => {}}
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
  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/envelope`;
  const { token } = context.req.cookies;
  const idEnvelope = context.query.id;
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiEnvelope = await fetch(
    `${baseUrlShow}/${idEnvelope}`,
    requestOptions,
  );

  const envelope = await apiEnvelope.json();

  return {
    props: {
      envelope,
    },
  };
};
