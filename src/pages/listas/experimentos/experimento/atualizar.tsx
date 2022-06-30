import { capitalize } from "@mui/material";
import { setCookies } from "cookies-next";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { GetServerSideProps } from "next";
import getConfig from 'next/config';
import Head from "next/head";
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from "react-icons/ai";
import { BiEdit, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { IoReloadSharp } from "react-icons/io5";
import { MdDateRange, MdFirstPage, MdLastPage } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import InputMask from "react-input-mask";
import { UserPreferenceController } from "src/controllers/user-preference.controller";
import { localService, materiaisService, userPreferencesService } from "src/services";
import { saveDegreesCelsius } from "src/shared/utils/formatDegreesCelsius";
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import {
	AccordionFilter,
	Button, CheckBox, Content,
	Input,
} from "../../../../components";
import * as ITabs from '../../../../shared/utils/dropdown';

export interface IData {
	allItens: any;
	totalItems: number;
	itensPerPage: number;
	filterAplication: object | any;
	id_experimento: number;
	experimento: object | any,
	pageBeforeEdit: string | any
}

interface IGenarateProps {
	name: string | undefined;
	title: string | number | readonly string[] | undefined;
	value: string | number | readonly string[] | undefined;
}


interface IUpdateExperimento {
	id: Number | any;
	protocolo_name: String | any;
	experimento_name: String | any;
	unidade_cultura_name: String | any;
	rotulo: String | any;
	foco: String | any;
	ensaio: String | any;
	cod_tec: String | any;
	epoca: String | any;
	pjr: String | any;
	name_unity_culture: String | any;
	status: Number;
};

export default function AtualizarLocal({ experimento, allItens, totalItems, itensPerPage, filterAplication, id_experimento, pageBeforeEdit }: IData) {
	const { TabsDropDowns } = ITabs.default;

	const tabsDropDowns = TabsDropDowns();

	tabsDropDowns.map((tab) => (
		tab.titleTab === 'EXPERIMENTO'
			? tab.statusTab = true
			: tab.statusTab = false
	));


	const router = useRouter();

	const userLogado = JSON.parse(localStorage.getItem("user") as string);
	const preferences = userLogado.preferences.materiais || { id: 0, table_preferences: "status,tratamentos,prox_nivel,name_main,name_genotipo,id_culture,cod_lote,ncc" };
	const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

	const [materiais, setMateriais] = useState<any>(() => allItens);
	const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
	const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
	const [orderList, setOrder] = useState<number>(1);
	const [arrowOrder, setArrowOrder] = useState<any>('');
	const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
	const [filter, setFilter] = useState<any>(filterAplication);
	const [colorStar, setColorStar] = useState<string>('');
	const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
		{ name: "CamposGerenciados[]", title: "Status", value: "status" },
		{ name: "CamposGerenciados[]", title: "Nº tratamento", value: "tratamentos" },
		{ name: "CamposGerenciados[]", title: "Nº linhas de próx. nível", value: "prox_nivel" },
		{ name: "CamposGerenciados[]", title: "Nome principal", value: "name_main" },
		{ name: "CamposGerenciados[]", title: "Nome genótipo", value: "name_genotipo" },
		{ name: "CamposGerenciados[]", title: "Cultura", value: "id_culture" },
		{ name: "CamposGerenciados[]", title: "Cód. Lote", value: "cod_lote" },
		{ name: "CamposGerenciados[]", title: "NCC", value: "ncc" },
	]);

	const take: number = itensPerPage;
	const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
	const pages = Math.ceil(total / take);
	const columns = columnsOrder(camposGerenciados);


	const formik = useFormik<IUpdateExperimento>({
		initialValues: {
			id: experimento.id,
			protocolo_name: experimento.protocolo_name,
			experimento_name: experimento.experimento_name,
			unidade_cultura_name: experimento.unidade_cultura_name,
			rotulo: experimento.rotulo,
			foco: experimento.foco.name,
			ensaio: experimento.ensaio.name,
			cod_tec: experimento.tecnologia.cod_tec,
			epoca: experimento.epoca,
			pjr: experimento.pjr,
			name_unity_culture: experimento.name_unity_culture,
			status: experimento.status,
		},
		onSubmit: async (values) => {

			await materiaisService.update({
				id: formik.values.id,
				protocolo_name: formik.values.protocolo_name,
				experimento_name: formik.values.experimento_name,
				rotulo: formik.values.rotulo,
				foco: formik.values.foco,
				ensaio: formik.values.ensaio,
				cod_tec: formik.values.cod_tec,
				epoca: formik.values.epoca,
				pjr: formik.values.pjr,
				name_unity_culture: formik.values.name_unity_culture,
				status: formik.values.status,
			}).then((response) => {
				if (response.status === 200) {
					Swal.fire('Foco atualizado com sucesso!');
					router.back();
				} else {
					Swal.fire(response.message);
				}
			});
		},
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

	function columnsOrder(camposGerenciados: string) {
		const columnCampos: string[] = camposGerenciados.split(',');
		const tableFields: any = [];

		Object.keys(columnCampos).forEach((item, index) => {
			if (columnCampos[index] === 'status') {
				tableFields.push(headerTableFactory('Status', 'status'));
			}
			if (columnCampos[index] === 'tratamentos') {
				tableFields.push(headerTableFactory('Nº tratamento', 'tratamentos'));
			}
			if (columnCampos[index] === 'prox_nivel') {
				tableFields.push(headerTableFactory('Nº linhas de próx. nível', 'prox_nivel'));
			}
			if (columnCampos[index] === 'name_main') {
				tableFields.push(headerTableFactory('Nome principal', 'name_main'));
			}
			if (columnCampos[index] === 'name_genotipo') {
				tableFields.push(headerTableFactory('Nome genótipo', 'name_genotipo'));
			}
			if (columnCampos[index] === 'id_culture') {
				tableFields.push(headerTableFactory('Cultura', 'id_culture'));
			}
			if (columnCampos[index] === 'cod_lote') {
				tableFields.push(headerTableFactory('Cód. Lote', 'cod_lote'));
			}
			if (columnCampos[index] === 'ncc') {
				tableFields.push(headerTableFactory('NCC', 'ncc'));
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

		await materiaisService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
			if (response.status === 200) {
				setMateriais(response.response)
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
		const els: any = document.querySelectorAll("input[type='checkbox'");
		let selecionados = '';
		for (let i = 0; i < els.length; i++) {
			if (els[i].checked) {
				selecionados += els[i].value + ',';
			}
		}
		const totalString = selecionados.length;
		const campos = selecionados.substr(0, totalString - 1)
		if (preferences.id === 0) {
			await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 23 }).then((response) => {
				userLogado.preferences.materiais = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
				preferences.id = response.response.id;
			});
			localStorage.setItem('user', JSON.stringify(userLogado));
		} else {
			userLogado.preferences.materiais = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
			await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
			localStorage.setItem('user', JSON.stringify(userLogado));
		}

		setStatusAccordion(false);
		setCamposGerenciados(campos);
	};

	function handleOnDragEnd(result: DropResult): void {
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
			filterAplication += `&paramSelect=${camposGerenciados},foco&id_experimento=${id_experimento}`;
		}
		await materiaisService.getAll(filterAplication).then((response) => {
			if (response.status === 200) {
				const newData = response.response.map((row: { status: any }) => {
					if (row.status === 0) {
						row.status = "Inativo";
					} else {
						row.status = "Ativo";
					}

					return row;
				});

				newData.map((item: any) => {
					item.foco = item.foco?.name
					item.safra = item.safra?.safraName
					return item
				})

				const workSheet = XLSX.utils.json_to_sheet(newData);
				const workBook = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(workBook, workSheet, "materiais");

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
				XLSX.writeFile(workBook, "unidade-cultura.xlsx");
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
		let skip = currentPage * Number(take);
		let parametersFilter = `skip=${skip}&take=${take}`

		if (filter) {
			parametersFilter = parametersFilter + "&" + filter;
		}
		await materiaisService.getAll(parametersFilter).then((response) => {
			if (response.status === 200) {
				setMateriais(response.response);
			}
		});
	};

	useEffect(() => {
		handlePagination(); ''
		handleTotalPages();
	}, [currentPage]);

	function updateFieldFactory(title: any, name: any) {
		return (
			<div className="w-full h-10">
				<label className="block text-gray-900 text-sm font-bold mb-2">
					*{name}
				</label>
				<Input
					style={{ background: '#e5e7eb' }}
					disabled
					required
					id={title}
					name={title}
					value={experimento[title]}
				/>
			</div>
		)
	}

	return (
		<>
			<Head><title>Dados do experimento</title></Head>

			<Content contentHeader={tabsDropDowns} moduloActive={'listas'}>
				<form
					className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
					onSubmit={formik.handleSubmit}
				>
					<div className="w-full flex justify-between items-start">
						<h1 className="text-2xl">Dados do experimento</h1>
					</div>

					<div className="w-full
            flex 
            justify-around
            gap-6
            mt-4
            mb-4
          ">
						{updateFieldFactory('protocolo_name', 'Nome do protocolo')}

						{updateFieldFactory('experimento_name', 'Nome do experimento')}

						{updateFieldFactory('rotulo', 'Rótulo')}

						{updateFieldFactory('plantadeira', 'Plantadeiras')}

					</div>
					<div className="w-full
                            flex 
                            justify-around
                            gap-6
                            mt-6
                            mb-4
                        ">

						{updateFieldFactory('foco', 'Foco')}

						{updateFieldFactory('ensaio', 'Ensaio')}

						{updateFieldFactory('cod_tec', 'Cód. Tec')}

						{updateFieldFactory('epoca', 'Época')}

						{updateFieldFactory('pjr', 'PJR')}

					</div>
					<div className="rounded border-inherit mt-16 mb-6 text-xl">
						<hr></hr>
						<h1 className="text-2xl mt-4">Dados do local</h1>
					</div>
					<div className="w-full
                            flex 
                            justify-around
                            gap-6
                            mb-4
                        ">

						{updateFieldFactory('unidade_cultura_name', 'Nome un. cultura')}

					</div>

					<div className="
            h-10 w-full
            flex
            gap-3
            justify-center
            mt-10
          ">
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
					</div>
				</form>
				<main className="h-4/6 w-full
          flex flex-col
          items-start
          gap-8
        ">

					<div style={{ marginTop: '1%' }} className="w-full h-auto overflow-y-scroll">
						<MaterialTable
							style={{ background: '#f9fafb' }}
							columns={columns}
							data={materiais}
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
																									defaultChecked={camposGerenciados.includes(genarate.value as string)}
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
												<Button title="Exportar planilha de materiais" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel() }} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
	const PreferencesControllers = new UserPreferenceController();
	const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 5;

	const token = context.req.cookies.token;
	const pageBeforeEdit = context.req.cookies.pageBeforeEdit ? context.req.cookies.pageBeforeEdit : 0;

	const requestOptions: RequestInit | undefined = {
		method: 'GET',
		credentials: 'include',
		headers: { Authorization: `Bearer ${token}` }
	};

	const id_experimento = Number(context.query.id);

	const { publicRuntimeConfig } = getConfig();
	const baseUrlMateriais = `${publicRuntimeConfig.apiUrl}/materiais`;

	const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
	const filterAplication = `filterStatus=1&$id_experimento=${id_experimento}`;

	const urlParameters: any = new URL(baseUrlMateriais);
	urlParameters.search = new URLSearchParams(param).toString();

	const parcelas = await fetch(`${baseUrlMateriais}?id_experimento=${id_experimento}`, requestOptions);

	const { response: allItens, total: totalItems } = await parcelas.json();

	const baseUrlShow = `${publicRuntimeConfig.apiUrl}/experimento`;
	const experimentos = await fetch(`${baseUrlShow}/` + id_experimento, requestOptions);
	const experimento = await experimentos.json();

	return {
		props: {
			allItens,
			totalItems,
			itensPerPage,
			filterAplication,
			id_experimento,
			experimento,
			pageBeforeEdit
		}
	}
}