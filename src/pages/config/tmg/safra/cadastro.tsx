import Head from "next/head";
import { useFormik } from 'formik';
import { BsCheckLg } from "react-icons/bs";
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
      status: '',
      mainHarvest: '',
      beginningPlating: '',
      endPlating: '',
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

          <div className="w-full flex justify-between items-start">
            <div className="w-4/12">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Safra
              </label>
              <Input
                type="date" 
                placeholder="ex: 20/03/2025"
                required
                id="harvest"
                name="harvest"
                onChange={formik.handleChange}
                value={formik.values.harvest}
              />
            </div>

            <div>
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Tipo de safra
              </label>
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

          <div className="w-full
            flex 
            justify-around
            gap-2
            mt-4
            mb-4
          ">
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Safra principal
              </label>
              <Select
                id="beginningPlating"
                name="beginningPlating"
                values={optionsSelect}
                onChange={formik.handleChange}
                value={formik.values.beginningPlating}
                selected={false}
              />
            </div>
            <div className="w-2/4 h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Status
              </label>
              <Select
                name="status"
                id="status"
                values={optionsStatus}
                onChange={formik.handleChange}
                value={formik.values.status}
                selected={false}
              />
            </div>
            
            <div className="w-2/4">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Login único
              </label>
              <Input
                disabled
                style={{ background: '#e5e7eb' }}
                type="text" 
                placeholder="Login de usuário" 
                id="beginningPlating"
                name="beginningPlating"
                onChange={formik.handleChange}
                value={formik.values.beginningPlating.toString()}
              />
            </div>

            <div className="w-2/4">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Login único
              </label>
              <Input
                disabled
                style={{ background: '#e5e7eb' }}
                type="text" 
                placeholder="Login de usuário" 
                id="beginningPlating"
                name="beginningPlating"
                onChange={formik.handleChange}
                value={formik.values.beginningPlating.toString()}
              />
            </div>
          </div>

          <div className="h-10 w-full
            flex
            justify-center
            mt-10
          ">
            <div className="w-40">
              <Button
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
