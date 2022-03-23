import Head from "next/head";
import Swal from "sweetalert2";
import { useFormik } from "formik";

import { portfolioService } from "src/services/portfolio.service";

import { Content, Input, TabHeader, Button } from "src/components";

import  * as ITabs from '../../../../shared/utils/dropdown';

import { IoMdArrowBack } from "react-icons/io";
import { SiMicrogenetics } from "react-icons/si";
import { useRouter } from "next/router";

export interface ICreatePortfolio {
  id_culture: number;
  genealogy: string;
  cruza: string;
  status: number;
  created_by: number;
}

export default function  Portfolio() {
  const router = useRouter();
  
  const { tmgDropDown, tabs } = ITabs.default;

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const id_culture = userLogado.userCulture.cultura_selecionada as string;

  const formik = useFormik<ICreatePortfolio>({
    initialValues: {
      id_culture: Number(id_culture),
      genealogy: '',
      cruza: '',
      status: 1,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      await portfolioService.create({
        id_culture: formik.values.id_culture,
        genealogy: formik.values.genealogy,
        cruza: formik.values.cruza,
        status: formik.values.status,
        created_by: formik.values.created_by,
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire('Portfólio cadastrado com sucesso!');
        } else {
          Swal.fire(response.message);
          router.back();
        }
      }).finally(() => {
        formik.values.genealogy = '';
        formik.values.cruza = '';
      });
    },
  });
  
  return (
    <>
    <Head>
      <title>Cadastro de portfólio</title>
    </Head>

    <Content
      headerCotent={
        <TabHeader data={tabs} dataDropDowns={tmgDropDown} />
      }
    >
      <form 
        className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl">Novo portfólio</h1>

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
              onClick={() => {}}
            />
          </div>
        </div>
      </form>
    </Content>
  </>
  );
}
