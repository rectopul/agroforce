import Head from 'next/head';
import { ImportPlanilha } from 'src/components/ImportPlanilha';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';

const data: object = [
  { id: 'Safra', name: '*Safra' },
  { id: 'Cultura', name: '*Cultura' },
  { id: 'LocalPrep', name: '*Local Preparo' },
  { id: 'CodigoQuadra', name: 'Código Quadra' },
  { id: 'LargQ', name: 'Largura Q' },
  { id: 'CompP', name: 'Comp P' },
  { id: 'LinhaP', name: 'Linha P' },
  { id: 'CompC', name: 'Comp C' },
  { id: 'Esquema', name: 'Esquema' },
  { id: 'Divisor', name: 'Divisor' },
  { id: 'Semente', name: 'Semmetro' },
  { id: 'T4I', name: 'T4I' },
  { id: 'T4F', name: 'T4F' },
  { id: 'DI', name: 'DI' },
  { id: 'DF', name: 'DF' },
];

export default function ImportacaoPlanilha({ config }: any) {
  return (
    <>
      <Head><title>Importação de planilha Quadra</title></Head>

      <ImportPlanilha
        data={data}
        configSalva={(config !== '') ? config[0]?.fields : []}
        moduleId={17}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }: any) => {
  const { token } = req.cookies;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/import`;

  const param = 'moduleId=17';
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
