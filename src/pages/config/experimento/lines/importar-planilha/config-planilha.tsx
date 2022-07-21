import Head from 'next/head';
import { ImportPlanilha } from 'src/components/ImportPlanilha';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';

const data: object = [
  { id: 'id_s1', name: '*ID_S1' },
  { id: 'id_dados_geno', name: '*Identificador dados genótipo' },
  { id: 'Genotipo', name: '*Nome genótipo' },
  { id: 'NomePrincipal', name: 'Nome principal' },
  { id: 'NomePublico', name: 'Nome publico' },
  { id: 'NomeExperimental', name: 'Nome experimental' },
  { id: 'NomeAlternativo', name: 'Nome alternativo' },
  { id: 'EliteNome', name: 'Elite Nome' },
  { id: 'Tecnologia', name: '*Tecnologia' },
  { id: 'Tipo', name: 'Tipo' },
  { id: 'gmr', name: 'GMR' },
  { id: 'bgm', name: 'BGM' },
  { id: 'Cruza', name: 'Cruza' },
  { id: 'ProgenitorFdireito', name: 'Progenitor_f_direito' },
  { id: 'ProgenitorMdireito', name: 'Progenitor_m_direito' },
  { id: 'ProgenitorForigem', name: 'Progenitor_f_origem' },
  { id: 'ProgenitorMorigem', name: 'Progenitor_m_origem' },
  { id: 'ProgenitoresOrigem', name: 'Progenitores Origem' },
  { id: 'ParentescoCompleto', name: 'Parentesco Completo' },
  { id: 'id_s2', name: '*ID_S2' },
  { id: 'id_dados_lote', name: '*Identificador dados lotes' },
  { id: 'Ano', name: 'Ano Safra' },
  { id: 'Safra', name: 'Safra' },
  { id: 'CodLote', name: 'Código do Lote' },
  { id: 'NCC', name: 'NCC' },
  { id: 'Fase', name: 'Fase' },
  { id: 'Peso', name: 'Peso' },
  { id: 'QuantidadeSementes', name: 'Quantidade Sementes' },
];

export default function ImportacaoPlanilha({ config }: any) {
  return (
    <>
      <Head><title>Importação de planilha Genótipo</title></Head>

      <ImportPlanilha
        data={data}
        configSalva={(config !== '') ? config[0].fields : []}
        moduleId={10}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token } = req.cookies;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/import`;

  const param = 'moduleId=10';
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
