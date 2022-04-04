import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import InputMask from 'react-input-mask';
import {
  Button,
  Content,
  Input,
  Radio
} from "src/components";
import { safraService } from "src/services";
import Swal from "sweetalert2";
import * as ITabs from '../../../../shared/utils/dropdown';



interface ISafraProps {
  id: number;
  // id_culture: number;
  year: string;
  typeCrop: string;
  plantingStartTime: string;
  plantingEndTime: string;
  status: number;
};

export default function AtualizarSafra(safra: ISafraProps) {
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
  const [typeCrop, setTypeCrop] = useState<string>(safra.typeCrop);

  const select = [
    { id: 1, name: "Ativo" },
    { id: 2, name: "Inativo" },
  ];
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  const formik = useFormik<ISafraProps>({
    initialValues: {
      id: safra.id,
      // id_culture: safra.id_culture,
      year: safra.year,
      typeCrop,
      plantingStartTime: safra.plantingStartTime,
      plantingEndTime: safra.plantingEndTime,
      status: safra.status,
    },
    onSubmit: async (values) => {
      if (values.id !== safra.id) throw new Error("Dados inválidos");
      if (values.typeCrop === '' || !values.typeCrop) throw new Error("Dados inválidos");

      await safraService.updateSafras({
        id: safra.id,
        // id_culture: safra.id_culture,
        year: formik.values.year,
        typeCrop,
        plantingStartTime: formik.values.plantingStartTime,
        plantingEndTime: formik.values.plantingEndTime,
        status: formik.values.status,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Safra atualizada com sucesso!');
          router.back();
        } else {
          setCheckInput("text-red-600");
          Swal.fire(response.message);
        }
      });
    },
  });

  useEffect(() => {
    if (typeCrop === "Inverno") {
      setCheckeBox2(true);
      setCheckeBox(false);
    } else {
      setCheckeBox2(false);
      setCheckeBox(true);
    }
  }, [typeCrop]);

  return (
    <>
      <Head><title>Atualizar safra</title></Head>
      <Content contentHeader={tabsDropDowns}>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Nova safra</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-4">
            <div className="w-4/12">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Código
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                required
                disabled
                id="id"
                name="id"
                value={formik.values.id}
              />
            </div>

            <div className="w-4/12 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Ano
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

            <div className="w-4/12 h-10 justify-start">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Tipo de safra
              </label>
              <div className="w-full h-full flex gap-4 items-center">
                <Radio
                  title="Verão"
                  id="typeCrop"
                  name="typeCrop"
                  checked={checkeBox}
                  onChange={event => setTypeCrop(event.target.value)}
                  value='Verão'
                />

                <Radio
                  title="Inverno"
                  id="typeCrop"
                  name="typeCrop"
                  checked={checkeBox2}
                  onChange={event => setTypeCrop(event.target.value)}
                  value='Inverno'
                />
              </div>
            </div>
          </div>

          <div className="w-8/12 flex justify-between items-start gap-5 mt-4">
            <div className="w-full h-10">
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
            
            <div className="w-full h-10">
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
            mt-12
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
                icon={<MdDateRange size={18} />}
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
  const baseUrlList = `${publicRuntimeConfig.apiUrl}/safra`;
  const  token  =  context.req.cookies.token;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };

  const apiSafra = await fetch(`${baseUrlList}/` + context.query.id, requestOptions);

  const safra = await apiSafra.json();

  return { props: safra  }
}
