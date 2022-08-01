import Head from 'next/head';
import readXlsxFile from 'read-excel-file';
import { importService } from 'src/services/';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import { FiUserPlus } from 'react-icons/fi';
import React from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { useRouter } from 'next/router';
import { Button, Content, Input } from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';

interface Idata {
  safra: any;
  foco: any;
}
export default function Importar() {
  const { TabsDropDowns } = ITabs;
  const router = useRouter();

  function readExcel(value: any) {
    const userLogado = JSON.parse(localStorage.getItem('user') as string);
    //console.log("cultura selecionada:");
    //console.log(userLogado);
    readXlsxFile(value[0]).then((rows) => {
      importService.validate({
        table: 'npe', spreadSheet: rows, moduleId: 14, id_culture:  userLogado.userCulture.cultura_selecionada, safra: userLogado.safras.safra_selecionada, created_by: userLogado.id,
      }).then((response) => {
        if (response.message !== '') {
          Swal.fire({
            html: response.message,
            width: '900',
          });
          if (!response.erro) {
            router.back();
          }
        }
      });
    });
  }

  const formik = useFormik<any>({
    initialValues: {
      input: [],
    },
    onSubmit: async (values) => {
      const inputFile: any = document.getElementById('inputFile');
      readExcel(inputFile.files);
    },
  });
  return (
    <>
      <Head>
        <title>Importação NPE</title>
      </Head>
      <Content contentHeader={TabsDropDowns()} moduloActive="config">
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
            "
          >

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
          {/* <input type="file" id="inptesteut"  onChange={e => readExcel(e.target.files)} /> */}
          <div className="
              h-10 w-full
              flex
              gap-3
              justify-center
              mt-10
            "
          >
            <div className="w-30">
              <Button
                type="button"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                onClick={() => { router.back(); }}
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
                onClick={() => { }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}
