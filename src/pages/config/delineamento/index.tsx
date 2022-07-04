import { removeCookies, setCookies } from "cookies-next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Head from "next/head";
import router from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineTable, AiTwotoneStar } from "react-icons/ai";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import { MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line, RiSettingsFill } from "react-icons/ri";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { delineamentoService, userPreferencesService } from "src/services";
import * as XLSX from 'xlsx';
import {
	AccordionFilter, Button, CheckBox, Content, Input, Select
} from "../../../components";
import * as ITabs from '../../../shared/utils/dropdown';



interface IDelineamentoProps {
	id: Number | any;
	name: String | any;
	repeticao: string;
	trat_repeticao: Number;
	created_by: Number;
	status: Number;
};

interface IFilter {
	filterStatus: object | any;
	filterName: string | any;
	filterRepeat: string | any;
	filterTreatment: string | any;
	orderBy: object | any;
	typeOrder: object | any;
}
interface IGenerateProps {
	name: string | undefined;
	title: string | number | readonly string[] | undefined;
	value: string | number | readonly string[] | undefined;
}
interface Idata {
	delineamentos: IDelineamentoProps[];
	totalItems: Number;
	filter: string | any;
	itensPerPage: number | any;
	filterApplication: object | any;
	cultureId: number;
	pageBeforeEdit: string | any
	filterBeforeEdit: string | any
}

export default function Listagem({ delineamentos, itensPerPage, filterApplication, totalItems, cultureId, pageBeforeEdit, filterBeforeEdit }: Idata) {
	const { TabsDropDowns } = ITabs.default;

	const tabsDropDowns = TabsDropDowns();

	tabsDropDowns.map((tab) => (
		tab.titleTab === 'DELINEAMENTO'
			? tab.statusTab = true
			: tab.statusTab = false
	));

	const userLogado = JSON.parse(localStorage.getItem("user") as string);
	const preferences = userLogado.preferences.delineamento || { id: 0, table_preferences: "id,name,repeticao,trat_repeticao,sequencia,status" };
	const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

	const [delineamento, setDelineamento] = useState<IDelineamentoProps[]>(() => delineamentos);
	const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
	const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit)

	const [orderList, setOrder] = useState<number>(1);
	const [arrowOrder, setArrowOrder] = useState<any>('');
	const [filter, setFilter] = useState<any>(filterApplication);
	const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
	const [genaratesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
		{ name: "CamposGerenciados[]", title: "Favorito ", value: "id", defaultChecked: () => camposGerenciados.includes('id') },
		{ name: "CamposGerenciados[]", title: "Nome", value: "name", defaultChecked: () => camposGerenciados.includes('name') },
		{ name: "CamposGerenciados[]", title: "Repetiçao ", value: "repeticao", defaultChecked: () => camposGerenciados.includes('repeticao') },
		{ name: "CamposGerenciados[]", title: "Trat. Repetição", value: "trat_repeticao", defaultChecked: () => camposGerenciados.includes('trat_repeticao') },
		{ name: "CamposGerenciados[]", title: "Sequência", value: "sequencia", defaultChecked: () => camposGerenciados.includes('sequencia') },
		{ name: "CamposGerenciados[]", title: "Status", value: "status", defaultChecked: () => camposGerenciados.includes('status') }
	]);
	const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
	const [colorStar, setColorStar] = useState<string>('');

	const take: number = itensPerPage;
	const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
	const pages = Math.ceil(total / take);

	const columns = colums(camposGerenciados);

	const formik = useFormik<IFilter>({
		initialValues: {
			filterStatus: '',
			filterName: '',
			filterRepeat: '',
			filterTreatment: '',
			orderBy: '',
			typeOrder: '',
		},
		onSubmit: async ({ filterStatus, filterName, filterRepeat, filterTreatment }) => {
			const parametersFilter = `filterStatus=${filterStatus ? filterStatus : 1}&filterName=${filterName}&filterRepeat=${filterRepeat}&filterTreatment=${filterTreatment}&id_culture=${cultureId}`
			setFiltersParams(parametersFilter)
			setCookies("filterBeforeEdit", filtersParams)
			await delineamentoService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response) => {
				setFilter(parametersFilter);
				setDelineamento(response.response);
				setTotalItems(response.total)
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
			render: (rowData: IDelineamentoProps) => (
				rowData.status ? (
					<div className='h-10 flex'>
						<div>
							<Button
								icon={<FaRegThumbsUp size={16} />}
								title="Ativo"
								onClick={() => handleStatus(rowData.id, !rowData.status)}
								bgColor="bg-green-600"
								textColor="white"
							/>
						</div>
					</div>
				) : (
					<div className='h-10 flex'>
						<div>
							<Button
								icon={<FaRegThumbsDown size={16} />}
								title="Inativo"
								onClick={() => handleStatus(
									rowData.id, !rowData.status
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

	function colums(camposGerenciados: any): any {
		const columnCampos: any = camposGerenciados.split(',');
		const tableFields: any = [];
		Object.keys(columnCampos).forEach((item) => {
			if (columnCampos[item] === 'id') {
				tableFields.push(idHeaderFactory())
			}
			if (columnCampos[item] === 'name') {
				tableFields.push(headerTableFactory('Nome', 'name'));
			}

			if (columnCampos[item] === 'repeticao') {
				tableFields.push(headerTableFactory('Repetição', 'repeticao'));
			}

			if (columnCampos[item] === 'trat_repeticao') {
				tableFields.push(headerTableFactory('Trat. Repetição', 'trat_repeticao'));
			}

			if (columnCampos[item] === 'status') {
				tableFields.push(statusHeaderFactory())
			}
			if (columnCampos[item] === 'sequencia') {
				tableFields.push({
					title: "Sequência",
					field: "sequencia",
					sorting: false,
					searchable: false,
					filterPlaceholder: "Filtrar por status",
					render: (rowData: IDelineamentoProps) => (
						<div className='h-10 flex'>
							<div className="
                  h-10
                ">
								<Button
									icon={<AiOutlineTable size={16} />}
									onClick={() => { router.push(`delineamento/sequencia-delineamento?id_delineamento=${rowData.id}`) }}
									bgColor="bg-yellow-500"
									textColor="white"
									title={`Sequência de ${rowData.name}`}
								/>
							</div>
						</div>
					),
				})
			}
		});
		return tableFields;
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

		await delineamentoService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
			if (response.status === 200) {
				setDelineamento(response.response)
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
	}

	async function getValuesColumns(): Promise<void> {
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
			await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 7 }).then((response) => {
				userLogado.preferences.delineamento = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
				preferences.id = response.response.id;
			});
			localStorage.setItem('user', JSON.stringify(userLogado));
		} else {
			userLogado.preferences.delineamento = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
			await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
			localStorage.setItem('user', JSON.stringify(userLogado));
		}

		setStatusAccordion(false);
		setCamposGerenciados(campos);
	};

	async function handleStatus(id: number, status: any): Promise<void> {
		if (status) {
			status = 1;
		} else {
			status = 0;
		}

		await delineamentoService.update({ id: id, status: status });

		const index = delineamento.findIndex((delineamento) => delineamento.id === id);

		if (index === -1) {
			return;
		}

		setDelineamento((oldUser) => {
			const copy = [...oldUser];
			copy[index].status = status;
			return copy;
		});
	};

	function handleOnDragEnd(result: DropResult) {
		setStatusAccordion(true);
		if (!result) return;

		const items = Array.from(genaratesProps);
		const [reorderedItem] = items.splice(result.source.index, 1);
		const index: number = Number(result.destination?.index);
		items.splice(index, 0, reorderedItem);

		setGeneratesProps(items);
	};

	const downloadExcel = async (): Promise<void> => {
		if (!filterApplication.includes("paramSelect")) {
			filterApplication += `&paramSelect=${camposGerenciados}&id_culture=${cultureId}`;
		}

		await delineamentoService.getAll(filterApplication).then((response) => {
			if (response.status === 200) {
				const newData = delineamento.map((row) => {
					if (row.status === 0) {
						row.status = "Inativo" as any;
					} else {
						row.status = "Ativo" as any;
					}

					return row;
				});

				const workSheet = XLSX.utils.json_to_sheet(newData);
				const workBook = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(workBook, workSheet, "delineamento");

				// Buffer
				let buf = XLSX.write(workBook, {
					bookType: "xlsx", //xlsx
					type: "buffer",
				});
				// Binary
				XLSX.write(workBook, {
					bookType: "xlsx", //xlsx
					type: "binary",
				});
				// Download
				XLSX.writeFile(workBook, "Delineamento.xlsx");
			}
		});
	};

	useEffect(() => {
		async function handlePagination(): Promise<void> {
			let skip = currentPage * Number(take);
			let parametersFilter = `skip=${skip}&take=${take}`;

			if (filter) {
				parametersFilter = parametersFilter + "&" + filter;
			}
			await delineamentoService.getAll(parametersFilter).then((response) => {
				if (response.status === 200) {
					setDelineamento(response.response);
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
		handlePagination();
		handleTotalPages();
	}, [currentPage]);

	return (
		<>
			<Head>
				<title>Listagem dos Layout</title>
			</Head>
			<Content contentHeader={tabsDropDowns} moduloActive={'config'}>
				<main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
					<AccordionFilter title="Filtrar delineamentos">
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

									<div className="h-10 w-1/2 ml-4">
										<label className="block text-gray-900 text-sm font-bold mb-2">
											Nome
										</label>
										<Input
											type="text"
											placeholder="nome"
											id="filterName"
											name="filterName"
											onChange={formik.handleChange}
										/>
									</div>
									<div className="h-10 w-1/2 ml-4">
										<label className="block text-gray-900 text-sm font-bold mb-2">
											Repetição
										</label>
										<Input
											type="number"
											placeholder="repetição"
											id="filterRepeat"
											name="filterRepeat"
											onChange={formik.handleChange}
										/>
									</div>
									<div className="h-10 w-1/2 ml-4">
										<label className="block text-gray-900 text-sm font-bold mb-2">
											Trat. Repetição
										</label>
										<Input
											type="number"
											placeholder="trat. Repetição"
											id="filterTreatment"
											name="filterTreatment"
											onChange={formik.handleChange}
										/>
									</div>
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
							style={{ background: '#f9fafb' }}
							columns={columns}
							data={delineamento}
							options={{
								showTitle: false,
								headerStyle: {
									zIndex: 20
								},
								rowStyle: { background: '#f9fafb' },
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
                        title="Cadastrar Delineamento"
                        value="Cadastrar Delineamento"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {router.push('delineamento/cadastro')}}
                        icon={<FiUserPlus size={20} />}
                      />
                    </div> */}
										<div className='h-12'>
											<Button
												title="Importar Planilha"
												value="Importar Planilha"
												bgColor="bg-blue-600"
												textColor="white"
												onClick={() => { }}
												href="delineamento/importar-planilha"
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
																					onClick={getValuesColumns}
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
												{/* <Button title="Importação de planilha" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => {router.push('sequencia-delineamento/importacao')}} /> */}
												<Button title="Exportar planilha de delineamento" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
											</div>
											<div className='h-12 flex items-center justify-center w-full'>
												<Button icon={<RiSettingsFill size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { }} href="delineamento/importar-planilha/config-planilha" />

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
	const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 15;

	const token = req.cookies.token;
	const cultureId = req.cookies.cultureId;
	const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
	const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : "filterStatus=1";

	removeCookies('filterBeforeEdit', { req, res });
	removeCookies('pageBeforeEdit', { req, res });

	const filterApplication = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit + "&id_culture=" + cultureId : "filterStatus=1&id_culture=" + cultureId;

	const { publicRuntimeConfig } = getConfig();
	const baseUrl = `${publicRuntimeConfig.apiUrl}/delineamento`;
	const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${cultureId}`;
	const urlParameters: any = new URL(baseUrl);
	urlParameters.search = new URLSearchParams(param).toString();

	const requestOptions = {
		method: 'GET',
		credentials: 'include',
		headers: { Authorization: `Bearer ${token}` }
	} as RequestInit | undefined;

	const response = await fetch(urlParameters.toString(), requestOptions);
	const { response: delineamentos, total: totalItems } = await response.json();;

	return {
		props: {
			delineamentos,
			totalItems,
			itensPerPage,
			filterApplication,
			cultureId,
			pageBeforeEdit,
			filterBeforeEdit
		},
	}
}
