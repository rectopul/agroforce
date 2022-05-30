import Head from "next/head";
import { ImportPlanilha } from "src/components/ImportPlanilha";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';

const data: object = [
            { id: 'Esquema', name: '*Código Esquema'}, 
            { id: 'Plantadeiras', name: '*Plantadeiras'},
            { id: 'SL', name: '*SL'},
            { id: 'SC', name: '*SC'},
            { id: 'SALOC', name: '*SALOC'},
            { id: 'Tiro', name: '*Tiro'},
            { id: 'Disparo', name: '*Disparo'},
            { id: 'CJ', name: '*CJ'},
            { id: 'Dist', name: '*Dist'},
            { id: 'ST', name: '*ST'},
            { id: 'SPC', name: '*SPC'},
            { id: 'SColheita', name: '*SColheita'},
            { id: 'TipoParcela', name: '*Tipo_Parcela'},
          ];

export default function ImportacaoPlanilha({ config }: any) {
  return (
    <>
      <Head><title>Importação de planilha Layout Quadra</title></Head>

        <ImportPlanilha
          data={data}
          configSalva ={(config != "") ? config[0].fields : []}
          moduleId={5}
        />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.token;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/import`;

  const param = `moduleId=5`;
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
