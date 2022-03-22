import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'
import { IoMdArrowBack } from "react-icons/io";
import { delineamentoService } from "src/services";

import {
  TabHeader,
  Content,
  Input,
  Button,
} from "../../../components";

import * as ITabs from '../../../shared/utils/dropdown';

interface IDelineamentoProps {
  id: Number | any;
  name: String | any;
  repeticao: Number;
  trat_repeticao: Number;
  created_by: Number;
  status: Number;
};

export default function NovoLocal() {
  const { tmgDropDown, tabs } = ITabs.default;
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const router = useRouter();
  const formik = useFormik<IDelineamentoProps>({
    initialValues: {
      id: 1,
      name: '',
      repeticao: 0,
      trat_repeticao: 0,
      created_by: userLogado.id,
      status: 1
    },
    onSubmit: (values) => {      
      validateInputs(values);
      if (!values.name || !values.repeticao || !values.trat_repeticao)  { return; } 

      delineamentoService.create({
        name:values.name,
        repeticao: Number(values.repeticao),
        trat_repeticao: Number(values.trat_repeticao),
        created_by: Number(userLogado.id),
        status: 1
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire('Delineamento cadastrado com sucesso!')
          router.push('/config/delineamento');
        } else {
          Swal.fire(response.message)
        }
      })
    },
  });

  function validateInputs(values: any) {
    if (!values.name) { let inputname: any = document.getElementById("name"); inputname.style.borderColor= 'red'; } else { let inputname: any = document.getElementById("name"); inputname.style.borderColor= ''; }
    if (!values.repeticao) { let inputrepeticao: any = document.getElementById("repeticao"); inputrepeticao.style.borderColor= 'red'; } else { let inputrepeticao: any = document.getElementById("repeticao"); inputrepeticao.style.borderColor= ''; }
    if (!values.trat_repeticao) { let inputtrat_repeticao: any = document.getElementById("trat_repeticao"); inputtrat_repeticao.style.borderColor= 'red'; } else { let inputtrat_repeticao: any = document.getElementById("trat_repeticao"); inputtrat_repeticao.style.borderColor= ''; }
  }

  return (
    <>
      <Head>
        <title>Novo Delineamento</title>
      </Head>

      <Content headerCotent={
        <TabHeader data={tabs} dataDropDowns={tmgDropDown} />
      }>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Novo Delineamento</h1>
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
                Nome Delineamento
              </label>
              <Input 
                type="text" 
                placeholder="Nome Delineamento" 
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Repetição
              </label>
              <Input 
                type="text" 
                placeholder="4" 
                id="repeticao"
                name="repeticao"
                onChange={formik.handleChange}
                value={Number(formik.values.repeticao)}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Trat. Repetição
              </label>
              <Input 
                type="text" 
                placeholder="14x08(p4)-PY" 
                id="trat_repeticao"
                name="trat_repeticao"
                onChange={formik.handleChange}
                value={Number(formik.values.trat_repeticao)}
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
                type="submit"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                onClick={() => {router.push('/config/layoult-quadra/')}}
              />
            </div>
            <div className="w-40">
              <Button 
                type="submit"
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