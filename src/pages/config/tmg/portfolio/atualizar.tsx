import Head from "next/head";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import { useFormik } from "formik";

import { portfolioService } from "src/services/portfolio.service";
import Swal from "sweetalert2";

import { 
  Button, 
  Content, 
  Input, 
  Select, 
  TabHeader 
} from "src/components";

import { IoMdArrowBack } from "react-icons/io";
import { SiMicrogenetics } from "react-icons/si";

import * as ITabs from '../../../../shared/utils/dropdown';

export interface IUpdatePortfolio {
  id: number;
  id_culture: number;
  genealogy: string;
  cruza: string;
  status: number;
  created_by: number;
}

export default function AtualizarPortfolio(portfolio: IUpdatePortfolio) {
  const { tmgDropDown, tabs } = ITabs.default;

  const select = [
    { id: 1, name: "Ativo" },
    { id: 2, name: "Inativo" },
  ]
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  // const id_culture = userLogado.userCulture.cultura_selecionada as string;

  const formik = useFormik<IUpdatePortfolio>({
    initialValues: {
      id: portfolio.id,
      id_culture: portfolio.id_culture,
      genealogy: portfolio.genealogy,
      cruza: portfolio.cruza,
      status: portfolio.status,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      alert(JSON.stringify(values, null, 2));

      await portfolioService.update({
        id: portfolio.id,
        id_culture: formik.values.id_culture,
        genealogy: formik.values.genealogy,
        cruza: formik.values.cruza,
        status: portfolio.status,
        created_by: formik.values.created_by,
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire('Portfólio atualizado com sucesso!');
        } else {
          Swal.fire(response.message);
        }
      }).finally(() => {
        formik.values.genealogy = portfolio.genealogy;
        formik.values.cruza = portfolio.cruza;
      });
    },
  });

  return (
    <>
      <Head><title>Atualizar potfólio</title></Head>
      <Content headerCotent={
        <TabHeader data={tabs} dataDropDowns={tmgDropDown} />
      }>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar potfólio</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-5">
          <div className="w-full h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
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
  const baseUrlList = `${publicRuntimeConfig.apiUrl}/portfolio`;
  const  token  =  context.req.cookies.token;

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };

  const apiPortfolio = await fetch(`${baseUrlList}/` + context.query.id, requestOptions);

  const portfolio = await apiPortfolio.json();

  return { props: portfolio }
}
