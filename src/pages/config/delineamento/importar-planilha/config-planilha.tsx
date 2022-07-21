import Head from 'next/head';
import { ImportPlanilha } from 'src/components/ImportPlanilha';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';

const data: object = [
  { id: 'Nome', name: '*Nome' },
  { id: 'Repeticao', name: '*Repetição' },
  { id: 'Sorteio', name: '*Sorteio' },
  { id: 'Tratamento', name: '*N Tratamento' },
  { id: 'Bloco', name: 'Bloco' },
];

export default function ImportacaoPlanilha({ config }: any) {
  return (
    <>
      <Head><title>Importação de planilha NPE</title></Head>

      <ImportPlanilha
        data={data}
        configSalva={(config !== '') ? config[0].fields : []}
        moduleId={7}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token } = req.cookies;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/import`;

  const param = 'moduleId=7';
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
