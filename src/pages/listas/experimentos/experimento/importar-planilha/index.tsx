import Head from 'next/head';
import readXlsxFile from 'read-excel-file';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import { FiUserPlus } from 'react-icons/fi';
import React from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { IoMdArrowBack } from 'react-icons/io';
import { useRouter } from 'next/router';
import {
  Button, Content, Input,
} from '../../../../../components';
import * as ITabs from '../../../../../shared/utils/dropdown';
import { importService } from '../../../../../services';

interface IData {
  idSafra: number;
  idCulture: number;
}
export default function Importar({ idSafra, idCulture }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs;
  const router = useRouter();
  function readExcel(value: any) {
    const userLogado = JSON.parse(localStorage.getItem('user') as string);

    readXlsxFile(value[0]).then((rows: any) => {
      importService.validate({
        spreadSheet: rows, moduleId: 22, idSafra, idCulture, created_by: userLogado.id, table: 'experimento',
      }).then(({ status, message }: any) => {
        if (status !== 200) {
          Swal.fire({
            html: message,
            width: '900',
          });
          router.back();
        }
        if (status === 200) {
          Swal.fire({
            html: message,
            width: '800',
          });
          router.back();
        }
      });
    });
  }

  const formik = useFormik<any>({
    initialValues: {
      input: [],
    },
    onSubmit: async () => {
      const inputFile: any = document.getElementById('inputFile');
      readExcel(inputFile.files);
    },
  });

  return (
    <>
      <Head>
        <title>Importação experimento</title>
      </Head>
      <Content contentHeader={TabsDropDowns('listas')} moduloActive="listas">
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

export const getServerSideProps: GetServerSideProps = async ({ req }: any) => {
  const idSafra = Number(req.cookies.safraId);
  const idCulture = Number(req.cookies.cultureId);

  return { props: { idSafra, idCulture } };
};
