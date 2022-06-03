import { capitalize } from "@mui/material";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from 'next/router';
import { IoMdArrowBack } from "react-icons/io";
import { RiOrganizationChart } from "react-icons/ri";
import { typeAssayService } from "src/services";
import Swal from 'sweetalert2';
import {
  Button, Content,
  Input
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';



interface ITypeAssayProps {
  id_culture: number;
  id_safra: number;
  name: String | any;
  created_by: Number;
  status: Number;
};


export default function NovoLocal() {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  const router = useRouter();

  const formik = useFormik<ITypeAssayProps>({
    initialValues: {
      id_culture: parseInt(culture),
      id_safra: parseInt(userLogado.safras.safra_selecionada),
      name: '',
      created_by: userLogado.id,
      status: 1
    },
    onSubmit: async (values) => {

      if (!validateInputs(values)) { return }

      await typeAssayService.create({
        id_culture: parseInt(culture),
        id_safra: parseInt(userLogado.safras.safra_selecionada),
        name: capitalize(values.name),
        created_by: Number(userLogado.id),
        status: 1
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Tipo de Ensaio cadastrado com sucesso!')
          router.push('/config/ensaio/tipo-ensaio');
        } else {
          Swal.fire(response.message)
        }
      })
    },
  });

  function validateInputs(values: any) {
    if (!values.name) {
      let inputname: any = document.getElementById("name");
      inputname.style.borderColor = 'red';
      Swal.fire("Preencha os campos obrigatórios")
      return false
    } else {
      let inputname: any = document.getElementById("name");
      inputname.style.borderColor = '';
      return true
    }
  }

  return (
    <>
      <Head>
        <title>Novo Tipo Ensaio</title>
      </Head>

      <Content contentHeader={tabsDropDowns}>
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Novo Tipo Ensaio</h1>
          </div>

          <div className="
            w-full
            gap-6
            mt-4
            mb-4
          ">
            <div className="w-2/4">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                *Nome
              </label>
              <Input
                type="text"
                placeholder="Nome"
                id="name"
                name="name"
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
                type="button"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                onClick={() => { router.back(); }}
              />
            </div>
            <div className="w-40">
              <Button
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                icon={<RiOrganizationChart size={18} />}
                textColor="white"
                onClick={() => { }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}