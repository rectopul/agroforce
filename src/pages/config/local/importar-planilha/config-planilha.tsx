import Head from "next/head";
import { ImportPlanilha } from "src/components/ImportPlanilha";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';

const data: object = [
  { id: 'CodLocal', name: '*Código Local' },
  { id: 'CodRedLocal', name: '*Código Reduzido' },
  { id: 'NameFarm', name: '*Nome Fazenda' },
  { id: 'pais', name: 'País' },
  { id: 'uf', name: 'Estado' },
  { id: 'city', name: 'Municipio' }
];

export default function ImportacaoPlanilha({ config }: any) {
  return (
    <>
      <Head><title>Importação de planilha Local</title></Head>

      <ImportPlanilha
        data={data}
        configSalva={(config !== "") ? config[0].fields : []}
        moduleId={4}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/import`;

  const param = `moduleId=4`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` }
  } as RequestInit | undefined;

  let config: any = await fetch(urlParameters.toString(), requestOptions);
  const Response = await config.json();

  config = Response.response;
  config = config.length > 0 ? config : "";
  return {
    props: {
      config
    },
  }
}
