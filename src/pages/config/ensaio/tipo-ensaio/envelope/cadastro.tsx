import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";
import Swal from "sweetalert2";
import InputMask from "react-input-mask";
import { GetServerSideProps } from "next";
import getConfig from "next/config";
import { envelopeService } from "src/services";
import { Button, Content, Select, Input } from "../../../../../components";
import * as ITabs from "../../../../../shared/utils/dropdown";

interface ICreateTypeAssay {
  safra: string;
  seeds: number;
  id_type_assay: number;
  created_by: number;
}

export default function Cadastro({ safra, id_type_assay }: any) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) =>
    tab.titleTab === "ENSAIO" ? (tab.statusTab = true) : (tab.statusTab = false)
  );

  const router = useRouter();
  const [checkInput, setCheckInput] = useState("text-black");

  const userLogado = JSON.parse(localStorage.getItem("user") as string);

  const formik = useFormik<ICreateTypeAssay>({
    initialValues: {
      id_type_assay: Number(id_type_assay),
      safra: safra.id,
      seeds: 0,
      created_by: userLogado.id,
    },
    onSubmit: async (values) => {
      validateInputs(values);
      if (!values.seeds) {
        Swal.fire(
          "Preencha todos os campos obrigatórios destacados em vermelho."
        );
        return;
      }

      await envelopeService
        .create({
          id_safra: Number(safra.id),
          id_type_assay: Number(id_type_assay),
          seeds: Number(values.seeds),
          created_by: formik.values.created_by,
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire("Envelope cadastrado com sucesso!");
            router.back();
          } else {
            Swal.fire(response.message);
          }
        });
    },
  });

  function validateInputs(values: any) {
    if (!values.seeds) {
      const inputSeeds: any = document.getElementById("seeds");
      inputSeeds.style.borderColor = "red";
    } else {
      const inputSeeds: any = document.getElementById("seeds");
      inputSeeds.style.borderColor = "";
    }
  }

  return (
    <>
      <Head>
        <title>Novo Envelope</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Novo Envelope</h1>

          <div
            className="w-1/2
                                flex
                                justify-around
                                gap-6
                                mt-4
                                mb-4
                            "
          >
            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                Safra
              </label>
              <Input
                style={{ background: "#e5e7eb" }}
                id="safra"
                name="safra"
                type="text"
                disabled
                onChange={formik.handleChange}
                value={safra.safraName}
              />
            </div>
            <div className="w-full h-7">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *Quant de sementes por envelope
              </label>
              <Input
                id="seeds"
                name="seeds"
                onChange={formik.handleChange}
                value={formik.values.seeds}
              />
            </div>
          </div>

          <div
            className="
                            h-7 w-full
                            flex
                            gap-3
                            justify-center
                            mt-10
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
                icon={<AiOutlineFileSearch size={20} />}
                onClick={() => {}}
              />
            </div>
          </div>
        </form>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { publicRuntimeConfig } = getConfig();
  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/safra`;
  const { token } = context.req.cookies;
  const { safraId } = context.req.cookies;

  const requestOptions: RequestInit | undefined = {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiSafra = await fetch(`${baseUrlShow}/${safraId}`, requestOptions);

  const safra = await apiSafra.json();
  const { id_type_assay } = context.query;
  return {
    props: {
      safra,
      id_type_assay,
    },
  };
};
