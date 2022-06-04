import { capitalize } from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from 'next/router';
import { FiUserPlus } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";
import { tecnologiaService } from "src/services";
import Swal from 'sweetalert2';
import {
  Button, Content,
  Input
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';

interface ITecnologiaProps {
  id: number;
  id_culture: number;
  name: string;
  cod_tec: string;
  desc: string;
  created_by: number;
  status: number;
};

export default function NovoLocal() {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  const router = useRouter();

  const formik = useFormik<ITecnologiaProps>({
    initialValues: {
      id: 1,
      id_culture: parseInt(culture),
      name: '',
      cod_tec: '',
      desc: '',
      created_by: userLogado.id,
      status: 1
    },
    onSubmit: async (values) => {

      validateInputs(values)
      if (!values.cod_tec || !values.name) {
        Swal.fire('Preencha todos os campos obrigatórios')
        return
      }

      await tecnologiaService.create({
        id_culture: parseInt(culture),
        name: capitalize(values.name),
        cod_tec: capitalize(values.cod_tec),
        desc: capitalize(values.desc),
        created_by: Number(userLogado.id),
        status: 1
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Tecnologia cadastrada com sucesso!');
          router.back();
        } else {
          Swal.fire(response.message)
        }
      })
    },
  });

  function validateInputs(values: any) {
    if (!values.name || !values.cod_tec) {
      let inputname: any = document.getElementById("name");
      let inputcod_tec: any = document.getElementById("cod_tec");

      inputname.style.borderColor = 'red';
      inputcod_tec.style.borderColor = 'red';
    }
    else {
      let inputname: any = document.getElementById("name");
      inputname.style.borderColor = '';
    }
  }

  return (
    <>
      <Head>
        <title>Nova tecnologia</title>
      </Head>

      <Content contentHeader={tabsDropDowns}>
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Nova tecnologia</h1>
          </div>

          <div className="w-1/2
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Código Tecnologia
              </label>
              <Input
                type="text"
                placeholder="TA"
                id="cod_tec"
                name="cod_tec"
                maxLength={2}
                onChange={formik.handleChange}
                value={formik.values.cod_tec}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Nome
              </label>
              <Input
                type="text"
                placeholder="Nome"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Descrição
              </label>
              <Input
                type="text"
                placeholder="Descrição"
                id="desc"
                name="desc"
                onChange={formik.handleChange}
                value={formik.values.desc}
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
                onClick={() => { router.back(); }}
              />
            </div>
            <div className="w-40">
              <Button
                type="submit"
                icon={<FiUserPlus size={18} />}
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                onClick={() => { }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}