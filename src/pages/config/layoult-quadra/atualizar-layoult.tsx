import { GetServerSideProps } from "next";
import { useFormik } from "formik";
import Head from "next/head";
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'
import { IoMdArrowBack } from "react-icons/io";
import { layoultQuadraService } from "src/services";
import InputMask from "react-input-mask";

import {
  TabHeader,
  Content,
  Input,
  Select,
  Button,
} from "../../../components";

import * as ITabs from '../../../shared/utils/dropdown';

interface ILayoultProps {
  id: Number | any;
  esquema: String | any;
  op: String | any;
  semente_metros: Number | any;
  disparos: Number | any;
  divisor: Number | any;
  largura: Number | any;
  comp_fisico: Number | any;
  comp_parcela: Number | any;
  comp_corredor: Number | any;
  t4_inicial: Number | any;
  t4_final: Number | any;
  df_inicial: Number | any;
  df_final: Number | any;
  localId: Number | any;
  created_by: number | any;
  status: Number;
};


export interface IData {
  local: object | any;
  layoultEdit: ILayoultProps;
}

export default function NovoLocal({ local, layoultEdit }: IData) {
  const { tmgDropDown, tabs } = ITabs.default;
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const locais: object | any =  [];
  const router = useRouter();
  const formik = useFormik<ILayoultProps>({
    initialValues: {
      id: layoultEdit.id,
      esquema: layoultEdit.esquema,
      op: layoultEdit.op,
      semente_metros: layoultEdit.semente_metros,
      disparos: layoultEdit.disparos,
      divisor: layoultEdit.divisor,
      largura: layoultEdit.largura,
      comp_fisico: layoultEdit.comp_fisico,
      comp_parcela: layoultEdit.comp_parcela,
      comp_corredor: layoultEdit.comp_corredor,
      t4_inicial: layoultEdit.t4_inicial,
      t4_final: layoultEdit.t4_final,
      df_inicial: layoultEdit.df_inicial,
      df_final: layoultEdit.df_final,
      localId: layoultEdit.localId,
      created_by: userLogado.id,
      status: 1
    },
    onSubmit: (values) => {      
      validateInputs(values);
      if (!values.esquema || !values.op || !values.semente_metros || !values.disparos || !values.divisor || !values.largura || !values.comp_fisico || !values.comp_parcela  || !values.comp_corredor  || !values.t4_inicial  || !values.t4_final || !values.df_inicial || !values.df_final || !values.localId)  { return; } 

      layoultQuadraService.update({
        id: values.id,
        esquema:values.esquema,
        op:values.op,
        semente_metros: Number(values.semente_metros),
        disparos: Number(values.disparos),
        divisor: Number(values.divisor),
        largura:values.largura,
        comp_fisico:values.comp_fisico,
        comp_parcela:values.comp_parcela,
        comp_corredor:values.comp_corredor,
        t4_inicial: Number(values.t4_inicial),
        t4_final: Number(values.t4_final),
        df_inicial: Number(values.df_inicial),
        df_final: Number (values.df_final),
        localId: Number(values.localId),
        created_by: Number(userLogado.id),
        status: 1
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire('Local atualizado com sucesso!')
          router.push('/config/layoult-quadra');
        } else {
          Swal.fire(response.message)
        }
      })
    },
  });

  local.map((value: string | object | any) => {
    locais.push({id: value.id, name: value.name});
  })
  function validateInputs(values: any) {
    if (!values.esquema) { let inputesquema: any = document.getElementById("esquema"); inputesquema.style.borderColor= 'red'; } else { let inputesquema: any = document.getElementById("esquema"); inputesquema.style.borderColor= ''; }
    if (!values.op) { let inputop: any = document.getElementById("op"); inputop.style.borderColor= 'red'; } else { let inputop: any = document.getElementById("op"); inputop.style.borderColor= ''; }
    if (!values.localId) { let inputlocalId: any = document.getElementById("localId"); inputlocalId.style.borderColor= 'red'; } else { let inputlocalId: any = document.getElementById("localId"); inputlocalId.style.borderColor= ''; }
    if (!values.semente_metros) { let inputsemente_metros: any = document.getElementById("semente_metros"); inputsemente_metros.style.borderColor= 'red'; } else { let inputsemente_metros: any = document.getElementById("semente_metros"); inputsemente_metros.style.borderColor= ''; }
    if (!values.disparos) { let inputdisparos: any = document.getElementById("disparos"); inputdisparos.style.borderColor= 'red'; } else { let inputdisparos: any = document.getElementById("disparos"); inputdisparos.style.borderColor= ''; }
    if (!values.divisor) { let inputdivisor: any = document.getElementById("divisor"); inputdivisor.style.borderColor= 'red'; } else { let inputdivisor: any = document.getElementById("divisor"); inputdivisor.style.borderColor= ''; }
    if (!values.largura) { let inputlargura: any = document.getElementById("largura"); inputlargura.style.borderColor= 'red'; } else { let inputlargura: any = document.getElementById("largura"); inputlargura.style.borderColor= ''; }
    if (!values.comp_fisico) { let inputcomp_fisico: any = document.getElementById("comp_fisico"); inputcomp_fisico.style.borderColor= 'red'; } else { let inputcomp_fisico: any = document.getElementById("comp_fisico"); inputcomp_fisico.style.borderColor= ''; }
    if (!values.comp_parcela) { let inputcomp_parcela: any = document.getElementById("comp_parcela"); inputcomp_parcela.style.borderColor= 'red'; } else { let inputcomp_parcela: any = document.getElementById("comp_parcela"); inputcomp_parcela.style.borderColor= ''; }
    if (!values.comp_corredor) { let inputcomp_corredor: any = document.getElementById("comp_corredor"); inputcomp_corredor.style.borderColor= 'red'; } else { let inputcomp_corredor: any = document.getElementById("comp_corredor"); inputcomp_corredor.style.borderColor= ''; }
    if (!values.t4_inicial) { let inputt4_inicial: any = document.getElementById("t4_inicial"); inputt4_inicial.style.borderColor= 'red'; } else { let inputt4_inicial: any = document.getElementById("t4_inicial"); inputt4_inicial.style.borderColor= ''; }
    if (!values.t4_final) { let inputt4_final: any = document.getElementById("t4_final"); inputt4_final.style.borderColor= 'red'; } else { let inputt4_final: any = document.getElementById("t4_final"); inputt4_final.style.borderColor= ''; }
    if (!values.df_inicial) { let inputdf_inicial: any = document.getElementById("df_inicial"); inputdf_inicial.style.borderColor= 'red'; } else { let inputdf_inicial: any = document.getElementById("df_inicial"); inputdf_inicial.style.borderColor= ''; }
    if (!values.df_final) { let inputdf_final: any = document.getElementById("df_final"); inputdf_final.style.borderColor= 'red'; } else { let inputdf_final: any = document.getElementById("df_final"); inputdf_final.style.borderColor= ''; }
  }

  return (
    <>
      <Head>
        <title>Atualizar Layoult Quadra</title>
      </Head>

      <Content headerCotent={
        <TabHeader data={tabs} dataDropDowns={tmgDropDown} />
      }>
        <form 
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Novo Layoult</h1>
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
                Código
              </label>
              <Input 
                type="text" 
                placeholder="14x08(p4)-PY" 
                id="id"
                name="id"
                disabled
                onChange={formik.handleChange}
                value={formik.values.id}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Esquema
              </label>
              <Input 
                type="text" 
                placeholder="14x08(p4)-PY" 
                id="esquema"
                name="esquema"
                onChange={formik.handleChange}
                value={formik.values.esquema}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                OP
              </label>
              <Input 
                type="text" 
                placeholder="QMCG-01" 
                id="op"
                name="op"
                onChange={formik.handleChange}
                value={formik.values.op}
              />
            </div>  
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Local
              </label>
              <Select
                values={locais}
                id="localId"
                name="localId"
                onChange={formik.handleChange}
                value={formik.values.localId}
                selected={false}
              />
            </div>  
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Sementes por Metros
              </label>
              <Input 
                type="number" 
                placeholder="10"
                id="semente_metros"
                name="semente_metros"
                onChange={formik.handleChange}
                value={formik.values.semente_metros}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Disparos
              </label>
              <Input 
                type="text" 
                placeholder="1"
                id="disparos"
                name="disparos"
                onChange={formik.handleChange}
                value={formik.values.disparos}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Divisor
              </label>
              <Input 
                type="text" 
                placeholder="1"
                id="divisor"
                name="divisor"
                onChange={formik.handleChange}
                value={formik.values.divisor}
              />
            </div>
          </div>

          <div className="w-full
            flex
            justify-between
            gap-6
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Largura
              </label>
              <InputMask 
                 className="shadow
                 appearance-none
                 bg-white bg-no-repeat
                 border border-solid border-gray-300
                 rounded
                 w-full
                 py-2 px-3
                 text-gray-900
                 leading-tight
                 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
               "
                mask="99.99" 
                type="text" 
                placeholder="25.2"
                id="largura"
                name="largura"
                onChange={formik.handleChange}
                value={formik.values.largura}
              />
            </div>    
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Comp. Físico
              </label>
              <InputMask 
                 className="shadow
                 appearance-none
                 bg-white bg-no-repeat
                 border border-solid border-gray-300
                 rounded
                 w-full
                 py-2 px-3
                 text-gray-900
                 leading-tight
                 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
               "
                mask="99.99" 
                type="text" 
                placeholder="25.2"
                id="comp_fisico"
                name="comp_fisico"
                onChange={formik.handleChange}
                value={formik.values.comp_fisico}
              />
            </div>   
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Comp. da Parcela
              </label>
              <InputMask 
                 className="shadow
                 appearance-none
                 bg-white bg-no-repeat
                 border border-solid border-gray-300
                 rounded
                 w-full
                 py-2 px-3
                 text-gray-900
                 leading-tight
                 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
               "
                mask="99.99" 
                type="text" 
                placeholder="25.2"
                id="comp_parcela"
                name="comp_parcela"
                onChange={formik.handleChange}
                value={formik.values.comp_parcela}
              />
            </div>    
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Comp. Corredor
              </label>
              <InputMask 
                 className="shadow
                 appearance-none
                 bg-white bg-no-repeat
                 border border-solid border-gray-300
                 rounded
                 w-full
                 py-2 px-3
                 text-gray-900
                 leading-tight
                 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
               "
                mask="99.99" 
                type="text" 
                placeholder="25.2"
                id="comp_corredor"
                name="comp_corredor"
                onChange={formik.handleChange}
                value={formik.values.comp_corredor}
              />
            </div>       
          </div>

          <div className="w-full
            flex 
            justify-around
            gap-6
            mb-4
          ">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                T4 Inicial
              </label>
              <Input 
                type="number" 
                placeholder="10"
                id="t4_inicial"
                name="t4_inicial"
                onChange={formik.handleChange}
                value={formik.values.t4_inicial}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                T4 Final
              </label>
              <Input 
                type="text" 
                placeholder="1"
                id="t4_final"
                name="t4_final"
                onChange={formik.handleChange}
                value={formik.values.t4_final}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                DF Inicial
              </label>
              <Input 
                type="text" 
                placeholder="1"
                id="df_inicial"
                name="df_inicial"
                onChange={formik.handleChange}
                value={formik.values.df_inicial}
              />
            </div>
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                DF Final
              </label>
              <Input 
                type="text" 
                placeholder="1"
                id="df_final"
                name="df_final"
                onChange={formik.handleChange}
                value={formik.values.df_final}
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

export const getServerSideProps:GetServerSideProps = async (context) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrlLayoult = `${publicRuntimeConfig.apiUrl}/layoult-quadra`;
  const baseUrlLocal = `${publicRuntimeConfig.apiUrl}/local`;

  const  token  =  context.req.cookies.token;
  
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  };

  const apiLocal = await fetch(baseUrlLocal, requestOptions);
  const resU = await fetch(`${baseUrlLayoult}/` + context.query.id, requestOptions)

  const layoultEdit = await resU.json();
  let local = await apiLocal.json();
  local = local.response
  return { props: { local, layoultEdit  } }
}


