import { capitalize } from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { Button, Content, Input } from "src/components";
import { loteService } from "src/services";
import Swal from "sweetalert2";
import * as ITabs from '../../../../../shared/utils/dropdown';

export interface ICreateLote {
  id_genotipo: number;
  name: string;
  volume: number;
  created_by: number;
}

export default function  Cadastro() {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'NPE'
    ? tab.statusTab = true
    : tab.statusTab = false
  ));
  
  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const id_culture = userLogado.userCulture.cultura_selecionada as string;

  const formik = useFormik<ICreateLote>({
    initialValues: {
      id_genotipo: parseInt(id_culture),
      name: '',
      volume: 0,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      validateInputs(values);

      if (!values.name || values.volume === 0) {
        throw new Error();
      }

      await loteService.create({
        id_genotipo: parseInt(id_culture),
        name: capitalize(formik.values.name),
        volume: formik.values.volume,
        created_by: formik.values.created_by,
      }).then((response) => {
        if (response.status === 201) {
          Swal.fire('Lote cadastrado com sucesso!');
          router.back();
        } else {
          setCheckInput("text-red-600");
          Swal.fire(response.message);
        }
      });
    },
  });

  function validateInputs(values: ICreateLote) {
    if (!values.name) { let inputName: any = document.getElementById("name"); inputName.style.borderColor= 'red'; } else { let inputName: any = document.getElementById("name"); inputName.style.borderColor= ''; }
    if (!values.volume) { let inputVolume: any = document.getElementById("volume"); inputVolume.style.borderColor= 'red'; } else { let inputVolume: any = document.getElementById("volume"); inputVolume.style.borderColor= '' }
  }
  
  return (
    <>
    <Head>
      <title>Cadastro de Lote</title>
    </Head>

    <Content contentHeader={tabsDropDowns}>
      <form 
        className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl">Novo lote</h1>

        <div className="w-full flex justify-between items-start gap-5 mt-5">
          <div className="w-full h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              <strong className={checkInput}>*</strong>
              Nome
            </label>
            <Input
              type="text"
              placeholder="Ex: Genealogia A1"
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
              type="number"
              placeholder="ex: 500"
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
              type="submit"
              value="Cadastrar"
              bgColor="bg-blue-600"
              textColor="white"
              icon={<FaSortAmountUpAlt size={18} />}
              onClick={() => {}}
            />
          </div>
        </div>
      </form>
    </Content>
  </>
  );
}
