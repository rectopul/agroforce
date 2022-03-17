import Head from 'next/head';
import { useFormik } from 'formik'
import Swal from 'sweetalert2';

import { cultureService } from 'src/services';

import { 
  Button,
  Content, 
  Input, 
  TabHeader 
} from "../../../../components";

import  * as ITabs from '../../../../utils/dropdown';
import { RiPlantLine } from 'react-icons/ri';
import { IoMdArrowBack } from 'react-icons/io';

export default function Cadastro() {
  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const { tmgDropDown, tabs } = ITabs.default;

  const formik = useFormik({
    initialValues: {
      name: '',
      created_by: userLogado.id,
    },
    onSubmit: values => {
      cultureService.createCulture({
        name: formik.values.name,
        created_by: formik.values.created_by,
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire('Cultura cadastrada com sucesso!')
        } else {
          Swal.fire(response.message)
        }
      })
    },
  });

  return (
    <>
     <Head>
        <title>Nova cultura</title>
      </Head>
      
      <Content
        headerCotent={
          <TabHeader data={tabs} dataDropDowns={tmgDropDown} />
        }
      >

      <form 
        className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"

        onSubmit={formik.handleSubmit}
      >
        <h1 className="text-2xl">Nova cultura</h1>

        <div className="w-full
          flex 
          justify-around
          gap-2
          mt-4
          mb-4
        ">
          <div className="w-full">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              ID cultura
            </label>
            <Input value={''} disabled style={{ background: '#e5e7eb' }} />
          </div>

          <div className="w-full h-10">
            <label className="block text-gray-900 text-sm font-bold mb-2">
              Nome cultura
            </label>
            <Input
              id="name"
              name="name"
              type="text" 
              max="50" 
              placeholder="ex: Soja"
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
                type="submit"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                href="/config/tmg/cultura"
                icon={<IoMdArrowBack size={18} />}
                onClick={() => {}}
              />
            </div>
            <div className="w-40">
              <Button
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<RiPlantLine size={20} />}
                onClick={() => {}}
              />
            </div>
          </div>
      </form>
      </Content>
    </>
  );
}