import { capitalize } from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from 'next/router';
import { IoMdArrowBack } from "react-icons/io";
import { MdUpdate } from "react-icons/md";
import { epocaService } from "src/services";
import Swal from 'sweetalert2';
import {
  Button, Content,
  Input
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';

interface IEpocaProps {
  id_culture: number;
  name: string;
  created_by: number;
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

  const formik = useFormik<IEpocaProps>({
    initialValues: {
      id_culture: parseInt(culture),
      name: '',
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {      
      validateInputs(values);
      if (!values.name)  { return; } 

      await epocaService.create({
        id_culture: parseInt(culture),
        name: capitalize(values.name),
        created_by: parseInt(userLogado.id),
      }).then((response) => {
        if (response.status === 201) {
          Swal.fire('Época cadastrada com sucesso!');
          router.push('/config/ensaio/epoca');
        } else {
          Swal.fire(response.message)
        }
      })
    },
  });

  function validateInputs(values: any) {
    if (!values.name) { let inputname: any = document.getElementById("name"); inputname.style.borderColor= 'red'; } else { let inputname: any = document.getElementById("name"); inputname.style.borderColor= ''; }
  }

    return (
    <>
      <Head>
        <title>Nova época</title>
      </Head>

      <Content contentHeader={tabsDropDowns}>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Nova época</h1>
          </div>

          <div className="
            w-full
            gap-6
            mt-4
            mb-4
          ">
            <div className="w-2/4">
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
                onClick={() => {router.back();}}
              />
            </div>
            <div className="w-40">
              <Button 
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                icon={<MdUpdate size={18} />}
                textColor="white"
                onClick={() => {}}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}