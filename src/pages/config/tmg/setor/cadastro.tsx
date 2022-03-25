import Head from "next/head";
import { useFormik } from 'formik';
import { IoMdArrowBack } from "react-icons/io";
import { MdDateRange } from "react-icons/md";

import { departmentService } from 'src/services';

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

interface IDepartmentProps {
  name: string;
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

  const formik = useFormik<IDepartmentProps>({
    initialValues: {
      name: '',
      created_by: Number(userLogado.id),
    },
    onSubmit: async (values) => {
      if (formik.values.name === '') throw new Error('Dados inválidos');

      await departmentService.create({
        name: formik.values.name,
        created_by: formik.values.created_by,
      }).then((response) => {
        if (response.status === 201) {
          Swal.fire('Setor cadastrado com sucesso!');
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
        <title>Cadastro de setor</title>
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
          <h1 className="text-2xl">Novo setor</h1>

          <div className="w-full flex justify-between items-start gap-5">
            <div className="w-2/4 h-10 mt-2">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                <strong className={checkInput}>*</strong>
                Nome
              </label>
              <Input
                type="text"
                required
                maxLength={50}
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
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
