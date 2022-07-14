import { capitalize } from '@mui/material';
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiUserPlus } from 'react-icons/fi';
import { IoMdArrowBack } from 'react-icons/io';
import InputMask from 'react-input-mask';
import { localService } from 'src/services';
import { saveDegreesCelsius } from 'src/shared/utils/formatDegreesCelsius';
import Swal from 'sweetalert2';
import {
	Button, Content,
	Input,
	Select,
} from '../../../components';
import * as ITabs from '../../../shared/utils/dropdown';

interface ILocalProps {
	id: number | any;
	cod_local: string | any;
	cod_red_local: string | any;
	pais: string | any;
	uf: string | any;
	city: string | any;
	name_farm: string | any;
	latitude: string;
	longitude: string;
	altitude: string | any;
	created_by: number;
	status: number;
}

interface IUf {
	id: number;
	npme: string;
	sigla: string;
}

interface ICity {
	id: number;
	name: string;
	ufid: number;
}

export interface IData {
	uf: Object | any;
	city: ICity;
}

export default function NovoLocal({ uf }: IData) {
	const { TabsDropDowns } = ITabs.default;

	const tabsDropDowns = TabsDropDowns();

	tabsDropDowns.map((tab) => (
		tab.titleTab === 'LOCAL'
			? tab.statusTab = true
			: tab.statusTab = false
	));

	const userLogado = JSON.parse(localStorage.getItem('user') as string);
	const ufs: object | any = [];
	const [citys, setCitys] = useState<object | any>([{ id: '0', name: 'selecione' }]);

	const pais = [{ id: 'Brasil', name: 'Brasil' }];
	const router = useRouter();
	const formik = useFormik<ILocalProps>({
		initialValues: {
			id: 1,
			cod_local: '',
			cod_red_local: '',
			pais: '',
			uf: '',
			city: '',
			name_farm: '',
			latitude: '',
			longitude: '',
			altitude: '',
			created_by: userLogado.id,
			status: 1,
		},
		onSubmit: async (values) => {
			validateInputs(values);
			if (!values.cod_local || !values.pais || !values.uf || !values.city || !values.name_farm) { return; }

			await localService.create({
				cod_local: capitalize(values.cod_local),
				cod_red_local: capitalize(values.cod_red_local),
				pais: values.pais,
				uf: values.uf,
				city: values.city,
				name_farm: values.name_farm,
				latitude: saveDegreesCelsius(values.latitude),
				longitude: saveDegreesCelsius(values.longitude),
				altitude: values.altitude,
				created_by: values.created_by,
			}).then((response) => {
				if (response.status === 200) {
					Swal.fire('Local cadastrado com sucesso!');
					router.back();
				} else {
					Swal.fire(response.message);
				}
			});
		},
	});

	uf.map((value: string | object | any) => {
		ufs.push({ id: value.id, name: value.sigla, ufid: value.id });
	});

	// async function showCitys(uf: any) {
	//   if (uf) {
	//     let param = '?ufId=' + uf;
	//     let city: object | any = [];
	//     await localService.getCitys(param).then((response) => {
	//       response.map((value: string | object | any) => {
	//         city.push({ id: value.nome, name: value.nome });
	//       })
	//       setCitys(city)
	//     });
	//   }
	// }

	function validateInputs(values: any) {
		if (!values.cod_local) { const inputcod_local: any = document.getElementById('cod_local'); inputcod_local.style.borderColor = 'red'; } else { const inputcod_local: any = document.getElementById('cod_local'); inputcod_local.style.borderColor = ''; }
		if (!values.pais) { const inputPais: any = document.getElementById('pais'); inputPais.style.borderColor = 'red'; } else { const inputPais: any = document.getElementById('pais'); inputPais.style.borderColor = ''; }
		if (!values.uf) { const inputUf: any = document.getElementById('uf'); inputUf.style.borderColor = 'red'; } else { const inputUf: any = document.getElementById('uf'); inputUf.style.borderColor = ''; }
		if (!values.city) { const inputCity: any = document.getElementById('city'); inputCity.style.borderColor = 'red'; } else { const inputCity: any = document.getElementById('city'); inputCity.style.borderColor = ''; }
		if (!values.name_farm) { const inputname_farm: any = document.getElementById('name_farm'); inputname_farm.style.borderColor = 'red'; } else { const inputname_farm: any = document.getElementById('name_farm'); inputname_farm.style.borderColor = ''; }
	}

	return (
		<>
			<Head>
				<title>Novo Local</title>
			</Head>

			<Content contentHeader={tabsDropDowns} moduloActive="config">
				<form
					className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
					onSubmit={formik.handleSubmit}
				>
					<div className="w-full flex justify-between items-start">
						<h1 className="text-2xl">Novo Local</h1>
					</div>

					<div className="w-full
            flex
            justify-around
            gap-6
            mt-4
            mb-4
          "
					>
						<div className="w-full">
							<label className="block text-gray-900 text-sm font-bold mb-2">
								*Código Local
							</label>
							<Input
								type="text"
								placeholder="TMG-Agroforce"
								id="cod_local"
								name="cod_local"
								maxLength={10}
								onChange={formik.handleChange}
								value={formik.values.cod_local}
							/>
						</div>

						<div className="w-full">
							<label className="block text-gray-900 text-sm font-bold mb-2">
								Código Reduzido
							</label>
							<Input
								type="text"
								placeholder="TMGGG"
								maxLength={5}
								id="cod_red_local"
								name="cod_red_local"
								onChange={formik.handleChange}
								value={formik.values.cod_red_local}
							/>
						</div>

						<div className="w-full h-10">
							<label className="block text-gray-900 text-sm font-bold mb-2">
								*Pais
							</label>
							<Select
								values={pais}
								id="pais"
								name="pais"
								onChange={formik.handleChange}
								value={formik.values.pais}
								selected={1}
							/>
						</div>
					</div>

					<div className="w-full
            flex
            justify-around
            gap-6
            mb-4
          "
					>
						<div className="w-full h-10">
							<label className="block text-gray-900 text-sm font-bold mb-2">
								*Estado
							</label>
							<Select
								values={ufs}
								id="uf"
								name="uf"
								onChange={formik.handleChange}
								value={formik.values.uf}
								selected={false}
							/>
						</div>
						<div className="w-full h-10">
							<label className="block text-gray-900 text-sm font-bold mb-2">
								*Município
							</label>
							<Select
								values={citys}
								id="city"
								name="city"
								onChange={formik.handleChange}
								value={formik.values.city}
								selected={false}
							/>
						</div>
						<div className="w-full">
							<label className="block text-gray-900 text-sm font-bold mb-2">
								*Nome Fazenda
							</label>
							<Input
								type="text"
								placeholder="Fazenda C"
								id="name_farm"
								name="name_farm"
								onChange={formik.handleChange}
								value={formik.values.name_farm}
							/>
						</div>
					</div>

					<div className="w-full
            flex
            justify-between
            gap-6
            mb-4
          "
					>
						<div className="w-full">
							<label className="block text-gray-900 text-sm font-bold mb-2">
								Latitude
							</label>
							<InputMask
								className="shadow
                 appearance-none
                 bg-white bg-no-repeat
                 border border-solid border-gray-300
                 rounded
                 w-full
                 py-2 px-3
                 text-gray-900
                 leading-tight
                 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
               "
								mask={'99°99\'99.99"'}
								type="text"
								placeholder={'99°99\'99.99"'}
								id="latitude"
								name="latitude"
								onChange={formik.handleChange}
								value={formik.values.latitude}
							/>
						</div>

						<div className="w-full">
							<label className="block text-gray-900 text-sm font-bold mb-2">
								Longitude
							</label>
							<InputMask
								className="shadow
                  appearance-none
                  bg-white bg-no-repeat
                  border border-solid border-gray-300
                  rounded
                  w-full
                  py-2 px-3
                  text-gray-900
                  leading-tight
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                "
								mask={'99°99\'99.99"'}
								type="text"
								placeholder={'99°99\'99.99"'}
								id="longitude"
								name="longitude"
								onChange={formik.handleChange}
								value={formik.values.longitude}
							/>
						</div>

						<div className="w-full">
							<label className="block text-gray-900 text-sm font-bold mb-2">
								Altitude
							</label>
							<Input
								type="text"
								placeholder="500"
								id="altitude"
								name="altitude"
								onChange={formik.handleChange}
								value={formik.values.altitude}
							/>
						</div>

					</div>

					<div className="
            h-10 w-full
            flex
            gap-3
            justify-center
            mt-10
          "
					>
						<div className="w-30">
							<Button
								type="button"
								value="Voltar"
								bgColor="bg-red-600"
								textColor="white"
								icon={<IoMdArrowBack size={18} />}
								onClick={() => { router.back(); }}
							/>
						</div>
						<div className="w-40">
							<Button
								type="submit"
								value="Cadastrar"
								bgColor="bg-blue-600"
								icon={<FiUserPlus size={18} />}
								textColor="white"
								onClick={() => { }}
							/>
						</div>
					</div>
				</form>
			</Content>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const { publicRuntimeConfig } = getConfig();
	const baseUrl = `${publicRuntimeConfig.apiUrl}/local`;
	const { token } = req.cookies;

	const requestOptions: RequestInit | undefined = {
		method: 'GET',
		credentials: 'include',
		headers: { Authorization: `Bearer ${token}` },
	};

	const apiUF = await fetch(`${baseUrl}/uf`, requestOptions);

	const uf = await apiUF.json();
	return { props: { uf } };
};
