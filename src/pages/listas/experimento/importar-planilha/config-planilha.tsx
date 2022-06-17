import Head from "next/head";
import { ImportPlanilha } from "src/components/ImportPlanilha";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';

const data: object = [
    { id: 'protocol_level', name: 'Protocol_level' },
    { id: 'network_name', name: 'Nome da rede' },
    { id: 'protocolo_name', name: 'Nome do protocolo' },
    { id: 'id_experimento', name: 'ID do experimento' },
    { id: 'experimento_name', name: 'Nome do experimento' },
    { id: 'year', name: 'Ano' },
    { id: 'rotulo', name: 'Rótulo' },
    { id: 'safra', name: 'Safra' },
    { id: 'foco', name: 'Foco' },
    { id: 'ensaio', name: 'Ensaio' },
    { id: 'cod_tec', name: 'Tecnologia' },
    { id: 'epoca', name: 'EP' },
    { id: 'prj', name: 'PRJ' },
    { id: 'id_l1', name: 'ID_L1' },
    { id: 'id_dados_materiais', name: 'Identificador de dados' },
    { id: 'tratamentos', name: 'Numero de tratamento' },
    { id: 'status', name: 'Status' },
    { id: 'prox_nivel', name: 'Número de linhas no próximo nível' },
    { id: 'id_s1', name: 'ID_S1' },
    { id: 'id_dados_genotipo', name: 'Identificador de dados' },
    { id: 'main_name', name: 'Nome principal' },
    { id: 'name_genotipo', name: 'Nome génotipo' },
    { id: 'cultura', name: 'Cultura' },
    { id: 'id_s2', name: 'ID_S2' },
    { id: 'id_dados_lote', name: 'Identificador de dados' },
    { id: 'cod_lote', name: 'Código do lote' },
    { id: 'ncc', name: 'NCC' },
    { id: 'id_un_cultura', name: 'ID da unidade de cultura' },
    { id: 'unidade_cultura_name', name: 'Nome da unidade de cultura' },

];

export default function ImportacaoPlanilha({ config }: any) {
    return (
        <>
            <Head><title>Importação de planilha tecnologia</title></Head>

            <ImportPlanilha
                data={data}
                configSalva={config[0].fields}
                moduleId={22}
            />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const token = req.cookies.token;
    const { publicRuntimeConfig } = getConfig();
    const baseUrl = `${publicRuntimeConfig.apiUrl}/import`;

    const param = `moduleId=22`;
    const urlParameters: any = new URL(baseUrl);
    urlParameters.search = new URLSearchParams(param).toString();
    const requestOptions = {
        method: 'GET',
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` }
    } as RequestInit | undefined;

    let config: any = await fetch(urlParameters.toString(), requestOptions);
    const response = await config.json();

    config = response.response;

    return {
        props: {
            config
        },
    }
}
