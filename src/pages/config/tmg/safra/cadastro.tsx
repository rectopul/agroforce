import Head from "next/head";
import { useFormik } from 'formik';
import { IoMdArrowBack } from "react-icons/io";
import { MdDateRange } from "react-icons/md";

import { 
  Button,
  Content, 
  Input, 
  Select, 
  TabHeader,
  Radio
} from "../../../../components";

import  * as ITabs from '../../../../utils/dropdown';

interface ISafraProps {
  harvest: string;
  status: number | any;
  mainHarvest: string;
  beginningPlating: string;
  endPlating: string;
  created_by: any;
}

export default function Safra() {
  const { tmgDropDown, tabs } = ITabs.default;
  const optionsSelect =  [{id: 1, name: "sim"}, {id: 0, name: "Não"}];
  const optionsStatus =  [{id: 1, name: "Ativa"}, {id: 0, name: "Inativa"}];

  const userLogado = JSON.parse(localStorage.getItem("user") as string);

  const formik = useFormik<ISafraProps>({
    initialValues: {
      harvest: '',
      mainHarvest: '',
      beginningPlating: '',
      endPlating: '',
      status: '',
      created_by: userLogado,
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  
  return (
    <>
      <Head>
        <title>Cadastro de safra</title>
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
          <h1 className="text-2xl">Nova safra</h1>

          <div className="w-full flex justify-between items-start gap-5">
            <div className="w-4/12">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Safra
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                type="text"
                required
                disabled
                id="harvest"
                name="harvest"
                onChange={formik.handleChange}
                value={formik.values.harvest}
              />
            </div>

            <div className="w-4/12 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Ano
              </label>
              <Input
                type="date"
                required
                id="harvest"
                name="harvest"
                onChange={formik.handleChange}
                value={formik.values.harvest}
              />
            </div>

            <div className="w-4/12 h-10 justify-start">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Tipo de safra
              </label>
              <div className="w-full h-full flex gap-4 items-center">
              <Radio
                title="Verão"
                id="harvest"
                name="harvest"
                onChange={formik.handleChange}
                value={formik.values.harvest}
              />

              <Radio
                title="Inverno"
                id="harvest"
                name="harvest"
                onChange={formik.handleChange}
                value={formik.values.harvest}
              />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-start gap-5 mt-4">
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Período ideal de início de plantio
              </label>
              <Input
                type="text" 
                placeholder="Ex: 04/23"
                id="beginningPlating"
                name="beginningPlating"
                onChange={formik.handleChange}
                value={formik.values.beginningPlating.toString()}
              />
            </div>
            
            <div className="w-2/4">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Período ideal do fim do plantio
              </label>
              <Input
                type="text" 
                placeholder="Ex: 03/24" 
                id="beginningPlating"
                name="beginningPlating"
                onChange={formik.handleChange}
                value={formik.values.beginningPlating.toString()}
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
                type="submit"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                href='/config/tmg/safra'
                onClick={() => {}}
              />
            </div>
            <div className="w-40">
              <Button
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
