import Head from 'next/head';
import { useFormik } from 'formik'
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { focoService } from 'src/services/foco.service';

import { 
  Button,
  Content, 
  Input, 
  TabHeader
} from "../../../../components";

import  * as ITabs from '../../../../shared/utils/dropdown';

import { IoMdArrowBack } from 'react-icons/io';
import { AiOutlineFileSearch } from 'react-icons/ai';

interface ICreateFoco {
  name: string;
  created_by: number;
}

export default function Cadastro() {
  const router = useRouter();
  const [checkInput, setCheckInput] = useState('text-black');
  
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const { ensaiosDropDown, tabs } = ITabs.default;

  const formik = useFormik<ICreateFoco>({
    initialValues: {
      name: '',
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      await focoService.create({
        name: formik.values.name,
        created_by: formik.values.created_by,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Foco cadastrado com sucesso!');
          router.back();
        } else {
          setCheckInput("text-red-600");
          Swal.fire(response.message)
        }
      }).finally(() => {
        formik.values.name = '';
      });
    },
  });

  return (
    <>
     <Head>
        <title>Novo foco</title>
      </Head>
      
      <Content
        headerCotent={
          <TabHeader data={tabs} dataDropDowns={ensaiosDropDown} />
        }
      >

      <form 
        className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"

        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl">Novo foco</h1>

        <div className="w-full
          flex
          mt-4
          mb-4
        ">
          <div className="w-2/4 h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              <strong className={checkInput}>*</strong>
              Nome foco
            </label>
            <Input
              id="name"
              name="name"
              type="text" 
              max="50" 
              placeholder="ex: Foco 321"
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
                onClick={() => router.back()}
              />
            </div>
            <div className="w-40">
              <Button
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<AiOutlineFileSearch size={20} />}
                onClick={() => {}}
              />
            </div>
          </div>
      </form>
      </Content>
    </>
  );
}
