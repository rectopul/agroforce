import { capitalize } from "@mui/material";
import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import {
  Button,
  Content,
  Input
} from "src/components";
import { loteService } from "src/services";
import Swal from "sweetalert2";
import * as ITabs from '../../../../../shared/utils/dropdown';

export interface IUpdateLote {
  id: number;
  name: string;
  volume: number;
}

export default function Atualizar(lote: IUpdateLote) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  const formik = useFormik<IUpdateLote>({
    initialValues: {
      id: lote.id,
      name: lote.name,
      volume: lote.volume,
    },
    onSubmit: async (values) => {
      validateInputs(values);

      if (!values.name || values.volume === 0 || values.volume === null) {
        throw new Error();
      }

      await loteService.update({
        id: lote.id,
        name: capitalize(values.name),
        volume: values.volume,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Lote atualizado com sucesso!');
          router.back();
        } else {
          setCheckInput("text-red-600");
          Swal.fire(response.message);
        }
      });
    },
  });

  function validateInputs(values: IUpdateLote) {
    if (!values.name) { let inputName: any = document.getElementById("name"); inputName.style.borderColor = 'red'; } else { let inputName: any = document.getElementById("name"); inputName.style.borderColor = ''; }
    if (!values.volume) { let inputVolume: any = document.getElementById("volume"); inputVolume.style.borderColor = 'red'; } else { let inputVolume: any = document.getElementById("volume"); inputVolume.style.borderColor = '' }
  }

  return (
    <>
      <Head><title>Atualizar lote</title></Head>
      <Content contentHeader={tabsDropDowns} moduloActive={'config'}>
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar lote</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-5">
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Código
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                required
                disabled
                value={lote.id}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Nome
              </label>
              <Input
                placeholder="coleção de soja"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Volume
              </label>
              <Input
                placeholder="80"
                id="volume"
                name="volume"
                onChange={formik.handleChange}
                value={formik.values.volume}
              />
            </div>
          </div>
          <div className="h-10 w-full
            flex
            gap-3
            justify-center
            mt-10
          ">
            <div className="w-30">
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
                icon={<FaSortAmountUpAlt size={18} />}
                onClick={() => { }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/lote-genotipo`;
  const token = context.req.cookies.token;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  };

  const apiLote = await fetch(`${baseUrl}/find-one?id=` + context.query.id, requestOptions);

  const lote = await apiLote.json();

  return { props: lote }
}
