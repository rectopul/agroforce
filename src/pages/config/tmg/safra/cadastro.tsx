import Head from "next/head";
import { useFormik } from 'formik';
import InputMask from 'react-input-mask';

import { IoMdArrowBack } from "react-icons/io";
import { MdDateRange } from "react-icons/md";

import { safraService } from 'src/services';

import { 
  Button,
  Content, 
  Input,
  TabHeader,
  Radio
} from "../../../../components";

import  * as ITabs from '../../../../shared/utils/dropdown';
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { useState } from "react";

interface ISafraProps {
  id_culture: number;
  year: string;
  typeCrop: string;
  plantingStartTime: string;
  plantingEndTime: string;
  main_safra: number;
  status: number;
  created_by: number;
};

export default function Safra() {
  const { tmgDropDown, tabs } = ITabs.default;

  tabs.map((tab) => (
    tab.title === 'TMG'
    ? tab.status = true
    : tab.status = false
  ));
  
  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');


  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  const formik = useFormik<ISafraProps>({
    initialValues: {
      id_culture: Number(culture),
      year: '',
      typeCrop: '',
      plantingStartTime: '',
      plantingEndTime: '',
      main_safra: 0,
      status: 1,
      created_by: Number(userLogado.id),
    },
    onSubmit: async (values) => {
      await safraService.create({
        id_culture: formik.values.id_culture,
        year: formik.values.year,
        typeCrop: formik.values.typeCrop,
        plantingStartTime: formik.values.plantingStartTime,
        plantingEndTime: formik.values.plantingEndTime,
        status: formik.values.status,
        created_by: formik.values.created_by,
      }).then((response) => {
        if (response.status === 201) {
          Swal.fire('Safra cadastrada com sucesso!');
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
        <title>Cadastro de safra</title>
      </Head>

      <Content
        headerCotent={
          <TabHeader data={tabs} dataDropDowns={tmgDropDown} />
        }
      >
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Nova safra</h1>

          <div className="w-full flex justify-between items-start gap-5">
            <div className="w-2/4 h-10 mt-2">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                *Ano
              </label>

              <InputMask
                mask="99/99"
                required
                id="year"
                name="year"
                onChange={formik.handleChange}
                value={formik.values.year}
                className="
                  shadow
                  appearance-none
                  bg-white bg-no-repeat
                  border border-solid border-gray-300
                  rounded
                  w-full
                  py-2 px-3
                  text-gray-900
                  leading-tight
                  focus:text-gray-700 
                  focus:bg-white 
                  focus:border-blue-600 
                  focus:outline-none
                "
              />
            </div>

            <div className="w-2/4 h-10 justify-start">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                *Tipo de safra
              </label>
              <div className="w-full h-full flex gap-4 items-center">
              <Radio
                title="Verão"
                id="typeCrop"
                name="typeCrop"
                onChange={formik.handleChange}
                value={formik.values.typeCrop = 'Verão'}
              />

              <Radio
                title="Inverno"
                id="typeCrop"
                name="typeCrop"
                onChange={formik.handleChange}
                value={formik.values.typeCrop = 'Inverno'}
              />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-start gap-5 mt-10">
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                *Período ideal de início de plantio
              </label>
              <Input
                type="date" 
                placeholder="Ex: 04/23"
                id="plantingStartTime"
                name="plantingStartTime"
                onChange={formik.handleChange}
                value={formik.values.plantingStartTime}
              />
            </div>
            
            <div className="w-2/4">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                *Período ideal do fim do plantio
              </label>
              <Input
                type="date"
                placeholder="Ex: 03/24" 
                id="plantingEndTime"
                name="plantingEndTime"
                onChange={formik.handleChange}
                value={formik.values.plantingEndTime}
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
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<MdDateRange size={18} />}
                onClick={() => {}}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}
