import { capitalize } from "@mui/material";
import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { SiMicrogenetics } from "react-icons/si";
import {
  Button,
  Content,
  Input
} from "src/components";
import { genotipoService } from "src/services";
import Swal from "sweetalert2";
import * as ITabs from '../../../../shared/utils/dropdown';

export interface IUpdateGenotipo {
  id: number;
  id_culture: number;
  genealogy: string;
  cruza: string;
  status: number;
}

export default function Atualizargenotipo(genotipo: IUpdateGenotipo) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG'
    ? tab.statusTab = true
    : tab.statusTab = false
  ));
  
  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');

  const formik = useFormik<IUpdateGenotipo>({
    initialValues: {
      id: genotipo.id,
      id_culture: genotipo.id_culture,
      genealogy: genotipo.genealogy,
      cruza: genotipo.cruza,
      status: genotipo.status,
    },
    onSubmit: async (values) => {
      await genotipoService.update({
        id: genotipo.id,
        id_culture: formik.values.id_culture,
        genealogy: capitalize(formik.values.genealogy),
        cruza: formik.values.cruza,
        status: genotipo.status,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Genótipo atualizado com sucesso!');
          router.back();
        } else {
          setCheckInput("text-red-600");
          Swal.fire(response.message);
        }
      });
    },
  });

  return (
    <>
      <Head><title>Atualizar genótipo</title></Head>
      <Content contentHeader={tabsDropDowns}>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar genótipo</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-5">
          <div className="w-full h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              <strong className={checkInput}>*</strong>
              Código
            </label>
            <Input
              style={{ background: '#e5e7eb'}}
              required
              disabled
              value={genotipo.id}
            />
          </div>
          <div className="w-full h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              <strong className={checkInput}>*</strong>
              Genealogia
            </label>
            <Input
              required
              placeholder="Ex: Genealogia A1"
              id="genealogy"
              name="genealogy"
              onChange={formik.handleChange}
              value={formik.values.genealogy}
            />
          </div>
          <div className="w-full h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              <strong className={checkInput}>*</strong>
              Cruza
            </label>
            <Input
              required
              placeholder="Ex: HIR + HFR"
              id="cruza"
              name="cruza"
              onChange={formik.handleChange}
              value={formik.values.cruza}
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
                icon={<SiMicrogenetics size={18} />}
                onClick={() => {}}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
};

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/genotipo`;
  const  token  =  context.req.cookies.token;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };

  const apiGenotipo = await fetch(`${baseUrl}/` + context.query.id, requestOptions);

  const genotipo = await apiGenotipo.json();

  return { props: genotipo }
}
