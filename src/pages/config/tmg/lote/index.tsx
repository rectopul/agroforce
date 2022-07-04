import { removeCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from 'react-icons/ai';
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp, FaSortAmountUpAlt } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiSettingsFill } from 'react-icons/ri';
import { AccordionFilter, Button, CheckBox, Content, Input, Select } from 'src/components';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { loteService, userPreferencesService } from 'src/services';
import * as XLSX from 'xlsx';
import ITabs from '../../../../shared/utils/dropdown';

interface IFilter {
	filterStatus: object | any;
	filterName: string | any;
	filterGenotipo: string | any;
	filterVolume: string | any;
	orderBy: object | any;
	typeOrder: object | any;
}

export interface LoteGenotipo {
	id: number;
	id_culture: number;
	id_genotipo: number;
	genealogy: string;
	name: string;
	volume: number;
	status?: number;
}

interface IGenerateProps {
	name: string | undefined;
	title: string | number | readonly string[] | undefined;
	value: string | number | readonly string[] | undefined;
}

interface IData {
	allLote: LoteGenotipo[];
	totalItems: number;
	itensPerPage: number;
	filterApplication: object | any;
	id_genotipo: number;
}

export default function Listagem({ allLote, totalItems, itensPerPage, filterApplication, id_genotipo }: IData) {
	const { TabsDropDowns } = ITabs;

	const tabsDropDowns = TabsDropDowns();

	tabsDropDowns.map((tab) => (
		tab.titleTab === 'TMG'
			? tab.statusTab = true
			: tab.statusTab = false
	));

	const router = useRouter();
	const userLogado = JSON.parse(localStorage.getItem('user') as string);
	const preferences = userLogado.preferences.lote || { id: 0, table_preferences: "id,year,cod_lote,ncc,fase,peso,quant_sementes,name_genotipo,name_main,gmr,bgm,tecnologia" };
	const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

	const [lotes, setLotes] = useState<LoteGenotipo[]>(() => allLote);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [arrowOrder, setArrowOrder] = useState<any>('');
	const [orderList, setOrder] = useState<number>(1);
	const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
	const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
	const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
		{ name: "CamposGerenciados[]", title: "Favorito", value: "id" },
		{ name: "CamposGerenciados[]", title: "Ano lote", value: "year" },
		{ name: "CamposGerenciados[]", title: "Cód lote", value: "cod_lote" },
		{ name: "CamposGerenciados[]", title: "NCC", value: "ncc" },
		{ name: "CamposGerenciados[]", title: "Fase", value: "fase" },
		{ name: "CamposGerenciados[]", title: "Peso (kg)", value: "peso" },
		{ name: "CamposGerenciados[]", title: "Quant sementes", value: "quant_sementes" },
		{ name: "CamposGerenciados[]", title: "Nome do genotipo", value: "name_genotipo" },
		{ name: "CamposGerenciados[]", title: "Mome principal", value: "name_main" },
		{ name: "CamposGerenciados[]", title: "GMR", value: "gmr" },
		{ name: "CamposGerenciados[]", title: "BGM", value: "bgm" },
		{ name: "CamposGerenciados[]", title: "Tecnologia", value: "tecnologia" },
	]);
	const [filter, setFilter] = useState<any>(filterApplication);
	const [colorStar, setColorStar] = useState<string>('');

	const filtersStatusItem = [
		{ id: 2, name: 'Todos' },
		{ id: 1, name: 'Ativos' },
		{ id: 0, name: 'Inativos' }
	];

	const filterStatus = filterApplication.split('')

	const take: number = itensPerPage;
	const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
	const pages = Math.ceil(total / take);

	const columns = columnsOrder(camposGerenciados);

	const formik = useFormik<IFilter>({
		initialValues: {
			filterStatus: '',
			filterGenotipo: '',
			filterName: '',
			filterVolume: '',
			orderBy: '',
			typeOrder: ''
		},
		onSubmit: async ({ filterStatus, filterGenotipo, filterName, filterVolume }) => {
			const parametersFilter = `filterStatus=${filterStatus ? filterStatus : 1}&filterGenotipo=${filterGenotipo}&filterName=${filterName}&filterVolume=${filterVolume}&id_portfolio=${id_genotipo}`;
			await loteService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response) => {
				setFilter(parametersFilter);
				setLotes(response.response);
				setTotalItems(response.total)
				setCurrentPage(0)
			});
		}
	});

	function headerTableFactory(name: any, title: string) {
		return {
			title: (
				<div className='flex items-center'>
					<button className='font-medium text-gray-900' onClick={() => handleOrder(title, orderList)}>
						{name}
					</button>
				</div>
			),
			field: title,
			sorting: false
		}
	}

	function idHeaderFactory() {
		return {
			title: (
				<div className="flex items-center">
					{arrowOrder}
				</div>
			),
			field: 'id',
			width: 0,
			sorting: false,
			render: () => (
				colorStar === '#eba417'
					? (
						<div className='h-10 flex'>
							<div>
								<button
									className="w-full h-full flex items-center justify-center border-0"
									onClick={() => setColorStar('')}
								>
									<AiTwotoneStar size={25} color={'#eba417'} />
								</button>
							</div>
						</div>
					)
					: (
						<div className='h-10 flex'>
							<div>
								<button
									className="w-full h-full flex items-center justify-center border-0"
									onClick={() => setColorStar('#eba417')}
								>
									<AiTwotoneStar size={25} />
								</button>
							</div>
						</div>
					)
			)
		};
	}

	function columnsOrder(camposGerenciados: string) {
		const columnCampos: string[] = camposGerenciados.split(',');
		const tableFields: any = [];

		Object.keys(columnCampos).forEach((item, index) => {
			if (columnCampos[index] === 'id') {
				tableFields.push(idHeaderFactory())
			}
			if (columnCampos[index] === 'year') {
				tableFields.push(headerTableFactory('Ano', 'year'))
			}
			if (columnCampos[index] === 'cod_lote') {
				tableFields.push(headerTableFactory('Cód. lote', 'cod_lote'))
			}
			if (columnCampos[index] === 'ncc') {
				tableFields.push(headerTableFactory('NCC', 'ncc'))
			}
			if (columnCampos[index] === 'fase') {
				tableFields.push(headerTableFactory('Fase', 'fase'))
			}
			if (columnCampos[index] === 'peso') {
				tableFields.push(headerTableFactory('Peso', 'peso'))
			}
			if (columnCampos[index] === 'quant_sementes') {
				tableFields.push(headerTableFactory('Quant. sementes', 'quant_sementes'))
			}
			if (columnCampos[index] === 'name_genotipo') {
				tableFields.push(headerTableFactory('Nome genotipo', 'genotipo.name_genotipo'))
			}
			if (columnCampos[index] === 'name_main') {
				tableFields.push(headerTableFactory('Nome principal', 'genotipo.name_main'))
			}
			if (columnCampos[index] === 'gmr') {
				tableFields.push(headerTableFactory('GRM', 'genotipo.gmr'))
			}
			if (columnCampos[index] === 'bgm') {
				tableFields.push(headerTableFactory('BGM', 'genotipo.bgm'))
			}
			if (columnCampos[index] === 'tecnologia') {
				tableFields.push(headerTableFactory('Tecnologia', 'genotipo.tecnologia.name'))
			}
		});
		return tableFields;
	}

	async function handleOrder(column: string, order: string | any): Promise<void> {
		let typeOrder: any;
		let parametersFilter: any;
		if (order === 1) {
			typeOrder = 'asc';
		} else if (order === 2) {
			typeOrder = 'desc';
		} else {
			typeOrder = '';
		}

		if (filter && typeof (filter) !== 'undefined') {
			if (typeOrder !== '') {
				parametersFilter = filter + "&orderBy=" + column + "&typeOrder=" + typeOrder;
			} else {
				parametersFilter = filter;
			}
		} else {
			if (typeOrder !== '') {
				parametersFilter = "orderBy=" + column + "&typeOrder=" + typeOrder;
			} else {
				parametersFilter = filter;
			}
		}

		await loteService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
			if (response.status === 200) {
				setLotes(response.response)
			}
		});

		if (orderList === 2) {
			setOrder(0);
			setArrowOrder(<AiOutlineArrowDown />);
		} else {
			setOrder(orderList + 1);
			if (orderList === 1) {
				setArrowOrder(<AiOutlineArrowUp />);
			} else {
				setArrowOrder('');
			}
		}
	};

	async function getValuesColumns(): Promise<void> {
		const els: any = document.querySelectorAll("input[type='checkbox'");
		let selecionados = '';
		for (let i = 0; i < els.length; i++) {
			if (els[i].checked) {
				selecionados += els[i].value + ',';
			}
		}
		const totalString = selecionados.length;
		const campos = selecionados.substr(0, totalString - 1);
		if (preferences.id === 0) {
			await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 12 }).then((response) => {
				userLogado.preferences.lote = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
				preferences.id = response.response.id;
			});
			localStorage.setItem('user', JSON.stringify(userLogado));
		} else {
			userLogado.preferences.lote = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
			await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
			localStorage.setItem('user', JSON.stringify(userLogado));
		}

		setStatusAccordion(false);
		setCamposGerenciados(campos);
	}

	function handleOnDragEnd(result: DropResult): void {
		setStatusAccordion(true);
		if (!result) return;

		const items = Array.from(generatesProps);
		const [reorderedItem] = items.splice(result.source.index, 1);
		const index = Number(result.destination?.index);
		items.splice(index, 0, reorderedItem);

		setGeneratesProps(items);
	}

	function handleTotalPages(): void {
		if (currentPage < 0) {
			setCurrentPage(0);
		} else if (currentPage >= pages) {
			setCurrentPage(pages - 1);
		}
	}

	async function handlePagination(): Promise<void> {
		const skip = currentPage * Number(take);
		let parametersFilter = 'skip=' + skip + '&take=' + take;

		if (filter) {
			parametersFilter = parametersFilter + '&' + filter;
		}
		await loteService.getAll(parametersFilter).then((response) => {
			if (response.status === 200) {
				setLotes(response.response);
			}
		});
	}

	useEffect(() => {
		handlePagination();
		handleTotalPages();
	}, [currentPage]);

	return (
		<>
			<Head><title>Listagem de Lotes</title></Head>

			<Content contentHeader={tabsDropDowns} moduloActive={'config'}>
				<main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
					<AccordionFilter title="Filtrar lotes">
						<div className='w-full flex gap-2'>
							<form
								className="flex flex-col
                  w-full
                  items-center
                  px-4
                  bg-white
                "
								onSubmit={formik.handleSubmit}
							>
								<div className="w-full h-full
                  flex
                  justify-center
                  pb-2
                ">
									<div className="h-10 w-1/2 ml-4">
										<label className="block text-gray-900 text-sm font-bold mb-2">
											Status
										</label>
										<Select name="filterStatus" onChange={formik.handleChange} defaultValue={filterStatus[13]} values={filtersStatusItem.map(id => id)} selected={'1'} />
									</div>
									<div className="h-10 w-1/2 ml-4">
										<label className="block text-gray-900 text-sm font-bold mb-2">
											Genótipo
										</label>
										<Input
											type="text"
											placeholder="Genótipo"
											max="40"
											id="filterGenotipo"
											name="filterGenotipo"
											onChange={formik.handleChange}
										/>
									</div>
									<div className="h-10 w-1/2 ml-4">
										<label className="block text-gray-900 text-sm font-bold mb-2">
											Nome
										</label>
										<Input
											type="text"
											placeholder="Nome"
											max="40"
											id="filterName"
											name="filterName"
											onChange={formik.handleChange}
										/>
									</div>
									{/* <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Volume
                    </label>
                    <Input
                      type="text"
                      placeholder="Volume"
                      max="40"
                      id="filterVolume"
                      name="filterVolume"
                      onChange={formik.handleChange}
                    />
                  </div> */}
								</div>

								<div className="h-16 w-32 mt-3">
									<Button
										type="submit"
										onClick={() => { }}
										value="Filtrar"
										bgColor="bg-blue-600"
										textColor="white"
										icon={<BiFilterAlt size={20} />}
									/>
								</div>
							</form>
						</div>
					</AccordionFilter>

					<div className="w-full h-full overflow-y-scroll">
						<MaterialTable
							style={{ background: '#f9fafb' }}
							columns={columns}
							data={lotes}
							options={{
								showTitle: false,
								headerStyle: {
									zIndex: 20
								},
								search: false,
								filtering: false,
								pageSize: itensPerPage
							}}
							components={{
								Toolbar: () => (
									<div
										className='w-full max-h-96
                    flex
                    items-center
                    justify-between
                    gap-4
                    bg-gray-50
                    py-2
                    px-5
                    border-solid border-b
                    border-gray-200
                  '>
										{/* <div className='h-12'>
                      <Button
                        title="Importar Planilha"
                        value="Importar Planilha"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="lote/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
                      />
                    </div> */}

										<strong className='text-blue-600'>Total registrado: {itemsTotal}</strong>

										<div className='h-full flex items-center gap-2'>
											<div className="border-solid border-2 border-blue-600 rounded">
												<div className="w-72">
													<AccordionFilter title='Gerenciar Campos' grid={statusAccordion}>
														<DragDropContext onDragEnd={handleOnDragEnd}>
															<Droppable droppableId='characters'>
																{
																	(provided) => (
																		<ul className="w-full h-full characters" {...provided.droppableProps} ref={provided.innerRef}>
																			<div className="h-8 mb-3">
																				<Button
																					value="Atualizar"
																					bgColor='bg-blue-600'
																					textColor='white'
																					onClick={getValuesColumns}
																					icon={<IoReloadSharp size={20} />}
																				/>
																			</div>
																			{
																				generatesProps.map((generate, index) => (
																					<Draggable key={index} draggableId={String(generate.title)} index={index}>
																						{(provided) => (
																							<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
																								<CheckBox
																									name={generate.name}
																									title={generate.title?.toString()}
																									value={generate.value}
																									defaultChecked={camposGerenciados.includes(generate.value as string)}
																								/>
																							</li>
																						)}
																					</Draggable>
																				))
																			}
																			{provided.placeholder}
																		</ul>
																	)
																}
															</Droppable>
														</DragDropContext>
													</AccordionFilter>
												</div>
											</div>
											{/* <div className='h-12 flex items-center justify-center w-full'>
                        <Button title="Exportar planilha de lotes" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel(); }} />
                      </div> */}
											<div className='h-12 flex items-center justify-center w-full'>
												<Button icon={<RiSettingsFill size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { }} href="lote/importar-planilha/config-planilha" />
											</div>
										</div>
									</div>
								),
								Pagination: (props) => (
									<>
										<div
											className="flex
                      h-20
                      gap-2
                      pr-2
                      py-5
                      bg-gray-50
                    "
											{...props}
										>
											<Button
												onClick={() => setCurrentPage(currentPage - 10)}
												bgColor="bg-blue-600"
												textColor="white"
												icon={<MdFirstPage size={18} />}
												disabled={currentPage <= 1}
											/>
											<Button
												onClick={() => setCurrentPage(currentPage - 1)}
												bgColor="bg-blue-600"
												textColor="white"
												icon={<BiLeftArrow size={15} />}
												disabled={currentPage <= 0}
											/>
											{
												Array(1).fill('').map((value, index) => (
													<>
														<Button
															key={index}
															onClick={() => setCurrentPage(index)}
															value={`${currentPage + 1}`}
															bgColor="bg-blue-600"
															textColor="white"
															disabled={true}
														/>
													</>
												))
											}
											<Button
												onClick={() => setCurrentPage(currentPage + 1)}
												bgColor="bg-blue-600"
												textColor="white"
												icon={<BiRightArrow size={15} />}
												disabled={currentPage + 1 >= pages}
											/>
											<Button
												onClick={() => setCurrentPage(currentPage + 10)}
												bgColor="bg-blue-600"
												textColor="white"
												icon={<MdLastPage size={18} />}
												disabled={currentPage + 1 >= pages}
											/>
										</div>
									</>
								) as any
							}}
						/>
					</div>
				</main>
			</Content>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const PreferencesControllers = new UserPreferenceController();
	const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 10;

	const token = req.cookies.token;

	removeCookies('filterBeforeEdit', { req, res });
	removeCookies('pageBeforeEdit', { req, res });

	const { publicRuntimeConfig } = getConfig();
	const baseUrl = `${publicRuntimeConfig.apiUrl}/lote`;
	const urlParameters: any = new URL(baseUrl);

	const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
	urlParameters.search = new URLSearchParams(param).toString();

	const filterApplication = 'filterStatus=1';
	const requestOptions = {
		method: 'GET',
		credentials: 'include',
		headers: { Authorization: `Bearer ${token}` }
	} as RequestInit | undefined;

	const response = await fetch(`${urlParameters}`, requestOptions);
	const { response: allLote, total: totalItems } = await response.json();

	return {
		props: {
			allLote,
			totalItems,
			itensPerPage,
			filterApplication
		}
	};
};
