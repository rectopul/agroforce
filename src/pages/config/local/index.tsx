import { removeCookies, setCookies } from "cookies-next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Head from "next/head";
import router from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from "react-icons/ai";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiSettingsFill } from "react-icons/ri";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { localService, userPreferencesService } from "src/services";
import * as XLSX from 'xlsx';
import {
	AccordionFilter, Button, CheckBox, Content, Input, Select
} from "../../../components";
import * as ITabs from '../../../shared/utils/dropdown';



interface ILocalProps {
	id: Number | any;
	name_local_culture: String | any;
	cod_red_local: String | any;
	label_country: String | any;
	label_region: String | any;
	name_locality: String | any;
	adress: String | any;
	created_by: Number;
	status: Number;
};


interface IFilter {
	filterStatus: object | any;
	filterNameLocalCulture: string | any;
	filterLabel: string | any;
	filterMloc: string | any;
	filterAdress: string | any;
	filterLabelCountry: string | any;
	filterLabelRegion: string | any;
	filterNameLocality: string | any;
	orderBy: object | any;
	typeOrder: object | any;
}
interface IGenarateProps {
	name: string | undefined;
	title: string | number | readonly string[] | undefined;
	value: string | number | readonly string[] | undefined;
}
interface Idata {
	locais: ILocalProps[];
	totalItems: Number;
	filter: string | any;
	itensPerPage: number | any;
	filterAplication: object | any;
	pageBeforeEdit: string | any
	filterBeforeEdit: string | any
}

export default function Listagem({ locais, itensPerPage, filterAplication, totalItems, pageBeforeEdit, filterBeforeEdit }: Idata) {
	const { TabsDropDowns } = ITabs.default;
	const tabsDropDowns = TabsDropDowns('config');
	tabsDropDowns.map((tab) => (
		tab.titleTab === 'LOCAL'
			? tab.statusTab = true
			: tab.statusTab = false
	));

	const userLogado = JSON.parse(localStorage.getItem("user") as string);
	const preferences = userLogado.preferences.local || { id: 0, table_preferences: "id,name_local_culture,label,mloc,adress,label_country,label_region,name_locality,status" };
	const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

	const [local, setLocal] = useState<ILocalProps[]>(() => locais);
	const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
	const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit)
	const [orderList, setOrder] = useState<number>(1);
	const [arrowOrder, setArrowOrder] = useState<any>('');
	const [filter, setFilter] = useState<any>(filterAplication);
	const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
	const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
		{ name: "CamposGerenciados[]", title: "Favorito ", value: "id", defaultChecked: () => camposGerenciados.includes('id') },
		{ name: "CamposGerenciados[]", title: "Nome do L. de Cult.", value: "name_local_culture", defaultChecked: () => camposGerenciados.includes('name_local_culture') },
		{ name: "CamposGerenciados[]", title: "Rótulo", value: "label", defaultChecked: () => camposGerenciados.includes('label') },
		{ name: "CamposGerenciados[]", title: "MLOC", value: "mloc", defaultChecked: () => camposGerenciados.includes('mloc') },
		{ name: "CamposGerenciados[]", title: "Nome Fazenda", value: "adress", defaultChecked: () => camposGerenciados.includes('adress') },
		{ name: "CamposGerenciados[]", title: "País", value: "label_country", defaultChecked: () => camposGerenciados.includes('label_country') },
		{ name: "CamposGerenciados[]", title: "Região", value: "label_region", defaultChecked: () => camposGerenciados.includes('label_region') },
		{ name: "CamposGerenciados[]", title: "Localidade", value: "name_locality", defaultChecked: () => camposGerenciados.includes('name_locality') },
		{ name: "CamposGerenciados[]", title: "Status", value: "status", defaultChecked: () => camposGerenciados.includes('status') },
	]);
	const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
	const [selectedRowById, setSelectedRowById] = useState<number>();
	const [colorStar, setColorStar] = useState<string>('');

	const take: number = itensPerPage;
	const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
	const pages = Math.ceil(total / take);

	const columns = columnsOrder(camposGerenciados);


	const formik = useFormik<IFilter>({
		initialValues: {
			filterStatus: '',
			filterNameLocalCulture: '',
			filterLabel: '',
			filterMloc: '',
			filterAdress: '',
			filterLabelCountry: '',
			filterLabelRegion: '',
			filterNameLocality: '',
			orderBy: '',
			typeOrder: '',
		},
		onSubmit: async ({
			filterStatus,
			filterNameLocalCulture,
			filterLabel,
			filterMloc,
			filterAdress,
			filterLabelCountry,
			filterLabelRegion,
			filterNameLocality
		}) => {
			const parametersFilter = `filterStatus=${filterStatus ? filterStatus : 1}&filterNameLocalCulture=${filterNameLocalCulture}&filterLabel=${filterLabel}&filterMloc=${filterMloc}&filterAdress=${filterAdress}&filterLabelCountry=${filterLabelCountry}&filterLabelRegion=${filterLabelRegion}&filterNameLocality=${filterNameLocality}`

			setFiltersParams(parametersFilter)
			setCookies("filterBeforeEdit", filtersParams)
			await localService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response) => {
				setFilter(parametersFilter);
				setTotalItems(response.total)
				setLocal(response.response);
				setCurrentPage(0)
			})
		},
	});

	const filters = [
		{ id: 2, name: 'Todos' },
		{ id: 1, name: 'Ativos' },
		{ id: 0, name: 'Inativos' },
	];

	const filterStatus = filterBeforeEdit.split('')

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

	function statusHeaderFactory() {
		return {
			title: "Status",
			field: "status",
			sorting: false,
			searchable: false,
			filterPlaceholder: "Filtrar por status",
			render: (rowData: ILocalProps) => (
				rowData.status ? (
					<div className='h-10 flex'>
						<div className="
							h-10
						">
							<Button
								icon={<BiEdit size={16} />}
								title={`Atualizar ${rowData.adress}`}
								onClick={() => {
									setCookies("filterBeforeEdit", filtersParams)
									setCookies("pageBeforeEdit", currentPage?.toString())
									router.push(`/config/local/atualizar?id=${rowData.id}`)
								}}
								bgColor="bg-blue-600"
								textColor="white"
							/>
						</div>
						<div>
							<Button
								icon={<FaRegThumbsUp size={16} />}
								onClick={async () => await handleStatus(
									rowData.id,
									rowData.status
								)}
								bgColor="bg-green-600"
								textColor="white"
							/>
						</div>
					</div>
				) : (
					<div className='h-10 flex'>
						<div className="
							h-10
						">
							<Button
								icon={<BiEdit size={16} />}
								title={`Atualizar ${rowData.adress}`}
								onClick={() => {
									setCookies("filterBeforeEdit", filtersParams)
									setCookies("pageBeforeEdit", currentPage?.toString())
									router.push(`/config/local/atualizar?id=${rowData.id}`)
								}}
								bgColor="bg-blue-600"
								textColor="white"
							/>
						</div>
						<div>
							<Button
								icon={<FaRegThumbsDown size={16} />}
								onClick={async () => await handleStatus(
									rowData.id,
									rowData.status
								)}
								bgColor="bg-red-800"
								textColor="white"
							/>
						</div>
					</div>
				)
			),
		}
	}

	function columnsOrder(camposGerenciados: any): any {
		const objectCampos: any = camposGerenciados.split(',');
		const arrOb: any = [];
		Object.keys(objectCampos).forEach((item) => {
			if (objectCampos[item] === 'id') {
				arrOb.push(idHeaderFactory())
			}
			if (objectCampos[item] === 'name_local_culture') {
				arrOb.push(headerTableFactory('Nome do L. de cult.', 'name_local_culture'))
			}
			if (objectCampos[item] === 'label') {
				arrOb.push(headerTableFactory('Rótulo', 'label'))
			}
			if (objectCampos[item] === 'adress') {
				arrOb.push(headerTableFactory('Nome da fazenda', 'adress'))
			}
			if (objectCampos[item] === 'mloc') {
				arrOb.push(headerTableFactory('MLOC', 'mloc'))
			}
			if (objectCampos[item] === 'label_country') {
				arrOb.push(headerTableFactory('País', 'label_country'))
			}
			if (objectCampos[item] === 'label_region') {
				arrOb.push(headerTableFactory('Região', 'label_region'))
			}
			if (objectCampos[item] === 'name_locality') {
				arrOb.push(headerTableFactory('Localidade', 'name_locality'))
			}
			if (objectCampos[item] === 'status') {
				arrOb.push(statusHeaderFactory())
			}
		});
		return arrOb;
	};

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
				parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`
			} else {
				parametersFilter = filter;
			}
		} else {
			if (typeOrder !== '') {
				parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}`;
			} else {
				parametersFilter = filter;
			}
		}

		await localService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
			if (response.status === 200) {
				setLocal(response.response)
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

	async function getValuesComluns(): Promise<void> {
		let els: any = document.querySelectorAll("input[type='checkbox'");
		let selecionados = '';
		for (let i = 0; i < els.length; i++) {
			if (els[i].checked) {
				selecionados += els[i].value + ',';
			}
		}
		let totalString = selecionados.length;
		let campos = selecionados.substr(0, totalString - 1)
		if (preferences.id === 0) {
			await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 4 }).then((response) => {
				userLogado.preferences.local = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
				preferences.id = response.response.id;
			});
			localStorage.setItem('user', JSON.stringify(userLogado));
		} else {
			userLogado.preferences.local = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
			await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
			localStorage.setItem('user', JSON.stringify(userLogado));
		}

		setStatusAccordion(false);
		setCamposGerenciados(campos);
	};

	async function handleStatus(idLocal: number, rowStatus: any): Promise<void> {
		if (rowStatus === 0) {
			rowStatus = 1;
		} else {
			rowStatus = 0;
		}

		const index = local.findIndex((local) => local.id === idLocal);

		if (index === -1) {
			return;
		}

		setLocal((oldLocal) => {
			const copy = [...oldLocal];
			copy[index].status = rowStatus;
			return copy;
		});

		const {
			id,
			status
		} = local[index];

		await localService.update({
			id,
			status
		});
	};

	function handleOnDragEnd(result: DropResult) {
		setStatusAccordion(true);
		if (!result) return;

		const items = Array.from(genaratesProps);
		const [reorderedItem] = items.splice(result.source.index, 1);
		const index: number = Number(result.destination?.index);
		items.splice(index, 0, reorderedItem);

		setGenaratesProps(items);
	};

	const downloadExcel = async (): Promise<void> => {
		if (!filterAplication.includes("paramSelect")) {
			filterAplication += `&paramSelect=${camposGerenciados}`;
		}

		await localService.getAll(filterAplication).then((response) => {
			if (response.status === 200) {
				const newData = response.response.map((row: any) => {
					row.status = (row.status === 0) ? "Inativo" : "Ativo"
					row.dt_export = new Date();
					return row;
				});

				const workSheet = XLSX.utils.json_to_sheet(newData);
				const workBook = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(workBook, workSheet, "locais");

				// buffer
				let blabel_region = XLSX.write(workBook, {
					bookType: "xlsx", //xlsx
					type: "buffer",
				});
				// Binary
				XLSX.write(workBook, {
					bookType: "xlsx", //xlsx
					type: "binary",
				});
				// Download
				XLSX.writeFile(workBook, "Locais.xlsx");
			}
		});
	};

	function handleTotalPages(): void {
		if (currentPage < 0) {
			setCurrentPage(0);
		} else if (currentPage >= pages) {
			setCurrentPage(pages - 1);
		}
	};

	async function handlePagination(): Promise<void> {
		const skip = currentPage * Number(take);
		let parametersFilter = "skip=" + skip + "&take=" + take;

		if (filter) {
			parametersFilter = parametersFilter + "&" + filter;
		}
		await localService.getAll(parametersFilter).then((response) => {
			if (response.status === 200) {
				setLocal(response.response);
			}
		});
	};

	function filterFieldFactory(title: any, name: any) {
		return (
			<div className="h-10 w-1/2 ml-4">
				<label className="block text-gray-900 text-sm font-bold mb-2">
					{name}
				</label>
				<Input
					type="text"
					placeholder={name}
					id={title}
					name={title}
					onChange={formik.handleChange}
				/>
			</div>
		)
	}

	useEffect(() => {
		handlePagination();
		handleTotalPages();
	}, [currentPage]);

	return (
		<>
			<Head>
				<title>Listagem dos Locais</title>
			</Head>
			<Content contentHeader={tabsDropDowns} moduloActive={'config'}>
				<main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
					<AccordionFilter title="Filtrar locais">
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
										<Select name="filterStatus" onChange={formik.handleChange} defaultValue={filterStatus[13]} values={filters.map(id => id)} selected={'1'} />
									</div>

									{filterFieldFactory('filterNameLocalCulture', 'Nome do L. de Cult.')}

									{filterFieldFactory('filterLabel', 'Rótulo')}

									{filterFieldFactory('filterMloc', 'MLOC')}

									{filterFieldFactory('filterAdress', 'Nome da Fazenda')}

									{filterFieldFactory('filterLabelCountry', 'País')}

									{filterFieldFactory('filterLabelRegion', 'Região')}

									{filterFieldFactory('filterNameLocality', 'Localidade')}

								</div>

								<div className="h-16 w-32 mt-3">
									<Button
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

					{/* overflow-y-scroll */}
					<div className="w-full h-full overflow-y-scroll">
						<MaterialTable
							columns={columns}
							data={local}
							onRowClick={((evt?, selectedRow?: ILocalProps) => {
								setSelectedRowById(selectedRow?.id)
							})}
							options={{
								showTitle: false,
								search: false,
								filtering: false,
								pageSize: itensPerPage,
								rowStyle: (rowData: ILocalProps) => ({
									backgroundColor: (selectedRowById === rowData.id ? '#c7e3f5' : '#fff')
								}),
							}}
							components={{
								Toolbar: () => (
									<div
										className='w-full max-h-max	
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
										<div className='h-12'>
											<Button
												title="Importar Planilha"
												value="Importar Planilha"
												bgColor="bg-blue-600"
												textColor="white"
												onClick={() => { }}
												href="local/importar-planilha"
												icon={<RiFileExcel2Line size={20} />}
											/>
										</div>

										<strong className='text-blue-600'>Total registrado: {itemsTotal}</strong>

										<div className='h-full flex items-center gap-2
                    '>
											<div className="border-solid border-2 border-blue-600 rounded">
												<div className="w-64">
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
																					onClick={getValuesComluns}
																					icon={<IoReloadSharp size={20} />}
																				/>
																			</div>
																			{
																				genaratesProps.map((genarate, index) => (
																					<Draggable key={index} draggableId={String(genarate.title)} index={index}>
																						{(provided) => (
																							<li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
																								<CheckBox
																									name={genarate.name}
																									title={genarate.title?.toString()}
																									value={genarate.value}
																									defaultChecked={camposGerenciados.includes(genarate.value)}
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
											<div className='h-12 flex items-center justify-center w-full'>
												<Button title="Exportar planilha de locais" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
											</div>
											<div className='h-12 flex items-center justify-center w-full'>
												<Button icon={<RiSettingsFill size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { }} href="local/importar-planilha/config-planilha" />
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
	const userPreferenceController = new UserPreferenceController();
	const itensPerPage = await (await userPreferenceController.getConfigGerais(''))?.response[0]?.itens_per_page ?? 10;

	const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
	const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : "filterStatus=1";
	const filterAplication = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : "filterStatus=1"
	const token = req.cookies.token;

	removeCookies('filterBeforeEdit', { req, res });
	removeCookies('pageBeforeEdit', { req, res });


	const { publicRuntimeConfig } = getConfig();
	const baseUrl = `${publicRuntimeConfig.apiUrl}/local`;
	const param = `skip=0&take=${itensPerPage}&filterStatus=1`;

	const urlParameters: any = new URL(baseUrl);
	urlParameters.search = new URLSearchParams(param).toString();
	const requestOptions = {
		method: 'GET',
		credentials: 'include',
		headers: { Authorization: `Bearer ${token}` }
	} as RequestInit | undefined;

	const local = await fetch(urlParameters.toString(), requestOptions);
	const { response: locais, total: totalItems } = await local.json();

	return {
		props: {
			locais,
			totalItems,
			itensPerPage,
			filterAplication,
			pageBeforeEdit,
			filterBeforeEdit
		},
	}
}
