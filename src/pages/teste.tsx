import Head from 'next/head';
import readXlsxFile from 'read-excel-file';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import { FiUserPlus } from 'react-icons/fi';
import React from 'react';
import { Content } from '../components/Content/index';
import { importService } from '../services';
import ITabs from '../shared/utils/dropdown';
import { Button, Input } from '../components';

export default function Teste() {
  const { TabsDropDowns } = ITabs;
  function readExcel(value: any) {
    readXlsxFile(value[0]).then((rows) => {
      importService.validate({
        spreadSheet: rows, moduleId: 1, safra: '22/21', foco: 'SUL', grupoF: 1, created_by: 1,
      }).then((response) => {
        if (response.message !== '') {
          Swal.fire({
            html: response.message,
            width: '800',
          });
        }
      });
    });
  }

  const formik = useFormik({
    initialValues: {
      input: [],
    },
    onSubmit: async (values) => {

    },
  });
  return (
    <>
      <Head>
        <title>Nova NPE</title>
      </Head>
      <Content contentHeader={TabsDropDowns()} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8 overflow-y-scroll"
          onSubmit={formik.handleSubmit}
        >
          {/* <Input
                type="file"
                required
                id="input"
                name="input"
              /> */}
          <input type="file" id="inptesteut" onChange={(e) => readExcel(e.target.files)} />
          <div className="
              h-10 w-full
              flex
              gap-3
              justify-center
              mt-10
            "
          >
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
