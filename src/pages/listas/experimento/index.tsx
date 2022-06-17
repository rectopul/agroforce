import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { ReactNode, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineFileSearch, AiTwotoneStar } from 'react-icons/ai';
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiPlantLine, RiSettingsFill } from 'react-icons/ri';
import { AccordionFilter, Button, CheckBox, Content, Input, Select } from 'src/components';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { userPreferencesService } from 'src/services';
import { experimentoService } from 'src/services/experimento.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import ITabs from '../../../shared/utils/dropdown';

interface IFilter {
    filterStatus: object | any;
    filterProtocolName: string | any;
    filterExperimentoName: string | any;
    filterRotulo: string | any;
    orderBy: object | any;
    typeOrder: object | any;
}

export interface IExperimento {
    id: number;
    protocol_name: string;
    experimento_name: string;
    year: number;
    rotulo: string;
    foco: string;
    ensaio: string;
    cod_tec: number;
    epoca: number;
    materiais: number;
    status?: number;
}

interface IGenarateProps {
    name: string | undefined;
    title: string | number | readonly string[] | undefined;
    value: string | number | readonly string[] | undefined;
}

interface IData {
    allExperimentos: IExperimento[];
    totalItems: number;
    itensPerPage: number;
    filterAplication: object | any;
    cultureId: number;
    pageBeforeEdit: string | any;
    filterBeforeEdit: string | any
}

export default function Listagem({ allExperimentos, totalItems, itensPerPage, filterAplication, cultureId, pageBeforeEdit, filterBeforeEdit }: IData) {
    const { TabsDropDowns } = ITabs;

    const tabsDropDowns = TabsDropDowns();

    tabsDropDowns.map((tab) => (
        tab.titleTab === 'TMG'
            ? tab.statusTab = true
            : tab.statusTab = false
    ));

    const userLogado = JSON.parse(localStorage.getItem('user') as string);
    const preferences = userLogado.preferences.experimento || { id: 0, table_preferences: 'id,protocol_name,experimento_name, year,rotulo,id_foco, id_ensaio, id_tecnologia, epoca' };
    const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
    const router = useRouter();
    const [experimentos, setExperimento] = useState<IExperimento[]>(() => allExperimentos);
    const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
    const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit)
    const [itemsTotal, setTotalItems] = useState<number | any>(totalItems || 0);
    const [orderCruza, setOrderCruza] = useState<number>(1);
    const [orderName, setOrderName] = useState<number>(1);
    const [arrowCruza, setArrowCruza] = useState<ReactNode>('');
    const [arrowName, setArrowName] = useState<ReactNode>('');
    const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
    const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
        { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
        { name: 'CamposGerenciados[]', title: 'Nome protocolo', value: 'protocolo_name' },
        { name: 'CamposGerenciados[]', title: 'Nome experimento', value: 'experimento_name' },
        { name: 'CamposGerenciados[]', title: 'Ano', value: 'year' },
        { name: 'CamposGerenciados[]', title: 'Rótulo', value: 'rotulo' },
        { name: 'CamposGerenciados[]', title: 'Foco', value: 'foco' },
        { name: 'CamposGerenciados[]', title: 'Ensaio', value: 'ensaio' },
        { name: 'CamposGerenciados[]', title: 'Cód. Tec.', value: 'tecnologia' },
        { name: 'CamposGerenciados[]', title: 'EP', value: 'epoca' },
        { name: 'CamposGerenciados[]', title: 'N de materiais', value: 'materiais' },
        { name: 'CamposGerenciados[]', title: 'Status', value: 'status' }
    ]);

    const [filter, setFilter] = useState<any>(filterAplication);
    const [colorStar, setColorStar] = useState<string>('');

    const filtersStatusItem = [
        { id: 2, name: 'Todos' },
        { id: 1, name: 'Ativos' },
        { id: 0, name: 'Inativos' }
    ];

    const filterStatus = filterBeforeEdit.split('')

    const take: number = itensPerPage;
    const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
    const pages = Math.ceil(total / take);


    const columns = columnsOrder(camposGerenciados);

    const formik = useFormik<IFilter>({
        initialValues: {
            filterStatus: '',
            filterProtocolName: '',
            filterExperimentoName: '',
            filterRotulo: '',
            orderBy: '',
            typeOrder: ''
        },
        onSubmit: async ({ filterStatus, filterProtocolName, filterExperimentoName, filterRotulo }) => {
            const parametersFilter = `filterStatus=${filterStatus ? filterStatus : 1}&filterProtocolName=${filterProtocolName}&id_culture=${cultureId}&filterExperimentoName=${filterExperimentoName}&filterRotulo=${filterRotulo}`;
            setFiltersParams(parametersFilter)
            setCookies("filterBeforeEdit", filtersParams)
            await experimentoService.getAll(parametersFilter + `&skip=0&take=${itensPerPage}`).then((response) => {
                setFilter(parametersFilter);
                setExperimento(response.response);
                setTotalItems(response.total)
                setCurrentPage(0)
            });
        }
    });

    async function handleStatus(idExperimento: number, data: IExperimento): Promise<void> {
        if (data.status === 0) {
            data.status = 1;
        } else {
            data.status = 0;
        }

        const index = experimentos.findIndex((experimento) => experimento.id === idExperimento);

        if (index === -1) {
            return;
        }

        setExperimento((oldExperimento) => {
            const copy = [...oldExperimento];
            copy[index].status = data.status;
            return copy;
        });

        const {
            id,
            status
        } = experimentos[index];

        await experimentoService.update({
            id,
            status
        });
    }

    function columnsOrder(camposGerenciados: any): any {
        const ObjetCampos: any = camposGerenciados.split(',');
        const arrOb: any = [];

        Object.keys(ObjetCampos).forEach((_, index) => {
            if (ObjetCampos[index] === 'id') {
                arrOb.push({
                    title: '',
                    field: 'id',
                    width: 0,
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
                });
            }
            if (ObjetCampos[index] === 'protocolo_name') {
                arrOb.push({
                    title: (
                        <div className='flex items-center'>
                            {arrowName}
                            <button className='font-medium text-gray-900' onClick={() => handleOrderName('protocolo_name', orderName)}>
                                Nome protocolo
                            </button>
                        </div>
                    ),
                    field: 'protocolo_name',
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'experimento_name') {
                arrOb.push({
                    title: 'Nome experimento',
                    field: 'experimento_name',
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'year') {
                arrOb.push({
                    title: 'Ano',
                    field: 'year',
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'rotulo') {
                arrOb.push({
                    title: 'Rótulo',
                    field: 'rotulo',
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'foco') {
                arrOb.push({
                    title: 'Foco',
                    field: 'foco.name',
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'ensaio') {
                arrOb.push({
                    title: 'Ensaio',
                    field: 'ensaio.name',
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'tecnologia') {
                arrOb.push({
                    title: 'Cód tec',
                    field: 'tecnologia.cod_tec',
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'epoca') {
                arrOb.push({
                    title: 'EP',
                    field: 'epoca',
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'materiais') {
                arrOb.push({
                    title: 'N de materiais',
                    field: 'materiais',
                    sorting: false
                });
            }
            if (ObjetCampos[index] === 'status') {
                arrOb.push({
                    title: 'Status',
                    field: 'status',
                    sorting: false,
                    searchable: false,
                    filterPlaceholder: 'Filtrar por status',
                    render: (rowData: IExperimento) => (
                        <div className='h-10 flex'>
                            <div className="h-10">
                                <Button
                                    icon={<BiEdit size={16} />}
                                    bgColor="bg-blue-600"
                                    textColor="white"
                                    title={`Editar ${rowData.experimento_name}`}
                                    onClick={() => {
                                        setCookies('pageBeforeEdit', currentPage?.toString());
                                        setCookies("filterBeforeEdit", filtersParams)
                                        router.push(`/listas/experimento/atualizar?id=${rowData.id}`);
                                    }
                                    }
                                />
                            </div>
                            {rowData.status === 1
                                ? (
                                    <div className="h-10">
                                        <Button
                                            icon={<FaRegThumbsUp size={16} />}
                                            onClick={async () => await handleStatus(
                                                rowData.id, {
                                                status: rowData.status,
                                                ...rowData
                                            }
                                            )}
                                            title={'Ativo'}
                                            bgColor="bg-green-600"
                                            textColor="white"
                                        />
                                    </div>
                                )
                                : (
                                    <div className="h-10">
                                        <Button
                                            icon={<FaRegThumbsDown size={16} />}
                                            onClick={async () => await handleStatus(
                                                rowData.id, {
                                                status: rowData.status,
                                                ...rowData
                                            }
                                            )}
                                            title={'Inativo'}
                                            bgColor="bg-red-800"
                                            textColor="white"
                                        />
                                    </div>
                                )}
                        </div>
                    )
                });
            }
        });
        return arrOb;
    }

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

        await experimentoService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
            if (response.status === 200) {
                setExperimento(response.response)
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

    async function handleOrderCruza(column: string, order: string | any): Promise<void> {
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

        await experimentoService.getAll(parametersFilter + `&skip=0&take=${take}`).then((response) => {
            if (response.status === 200) {
                setExperimento(response.response)
            }
        });

        if (orderCruza === 2) {
            setOrderCruza(0);
            setArrowCruza(<AiOutlineArrowDown />);
        } else {
            setOrderCruza(orderCruza + 1);
            if (orderCruza === 1) {
                setArrowCruza(<AiOutlineArrowUp />);
            } else {
                setArrowCruza('');
            }
        }
    };

    async function getValuesComluns(): Promise<void> {
        const els: any = document.querySelectorAll("input[type='checkbox']");
        let selecionados = '';
        for (let i = 0; i < els.length; i++) {
            if (els[i].checked) {
                selecionados += els[i].value + ',';
            }
        }
        const totalString = selecionados.length;
        const campos = selecionados.substr(0, totalString - 1);
        if (preferences.id === 0) {
            await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 22 }).then((response) => {
                userLogado.preferences.experimento = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
                preferences.id = response.response.id;
            });
            localStorage.setItem('user', JSON.stringify(userLogado));
        } else {
            userLogado.preferences.experimento = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
            await userPreferencesService.update({ table_preferences: campos, id: preferences.id });
            localStorage.setItem('user', JSON.stringify(userLogado));
        }
        setStatusAccordion(false);
        setCamposGerenciados(campos);
    }


    function handleOnDragEnd(result: DropResult): void {
        setStatusAccordion(true);
        if (!result) return;

        const items = Array.from(genaratesProps);
        const [reorderedItem] = items.splice(result.source.index, 1);
        const index = Number(result.destination?.index);
        items.splice(index, 0, reorderedItem);

        setGenaratesProps(items);
    }

    const downloadExcel = async (): Promise<void> => {
        if (!filterAplication.includes("paramSelect")) {
            filterAplication += `&paramSelect=${camposGerenciados}`;
        }

        await experimentoService.getAll(filterAplication).then((response) => {
            if (response.status === 200) {
                const newData = experimentos.map((row) => {
                    if (row.status === 0) {
                        row.status = 'Inativo' as any;
                    } else {
                        row.status = 'Ativo' as any;
                    }

                    return row;
                });

                // newData.map((item: any) => {
                //     return item.tecnologia = item.tecnologia?.tecnologia
                // })

                const workSheet = XLSX.utils.json_to_sheet(newData);
                const workBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workBook, workSheet, 'experimentos');

                // Buffer
                const buf = XLSX.write(workBook, {
                    bookType: 'xlsx', // xlsx
                    type: 'buffer'
                });
                // Binary
                XLSX.write(workBook, {
                    bookType: 'xlsx', // xlsx
                    type: 'binary'
                });
                // Download
                XLSX.writeFile(workBook, 'Experimentos.xlsx');
            } else {
                Swal.fire(response);
            }
        });
    };

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
            parametersFilter = parametersFilter + '&' + filter + '&' + cultureId;
        }
        await experimentoService.getAll(parametersFilter).then((response) => {
            if (response.status === 200) {
                setExperimento(response.response);
            }
        });
    }

    useEffect(() => {
        handlePagination();
        handleTotalPages();
    }, [currentPage]);

    return (
        <>
            <Head><title>Listagem de experimentos</title></Head>

            <Content contentHeader={tabsDropDowns}>
                <main className="h-full w-full
                        flex flex-col
                        items-start
                        gap-8
                        ">
                    <AccordionFilter title="Filtrar experimentos">
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
                                            Nome Protocolo
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Protocolo"
                                            max="40"
                                            id="filterProtocolName"
                                            name="filterProtocolName"
                                            onChange={formik.handleChange}
                                        />
                                    </div>

                                    <div className="h-10 w-1/2 ml-4">
                                        <label className="block text-gray-900 text-sm font-bold mb-2">
                                            Nome Experimento
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Experimento"
                                            max="40"
                                            id="filterExperimentoName"
                                            name="filterExperimentoName"
                                            onChange={formik.handleChange}
                                        />
                                    </div>

                                    <div className="h-10 w-1/2 ml-4">
                                        <label className="block text-gray-900 text-sm font-bold mb-2">
                                            Rótulo
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Rótulo"
                                            max="40"
                                            id="filterRotulo"
                                            name="filterRotulo"
                                            onChange={formik.handleChange}
                                        />
                                    </div>
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
                            data={experimentos}
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

                                        <div className='h-12'>
                                            <Button
                                                title="Importar Planilha"
                                                value="Importar Planilha"
                                                bgColor="bg-blue-600"
                                                textColor="white"
                                                onClick={() => { }}
                                                href="experimento/importar-planilha"
                                                icon={<RiFileExcel2Line size={20} />}
                                            />
                                        </div>

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
                                                                                                    defaultChecked={camposGerenciados.includes(String(genarate.value))}
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
                                                {/* <Button title="Importação de planilha" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => {router.push('portfolio/importacao')}} /> */}
                                                <Button title="Exportar planilha de experimentos" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { downloadExcel(); }} />
                                            </div>
                                            <div className='h-12 flex items-center justify-center w-full'>
                                                <Button icon={<RiSettingsFill size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => { }} href="experimento/importar-planilha/config-planilha" />
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

    const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
    const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : "filterStatus=1";

    const token = req.cookies.token;
    const cultureId = Number(req.cookies.cultureId);

    const { publicRuntimeConfig } = getConfig();
    const baseUrl = `${publicRuntimeConfig.apiUrl}/experimento`;

    const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${cultureId}`;
    const filterAplication = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit + '&id_culture=' + cultureId : 'filterStatus=1';

    removeCookies('filterBeforeEdit', { req, res });

    removeCookies('pageBeforeEdit', { req, res });
    const urlParameters: any = new URL(baseUrl);
    urlParameters.search = new URLSearchParams(param).toString();

    const requestOptions = {
        method: 'GET',
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` }
    } as RequestInit | undefined;

    const api = await fetch(`${baseUrl}?id_culture=${cultureId}`, requestOptions);
    const data = await api.json();

    const allExperimentos = data.response;
    const totalItems = data.total;

    return {
        props: {
            allExperimentos,
            totalItems,
            itensPerPage,
            filterAplication,
            cultureId,
            pageBeforeEdit,
            filterBeforeEdit
        }
    };
};
