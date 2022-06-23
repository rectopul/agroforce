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
    culture_unity_name: String | any;
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
    const preferences = userLogado.preferences.materiais || { id: 0, table_preferences: "status,tratamentos,prox_nivel,name_main,name_genotipo,id_culture,cod_lote,ncc,acao" };
    const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

    const [materiais, setMateriais] = useState<any>(() => allItens);
    const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
    const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
    const [orderName, setOrderName] = useState<number>(0);
    const [arrowName, setArrowName] = useState<ReactNode>('');
    const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
    const [filter, setFilter] = useState<any>(filterAplication);
    const [colorStar, setColorStar] = useState<string>('');
    const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
        { name: "CamposGerenciados[]", title: "Status", value: "status" },
        { name: "CamposGerenciados[]", title: "N tratamento", value: "tratamentos" },
        { name: "CamposGerenciados[]", title: "N linhas de próx. nível", value: "prox_nivel" },
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
            culture_unity_name: experimento.culture_unity_name,
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
                culture_unity_name: formik.values.culture_unity_name,
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


    function columnsOrder(camposGerenciados: string) {
        let ObjetCampos: string[] = camposGerenciados.split(',');
        let arrOb: any = [];

        Object.keys(ObjetCampos).forEach((item, index) => {
            if (ObjetCampos[index] === 'status') {
                arrOb.push({
                    title: "Status",
                    field: "status",
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'tratamentos') {
                arrOb.push({
                    title: "N tratamento",
                    field: "tratamentos",
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'prox_nivel') {
                arrOb.push({
                    title: "N linhas de próx. nível",
                    field: "prox_nivel",
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'name_main') {
                arrOb.push({
                    title: "Nome principal",
                    field: "name_main",
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'name_genotipo') {
                arrOb.push({
                    title: "Nome genótipo",
                    field: "name_genotipo",
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'id_culture') {
                arrOb.push({
                    title: "Cultura",
                    field: "id_culture",
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'cod_lote') {
                arrOb.push({
                    title: "Cód. Lote",
                    field: "cod_lote",
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'ncc') {
                arrOb.push({
                    title: "NCC",
                    field: "ncc",
                    sorting: false
                });
            }
        });
        return arrOb;
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

    async function handleOrderName(column: string, order: string | any): Promise<void> {
        let typeOrder: any;
        let parametersFilter: any;
        if (order === 1) {
            typeOrder = 'asc';
        } else if (order === 2) {
            typeOrder = 'desc';
        } else {
            typeOrder = '';
        }

        if (filter && typeof (filter) !== undefined) {
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

        await materiaisService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
            if (response.status === 200) {
                setOrderName(response.response)
            }
        });

        if (orderName === 2) {
            setOrderName(0);
            setArrowName(<AiOutlineArrowDown />);
        } else {
            setOrderName(orderName + 1);
            if (orderName === 1) {
                setArrowName(<AiOutlineArrowUp />);
            } else {
                setArrowName('');
            }
        }
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
        let parametersFilter = "skip=" + skip + "&take=" + take + "&id_experimento=" + id_experimento;

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

    return (
        <>
            <Head><title>Dados do experimento</title></Head>

            <Content contentHeader={tabsDropDowns}>
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
                        <div className="w-full">
                            <label className="block text-gray-900 text-sm font-bold mb-2">
                                Nome do protocolo
                            </label>
                            <Input
                                style={{ background: '#e5e7eb' }}
                                id="protocolo_name"
                                name="protocolo_name"
                                disabled
                                onChange={formik.handleChange}
                                value={formik.values.protocolo_name}
                            />
                        </div>

                        <div className="w-full h-10">
                            <label className="block text-gray-900 text-sm font-bold mb-2">
                                Nome do experimento
                            </label>
                            <Input
                                style={{ background: '#e5e7eb' }}
                                id="experimento_name"
                                name="experimento_name"
                                disabled
                                onChange={formik.handleChange}
                                value={formik.values.experimento_name}
                            />
                        </div>
                        <div className="w-full h-10">
                            <label className="block text-gray-900 text-sm font-bold mb-2">
                                Rótulo
                            </label>
                            <Input
                                style={{ background: '#e5e7eb' }}
                                id="rotulo"
                                name="rotulo"
                                disabled
                                onChange={formik.handleChange}
                                value={formik.values.rotulo}
                            />
                        </div>
                    </div>

                    <div className="w-full
                            flex 
                            justify-around
                            gap-6
                            mt-6
                            mb-4
                        ">
                        <div className="w-full h-10">
                            <label className="block text-gray-900 text-sm font-bold mb-2">
                                Foco
                            </label>
                            <Input
                                style={{ background: '#e5e7eb' }}
                                id="foco"
                                name="foco"
                                disabled
                                onChange={formik.handleChange}
                                value={formik.values.foco}
                            />
                        </div>
                        <div className="w-full h-10">
                            <label className="block text-gray-900 text-sm font-bold mb-2">
                                Ensaio
                            </label>
                            <Input
                                style={{ background: '#e5e7eb' }}
                                id="ensaio"
                                name="ensaio"
                                disabled
                                onChange={formik.handleChange}
                                value={formik.values.ensaio}
                            />
                        </div>
                        <div className="w-full h-10">
                            <label className="block text-gray-900 text-sm font-bold mb-2">
                                Cód. Tec
                            </label>
                            <Input
                                style={{ background: '#e5e7eb' }}
                                id="cod_tec"
                                name="cod_tec"
                                disabled
                                onChange={formik.handleChange}
                                value={formik.values.cod_tec}
                            />
                        </div>
                        <div className="w-full h-10">
                            <label className="block text-gray-900 text-sm font-bold mb-2">
                                Epoca
                            </label>
                            <Input
                                style={{ background: '#e5e7eb' }}
                                id="epoca"
                                name="epoca"
                                disabled
                                onChange={formik.handleChange}
                                value={formik.values.epoca}
                            />
                        </div>
                        <div className="w-full h-10">
                            <label className="block text-gray-900 text-sm font-bold mb-2">
                                PJR
                            </label>
                            <Input
                                style={{ background: '#e5e7eb' }}
                                id="pjr"
                                name="pjr"
                                disabled
                                onChange={formik.handleChange}
                                value={formik.values.pjr}
                            />
                        </div>
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
                        <div className="w-full">
                            <label className="block text-gray-900 text-sm font-bold mb-2">
                                Nome un. cultura
                            </label>
                            <Input
                                style={{ background: '#e5e7eb' }}
                                id="unidade_cultura_name"
                                name="unidade_cultura_name"
                                disabled
                                onChange={formik.handleChange}
                                value={formik.values.unidade_cultura_name}
                            />
                        </div>
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
    const { publicRuntimeConfig } = getConfig();
    const baseUrlShow = `${publicRuntimeConfig.apiUrl}/experimento`;
    const token = context.req.cookies.token;
    const PreferencesControllers = new UserPreferenceController();
    const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 5;

    const pageBeforeEdit = context.req.cookies.pageBeforeEdit ? context.req.cookies.pageBeforeEdit : 0;

    const requestOptions: RequestInit | undefined = {
        method: 'GET',
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` }
    };

    const baseUrlMateriais = `${publicRuntimeConfig.apiUrl}/materiais`;

    let param = `skip=0&take=${itensPerPage}&filterStatus=1`;
    let filterAplication = "filterStatus=1";

    const urlParameters: any = new URL(baseUrlMateriais);
    urlParameters.search = new URLSearchParams(param).toString();

    const id_experimento = Number(context.query.id);
    const api = await fetch(`${baseUrlMateriais}?id_experimento=${id_experimento}`, requestOptions);

    let allItens: any = await api.json();
    const totalItems = allItens.total;
    allItens = allItens.response;

    const apiExperimento = await fetch(`${baseUrlShow}/` + id_experimento, requestOptions);

    const experimento = await apiExperimento.json();

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