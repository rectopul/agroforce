import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'
import { IoMdArrowBack } from "react-icons/io";
import { ogmService } from "src/services";

import {
  TabHeader,
  Content,
  Input,
  Button,
} from "../../../../components";

import * as ITabs from '../../../../shared/utils/dropdown';
import { FiUserPlus } from "react-icons/fi";

interface IOGMProps {
  id: Number | any;
  name: String | any;
  created_by: Number;
  status: Number;
};


export default function NovoLocal() {
  const { ensaiosDropDown, tabs } = ITabs.default;
  
  tabs.map((tab) => (
    tab.title === 'ENSAIO'
    ? tab.status = true
    : tab.status = false
  ));

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const router = useRouter();
  const formik = useFormik<IOGMProps>({
    initialValues: {
      id: 1,
      name: '',
      created_by: userLogado.id,
      status: 1
    },
    onSubmit: (values) => {      
      validateInputs(values);
      if (!values.name)  { return; } 

      ogmService.create({
        name:values.name,
        created_by: Number(userLogado.id),
        status: 1
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire('OGM cadastrado com sucesso!')
          router.back();
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
        <title>Novo OGM</title>
      </Head>

      <Content headerCotent={
        <TabHeader data={tabs} dataDropDowns={ensaiosDropDown} />
      }>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Novo OGM</h1>
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
          ">
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
                icon={<FiUserPlus size={18} />}
                value="Cadastrar"
                bgColor="bg-blue-600"
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