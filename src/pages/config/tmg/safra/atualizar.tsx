import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import Head from "next/head";
import { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { MdDateRange } from "react-icons/md";

import { 
  Button, 
  Content, 
  Input, 
  Radio, 
  Select, 
  TabHeader 
} from "src/components";
import { safraService } from "src/services";
import Swal from "sweetalert2";
import * as ITabs from '../../../../shared/utils/dropdown';

interface ISafraProps {
  id: number;
  id_culture: number;
  year: string;
  typeCrop: string;
  plantingStartTime: string;
  plantingEndTime: string;
  status: number;
};

export default function AtualizarSafra(safra: ISafraProps) {
  const { tmgDropDown, tabs } = ITabs.default;

  const [checkeBox, setCheckeBox] = useState<boolean>();
  const select = [
    { id: 1, name: "Ativo" },
    { id: 2, name: "Inativo" },
  ];
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  const formik = useFormik<ISafraProps>({
    initialValues: {
      id: safra.id,
      id_culture: safra.id_culture,
      year: safra.year,
      typeCrop: safra.typeCrop,
      plantingStartTime: safra.plantingStartTime,
      plantingEndTime: safra.plantingEndTime,
      status: safra.status,
    },
    onSubmit: async (values) => {
      await safraService.updateSafras({
        id: safra.id,
        id_culture: formik.values.id_culture,
        year: formik.values.year,
        typeCrop: formik.values.typeCrop,
        plantingStartTime: formik.values.plantingStartTime,
        plantingEndTime: formik.values.plantingEndTime,
        status: formik.values.status,
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire('Safra atualizada com sucesso!');
        } else {
          Swal.fire(response.message);
        }
      })
    },
  });

  useEffect(() => {
    if (formik.values.typeCrop === "Inverno" || formik.values.typeCrop === "Verão") {
      setCheckeBox(true);
    } else {
      setCheckeBox(false);
    }
  }, [formik.values.typeCrop]);

  return (
    <>
      <Head><title>Atualizar safra</title></Head>
      <Content headerCotent={
        <TabHeader data={tabs} dataDropDowns={tmgDropDown} />
      }>
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
                Ano
              </label>
              <Input
                type="text"
                required
                id="year"
                name="year"
                maxLength={10}
                onChange={formik.handleChange}
                value={formik.values.year}
              />
            </div>

            <div className="w-4/12 h-10 justify-start">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Tipo de safra
              </label>
              <div className="w-full h-full flex gap-4 items-center">
                <Radio
                  title="Verão"
                  id="typeCrop"
                  name="typeCrop"
                  checked={checkeBox}
                  onChange={formik.handleChange}
                  value={formik.values.typeCrop = 'Verão'}
                />

                <Radio
                  title="Inverno"
                  id="typeCrop"
                  name="typeCrop"
                  checked={checkeBox}
                  onChange={formik.handleChange}
                  value={formik.values.typeCrop = 'Inverno'}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-start gap-5 mt-4">
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Período ideal de início de plantio
              </label>
              <Input
                type="text" 
                placeholder="Ex: 04/23"
                id="plantingStartTime"
                name="plantingStartTime"
                maxLength={5}
                onChange={formik.handleChange}
                value={formik.values.plantingStartTime}
              />
            </div>
            
            <div className="w-2/4">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Período ideal do fim do plantio
              </label>
              <Input
                type="text" 
                placeholder="Ex: 03/24" 
                id="plantingEndTime"
                name="plantingEndTime"
                maxLength={5}
                onChange={formik.handleChange}
                value={formik.values.plantingEndTime}
              />
            </div>

            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Status
              </label>
              <Select
                id="plantingEndTime"
                name="plantingEndTime"
                onChange={formik.handleChange}
                selected={formik.values.status}
                value={formik.values.status}
                values={select}
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
                type="submit"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                href='/config/tmg/safra'
                onClick={() => {}}
              />
            </div>
            <div className="w-40">
              <Button
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
