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
} from "../../components";

interface ISafraProps {
  harvest: string;
  mainHarvest: string;
  beginningPlating: string;
  endPlating: string;
  created_by: any;
}

export default function Safra() {
  const tabs = [
    { title: 'TMG', value: <BsCheckLg />, status: true },
  ];

  const userLogado = JSON.parse(localStorage.getItem("user") as string);

  const formik = useFormik<ISafraProps>({
    initialValues: {
      harvest: '',
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
          <TabHeader data={tabs} />
        }
      >
        <div className="w-full
          h-20
          flex
          items-center
          gap-2
          px-5
          rounded-lg
          border-b border-blue-600
          shadow
          bg-white
        ">
          <div className="h-10 w-32">
            <Button 
              value="Usuário"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
            />
          </div>
          <div className="h-10 w-32">
            <Button 
              value="Safra"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
            />
          </div>
          <div className="h-10 w-32">
            <Button 
              value="Portfólio"
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {}}
            />
          </div>
        </div>

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
                values={["Não", "Sim"]}
                onChange={formik.handleChange}
                value={formik.values.beginningPlating}
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
