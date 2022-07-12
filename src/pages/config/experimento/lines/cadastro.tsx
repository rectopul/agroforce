import { capitalize } from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { SiMicrogenetics } from "react-icons/si";
import { Button, Content, Input } from "src/components";
import { genotipoService } from "src/services";
import Swal from "sweetalert2";
import * as ITabs from '../../../../shared/utils/dropdown';

export interface ICreateGenotipo {
  id_culture: number;
  genealogy: string;
  cruza: string;
  status: number;
  created_by: number;
}

export default function Cadastro() {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');


  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const id_culture = userLogado.userCulture.cultura_selecionada as string;

  const formik = useFormik<ICreateGenotipo>({
    initialValues: {
      id_culture: number(id_culture),
      genealogy: '',
      cruza: '',
      status: 1,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      await genotipoService.create({
        id_culture: formik.values.id_culture,
        genealogy: capitalize(formik.values.genealogy),
        cruza: formik.values.cruza,
        status: formik.values.status,
        created_by: formik.values.created_by,
      }).then((response) => {
        if (response.status === 201) {
          Swal.fire('Genótipo cadastrado com sucesso!');
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
      <Head>
        <title>Cadastro de genótipo</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive={'config'}>
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Novo genótipo</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-5">
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
          mt-14
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
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<SiMicrogenetics size={18} />}
                onClick={() => { }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}
