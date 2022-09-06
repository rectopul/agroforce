import Head from 'next/head';
import { ImportPlanilha } from 'src/components/ImportPlanilha';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';

const data: object = [
  { id: 'código', name: '*Código Tecnologia' },
  { id: 'nome', name: '*Nome' },
  { id: 'rótulo', name: 'Rótulo' },
  { id: 'cultura', name: '*Cultura' },
];

export default function ImportacaoPlanilha({ config }: any) {
  return (
    <>
      <Head><title>Importação de planilha tecnologia</title></Head>

      <ImportPlanilha
        data={data}
        configSalva={config[0]?.fields}
        moduleId={8}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }: any) => {
  const { token } = req.cookies;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/import`;

  const param = 'moduleId=8';
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  let config: any = await fetch(urlParameters.toString(), requestOptions);
  const response = await config.json();

  config = response.response;

  return {
    props: {
      config,
    },
  };
};
