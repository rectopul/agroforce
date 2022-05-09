import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { IoMdArrowBack } from 'react-icons/io';
import { focoService } from 'src/services/foco.service';
import Swal from 'sweetalert2';
import {
  Button,
  Content,
  Select,
  Input
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';

interface ICreateFoco {
  name: string;
  group: number;
  id_culture: number;
  created_by: number;
}

export default function Cadastro() {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
    ? tab.statusTab = true
    : tab.statusTab = false
  ));

  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;
  const grupos =  [
    {id: 1, name: "Grupo 1"},
    {id: 2, name: "Grupo 2"},
    {id: 3, name: "Grupo 3"},
    {id: 4, name: "Grupo 4"},
    {id: 5, name: "Grupo 5"},
    {id: 6, name: "Grupo 6"},
    {id: 7, name: "Grupo 7"}
  ];

  const formik = useFormik<ICreateFoco>({
    initialValues: {
      id_culture: parseInt(culture),
      name: '',
      group: 0,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      await focoService.create({
        name: capitalize(formik.values.name),
        id_culture: parseInt(culture),
        group: Number(values.group),
        created_by: formik.values.created_by,
      }).then((response) => {
        if (response.status === 201) {
          Swal.fire('Foco cadastrado com sucesso!');
          router.back();
        } else {
          setCheckInput("text-red-600");
          Swal.fire(response.message)
        }
      }).finally(() => {
        formik.values.name = '';
      });
    },
  });

  return (
    <>
     <Head>
        <title>Novo foco</title>
      </Head>
      
      <Content contentHeader={tabsDropDowns}>
      <form 
        className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"

        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl">Novo foco</h1>

        <div className="w-full
          flex
          mt-4
          mb-4
        ">
          <div className="w-2/4 h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              <strong className={checkInput}>*</strong>
              Nome
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
          <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                  *Grupos
              </label>
              <Select
                  values={grupos}
                  id="group"
                  name="group"
                  // required
                  onChange={formik.handleChange}
                  value={formik.values.group}
                  selected={false}
              />
          </div>
        </div>

        <div className="
            h-10 w-full
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
                value="Cadastrar"
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
