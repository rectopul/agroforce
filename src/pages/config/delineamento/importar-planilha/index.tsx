import Head from "next/head";
import readXlsxFile from 'read-excel-file'
import { importService } from "src/services/";
import  * as ITabs from '../../../../shared/utils/dropdown';
import {  Button,  Content, Input, Select } from "../../../../components";
import Swal from 'sweetalert2';
import { useFormik } from "formik";
import { FiUserPlus } from "react-icons/fi";
import React from "react";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from 'next/router';

export default function Importar() {
  const { TabsDropDowns } = ITabs;
  const router = useRouter();

  function readExcel(value: any) {
    const userLogado = JSON.parse(localStorage.getItem("user") as string);

    readXlsxFile(value[0]).then((rows) => {
      importService.validate({spreadSheet: rows, moduleId: 7, id_culture: userLogado.userCulture.cultura_selecionada ,created_by: userLogado.id}).then((response) => {
        if (response.message !== '') {
          Swal.fire({
            html: response.message,
            width: "800"});
            if (!response.erro) { 
              router.back();
            }
        }
      });
    })
  }
 
  const formik = useFormik<any>({
    initialValues: {
      input: [],
    },
    onSubmit: async (values) => {
      console.log("Values:", values);
        var inputFile: any = document.getElementById("inputFile");
        readExcel(inputFile.files);
    },
  });
  return (
    <>
      <Head>
        <title>Importação Delineamento</title>
      </Head>
      <Content contentHeader={TabsDropDowns()}>
        <form 
          className="w-full bg-white shadow-md rounded p-8 overflow-y-scroll"
          onSubmit={formik.handleSubmit}
        >
             <div className="w-full
                flex 
                justify-around
                gap-6
                mt-4
                mb-4
            ">
                <div className="w-full h-10">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                        *Excel
                    </label>
                        <Input 
                            type="file"
                            required
                            id="inputFile"
                            name="inputFile"
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
                onClick={() => {router.back();}}
                icon={<IoMdArrowBack size={18} />}
              />
            </div>
              <div className="w-40">
                <Button 
                  type="submit"
                  value="Cadastrar"
                  bgColor="bg-blue-600"
                  textColor="white"
                  icon={<FiUserPlus size={18} />}
                  onClick={() => {}}
                />
              </div>
            </div>
        </form>
      </Content>
   </>
  );
}


// export const getServerSideProps:GetServerSideProps = async ({req}) => {
//     const { publicRuntimeConfig } = getConfig();
//     const  token  =  req.cookies.token;
//     const  cultureId  =  req.cookies.cultureId;
  
//     let param = `filterStatus=1&id_culture=${cultureId}`;

//     const urlParametersSafra: any = new URL(`${publicRuntimeConfig.apiUrl}/safra`);
//     urlParametersSafra.search = new URLSearchParams(param).toString();

//     const urlParametersFoco: any = new URL(`${publicRuntimeConfig.apiUrl}/foco`);
//     urlParametersFoco.search = new URLSearchParams(param).toString();

//     const requestOptions: RequestInit | undefined = {
//       method: 'GET',
//       credentials: 'include',
//       headers:  { Authorization: `Bearer ${token}` }
//     };
  
//     const apiSafra = await fetch(urlParametersSafra.toString(), requestOptions);
//     const apiFoco = await fetch(urlParametersFoco.toString(), requestOptions);
//     let safra:any = await apiSafra.json();
//     let foco = await apiFoco.json();
    
//     safra = safra.response;
//     foco = foco.response;

//     return { props: { safra, foco } }
// }
