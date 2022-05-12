import { useFormik } from 'formik';
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import InputMask from 'react-input-mask';
import { safraService } from 'src/services';
import Swal from "sweetalert2";
import {
  Button,
  Content,
  Input,
  Radio
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';





interface ISafraProps {
  id_culture: number;
  year: string;
  plantingStartTime: string;
  plantingEndTime: string;
  main_safra: number;
  status: number;
  created_by: number;
};

interface Input {
  year: string;
  plantingStartTime: string;
  plantingEndTime: string;
};

export default function Safra() {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG'
    ? tab.statusTab = true
    : tab.statusTab = false
  ));
  
  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');
  const [checkeBox, setCheckeBox] = useState<boolean>();
  const [checkeBox2, setCheckeBox2] = useState<boolean>();

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  const formik = useFormik<ISafraProps>({
    initialValues: {
      id_culture: Number(culture),
      year: '',
      plantingStartTime: '',
      plantingEndTime: '',
      main_safra: 0,
      status: 1,
      created_by: Number(userLogado.id),
    },
    onSubmit: async (values) => {
      const { main_safra, ...data } = values;

      const { 
        created_by, 
        id_culture, 
        status, 
        ...inputs
      } = data;

      validateInputs(inputs);

      if (!inputs) return;

      const plantingStartTime = new Intl.DateTimeFormat('pt-BR').format(
        new Date(formik.values.plantingStartTime)
      );

      const plantingEndTime = new Intl.DateTimeFormat('pt-BR').format(
        new Date(formik.values.plantingEndTime)
      );
      
      await safraService.create({
        id_culture: Number(culture),
        year: formik.values.year,
        plantingStartTime: plantingStartTime,
        plantingEndTime: plantingEndTime,
        status: formik.values.status,
        created_by: Number(userLogado.id),
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

  function validateInputs(values: Input) {
    if (!values.year) {
      let inputYear: any = document.getElementById("year");
      inputYear.style.borderColor= 'red';
    } else {
      let inputYear: any = document.getElementById("year");
      inputYear.style.borderColor= '';
    }
    if (!values.plantingStartTime) {
      let inputPlantingStartTime: any = document.getElementById("plantingStartTime"); 
      inputPlantingStartTime.style.borderColor= 'red'; 
    } else {
      let inputPlantingStartTime: any = document.getElementById("plantingStartTime");
      inputPlantingStartTime.style.borderColor= '';
    }
    if (!values.plantingEndTime) {
      let inputplantingEndTime: any = document.getElementById("plantingEndTime"); 
      inputplantingEndTime.style.borderColor= 'red'; 
    } else {
      let inputPlantingEndTime: any = document.getElementById("plantingEndTime");
      inputPlantingEndTime.style.borderColor= '';
    }
  };
  
  return (
    <>
      <Head>
        <title>Cadastro de safra</title>
      </Head>

      <Content contentHeader={tabsDropDowns}>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Nova safra</h1>

          <div className="w-full flex justify-between items-start gap-5">
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Ano
              </label>

              <InputMask
                mask="99/99"
                required
                id="year"
                name="year"
                placeholder=""
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

    
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Período ideal de início de plantio
              </label>
              <Input
                type="date" 
                required
                id="plantingStartTime"
                name="plantingStartTime"
                onChange={formik.handleChange}
                value={formik.values.plantingStartTime}
              />
            </div>
            
            <div className="w-2/4">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Período ideal do fim do plantio
              </label>
              <Input
                type="date"
                required
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
