import Head from "next/head";
import readXlsxFile from 'read-excel-file'
import { Content2 } from "../components/Content/index2";
import { importService } from "../services/";
import ITabs from "../shared/utils/dropdown";
import Swal from 'sweetalert2';
import { Button, Input } from "../components";
import { useFormik } from "formik";
import { FiUserPlus } from "react-icons/fi";
import React from "react";

export default function Teste() {
  const { TabsDropDowns } = ITabs;
  function readExcel(value: any) {
    console.log(value);
    readXlsxFile(value[0]).then((rows) => {
      importService.validate({spreadSheet: rows, moduleId: 1}).then((response) => {
        console.log(response);
      });
    })
  }

  const formik = useFormik({
    initialValues: {
      input: [],
    },
    onSubmit: async (values) => {
      console.log(values);
     
    },
  });
  return (
    <>
      <Head>
        <title>Nova NPE</title>
      </Head>
      <Content2 contentHeader={TabsDropDowns()}>
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
              <input type="file" id="inptesteut"  onChange={e => readExcel(e.target.files)} />
            <div className="
              h-10 w-full
              flex
              gap-3
              justify-center
              mt-10
            ">
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
      </Content2>
   </>
  );
}
