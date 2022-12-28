import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { safraService } from "src/services";
import Swal from "sweetalert2";
import { Button, Content, Input, Radio } from "../../../../components";
import * as ITabs from "../../../../shared/utils/dropdown";
import ComponentLoading from "../../../../components/Loading";

interface ISafraProps {
  id_culture: number;
  safraName: string;
  year: number;
  plantingStartTime: string;
  plantingEndTime: string;
  main_safra: number;
  status: number;
  created_by: number;
}

interface Input {
  safraName: string;
  year: number;
  plantingStartTime: string;
  plantingEndTime: string;
}

export default function Safra() {
  const { TabsDropDowns } = ITabs.default;

  const [loading, setLoading] = useState<boolean>(false);

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) =>
    tab.titleTab === "TMG" ? (tab.statusTab = true) : (tab.statusTab = false)
  );

  const router = useRouter();
  const [checkInput, setCheckInput] = useState("text-black");
  const [checkeBox, setCheckeBox] = useState<boolean>();
  const [checkeBox2, setCheckeBox2] = useState<boolean>();

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const culture = userLogado.userCulture.cultura_selecionada as string;

  const formik = useFormik<ISafraProps>({
    initialValues: {
      id_culture: Number(culture),
      safraName: "",
      year: 0,
      plantingStartTime: "",
      plantingEndTime: "",
      main_safra: 0,
      status: 1,
      created_by: Number(userLogado.id),
    },
    onSubmit: async (values) => {
      const { main_safra, ...data } = values;

      const { created_by, id_culture, status, ...inputs } = data;

      validateInputs(inputs);
      if (!values.safraName || !values.year) {
        Swal.fire(
          "Preencha todos os campos obrigatórios destacados em vermelho."
        );
        setLoading(false);
        return;
      }
      let plantingStartTime;
      let plantingEndTime;

      if (values.plantingStartTime) {
        plantingStartTime = new Intl.DateTimeFormat("pt-BR").format(
          new Date(formik.values.plantingStartTime)
        );
      }

      if (values.plantingEndTime) {
        plantingEndTime = new Intl.DateTimeFormat("pt-BR").format(
          new Date(formik.values.plantingEndTime)
        );
      }

      await safraService
        .create({
          id_culture: Number(culture),
          safraName: formik.values.safraName?.trim(),
          year: Number(formik.values.year),
          plantingStartTime,
          plantingEndTime,
          status: formik.values.status,
          created_by: Number(userLogado.id),
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire("Safra cadastrada com sucesso!");
            setLoading(false);
            router.back();
          } else {
            setLoading(false);
            Swal.fire(response.message);
          }
        });
    },
  });

  function validateInputs(values: Input) {
    if (!values.safraName || !values.year) {
      const inputSafraName: any = document.getElementById("safraName");
      const inputYear: any = document.getElementById("year");
      inputSafraName.style.borderColor = "red";
      inputYear.style.borderColor = "red";
    } else {
      const inputSafraName: any = document.getElementById("safraName");
      const inputYear: any = document.getElementById("year");
      inputSafraName.style.borderColor = "";
      inputYear.style.borderColor = "";
    }
  }

  return (
    <>
      {loading && <ComponentLoading />}
      <Head>
        <title>Cadastro de safra</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded p-8"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Nova safra</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-4">
            <div className="w-4/12 h-7">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                <strong className={checkInput}>*</strong>
                Safra
              </label>

              <Input
                id="safraName"
                name="safraName"
                maxLength={10}
                placeholder="___________"
                onChange={formik.handleChange}
                value={formik.values.safraName}
              />
            </div>

            <div className="w-4/12 h-7">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                <strong className={checkInput}>*</strong>
                Ano
              </label>

              <Input
                id="year"
                name="year"
                type="number"
                maxLength={4}
                placeholder="____"
                onChange={formik.handleChange}
                value={formik.values.year}
              />
            </div>

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Período ideal de início de plantio
              </label>
              <Input
                type="date"
                id="plantingStartTime"
                name="plantingStartTime"
                onChange={formik.handleChange}
                value={formik.values.plantingStartTime}
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Período ideal do fim do plantio
              </label>
              <Input
                type="date"
                id="plantingEndTime"
                name="plantingEndTime"
                onChange={formik.handleChange}
                value={formik.values.plantingEndTime}
              />
            </div>
          </div>

          <div
            className="h-7 w-full
            flex
            gap-3
            justify-center
            mt-12
          "
          >
            <div className="w-40">
              <Button
                type="button"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                onClick={() => router.back()}
              />
            </div>
            <div className="w-40">
              <Button
                type="submit"
                value="Cadastrar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<MdDateRange size={18} />}
                onClick={() => {
                  setLoading(true);
                }}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}
