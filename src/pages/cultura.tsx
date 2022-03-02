import { useFormik } from 'formik'
import { BsCheckLg } from "react-icons/bs";

import { cultureService } from 'src/services';

import { 
  Button,
  Content, 
  Input, 
  TabHeader 
} from "../components";

export default function Cultura() {
  const userLogado = JSON.parse(localStorage.getItem("user"));
  const tabs = [
    { title: 'TMG', value: <BsCheckLg />, status: true },
    { title: 'ENSAIO', value: <BsCheckLg />, status: false  },
    { title: 'LOCAL', value: <BsCheckLg />, status: false  },
    { title: 'DELINEAMENTO', value: <BsCheckLg />, status: false  },
    { title: 'NPE', value: <BsCheckLg />, status: false  },
    { title: 'QUADRAS', value: <BsCheckLg />, status: false  },
    { title: 'CONFIG. PLANILHAS', value: <BsCheckLg />, status: false },
  ];

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
          alert("Cultura criada com sucesso");
        }
      })
    },
  });

  return (
    <Content
      headerCotent={
        <TabHeader data={tabs} />
      }
    >

    <div className=" w-full
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
          <Input value={123456} disabled style={{ background: '#e5e7eb' }} />
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

      <div className="h-10 w-full
        flex
        justify-center
        mt-10
      ">
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
  );
}
