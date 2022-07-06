import Head from "next/head";
import { ImportPlanilha } from "src/components/ImportPlanilha";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';

const data: object = [
	{ id: 'Local', name: '*Local' },
	{ id: 'Foco', name: '*Foco' },
	{ id: 'OGM', name: '*Tecnologia' },
	{ id: 'Ensaio', name: '*Ensaio' },
	{ id: 'NPEI', name: '*NPEI' },
	{ id: 'Epoca', name: '*Epoca' },
	{ id: 'Safra', name: '*Safra' }
];

export default function ImportacaoPlanilha({ config }: any) {
	return (
		<>
			<Head><title>Importação de planilha NPE</title></Head>

			<ImportPlanilha
				data={data}
				configSalva={(config[0] > 0 ? config[0].fields : data)}
				moduleId={14}
			/>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const token = req.cookies.token;
	const { publicRuntimeConfig } = getConfig();
	const baseUrl = `${publicRuntimeConfig.apiUrl}/import`;

	const param = `moduleId=14`;
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

	return {
		props: {
			config
		},
	}
}
