import Head from 'next/head';
import { ImportPlanilha } from 'src/components/ImportPlanilha';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';

const data: object = [
  { id: 'ID da unidade de cultura', name: '*ID da unidade de cultura' },
  { id: 'Ano', name: '*Ano' },
  { id: 'Nome da unidade de cultura', name: '*Nome da unidade de cultura' },
  { id: 'ID do lugar de cultura', name: '*ID do lugar de cultura' },
  { id: 'Nome do lugar de cultura', name: '*Nome do lugar de cultura' },
  { id: 'CP_LIBELLE', name: '*Rótulo' },
  { id: 'mloc', name: '*MLOC' },
  { id: 'Endereço', name: '*Endereço' },
  { id: 'Identificador de localidade', name: '*Identificador de localidade' },
  { id: 'Nome da localidade', name: '*Nome da localidade' },
  { id: 'Identificador de região', name: '*Identificador de região' },
  { id: 'Nome da região', name: '*Nome da região' },
  { id: 'REG_LIBELLE', name: '*Rótulo' },
  { id: 'ID do país', name: '*ID do país' },
  { id: 'Nome do país', name: '*Nome do país' },
  { id: 'CNTR_LIBELLE', name: '*Rótulo' },
];

export default function ImportacaoPlanilha({ config }: any) {
  return (
    <>
      <Head><title>Importação de planilha Local</title></Head>

      <ImportPlanilha
        data={data}
        configSalva={(config !== '') ? config[0]?.fields : []}
        moduleId={4}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }: any) => {
  const { token } = req.cookies;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/import`;

  const param = 'moduleId=4';
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  let config: any = await fetch(urlParameters.toString(), requestOptions);
  const Response = await config.json();

  config = Response.response;
  config = config.length > 0 ? config : '';
  return {
    props: {
      config,
    },
  };
};
