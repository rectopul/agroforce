/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from 'react-icons/ai';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { IoMdArrowBack } from 'react-icons/io';
import { RiFileExcel2Line, RiOrganizationChart } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import MaterialTable from 'material-table';
import { FaSortAmountUpAlt } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import {
  userPreferencesService, assayListService, genotypeTreatmentService,
} from '../../../services';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import * as ITabs from '../../../shared/utils/dropdown';
import { IGenerateProps } from '../../../interfaces/shared/generate-props.interface';
import { IGenotypeTreatmentGrid, IAssayList } from '../../../interfaces/listas/ensaio/assay-list.interface';
import {
  AccordionFilter,
  Button, CheckBox, Content,
  Input,
} from '../../../components';

type IAssayListUpdate = Omit<IAssayList, 'id_safra' | 'period' | 'protocol_name'>;

export default function AtualizarTipoEnsaio({
  allGenotypeTreatment,
  assayList,
  totalItens,
  idAssayList,
  idSafra,
  itensPerPage,
  filterApplication,
}: IGenotypeTreatmentGrid) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.genotypeTreatment || {
    id: 0, table_preferences: 'id,fase,cod_tec,treatments_number,genotipoName,genotipoGmr,genotipoBgm,status,nca,cod_lote,comments',
  };
  const itemsTotal = totalItens;
  const filter = filterApplication;
  //  const [table, setTable] = useState<string>('genotipo');
  const [genotypeTreatments, setGenotypeTreatments] = useState<any>(() => allGenotypeTreatment);
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Fase', value: 'fase' },
    { name: 'CamposGerenciados[]', title: 'Cód. tec. genótipo', value: 'cod_tec' },
    { name: 'CamposGerenciados[]', title: 'NT', value: 'treatments_number' },
    { name: 'CamposGerenciados[]', title: 'Nome do genótipo', value: 'genotipoName' },
    { name: 'CamposGerenciados[]', title: 'GMR_Genótipo', value: 'genotipoGmr' },
    { name: 'CamposGerenciados[]', title: 'BGM_Genótipo', value: 'genotipoBgm' },
    { name: 'CamposGerenciados[]', title: 'T', value: 'status' },
    { name: 'CamposGerenciados[]', title: 'NCA', value: 'nca' },
    { name: 'CamposGerenciados[]', title: 'Cód. lote', value: 'cod_lote' },
    { name: 'CamposGerenciados[]', title: 'OBS', value: 'comments' },
  ]);
  const [colorStar, setColorStar] = useState<string>('');

  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const router = useRouter();
  const formik = useFormik<IAssayListUpdate>({
    initialValues: {
      id: assayList.id,
      foco: assayList.foco.name,
      type_assay: assayList.type_assay.name,
      tecnologia: assayList.tecnologia.name,
      gli: assayList.gli,
      bgm: assayList.bgm,
      status: assayList.status,
      project: assayList.project,
      comments: assayList.comments,
    },
    onSubmit: async (values) => {
      await assayListService.update({
        id: values.id,
        project: values.project,
        comments: values.comments,
      }).then(({ status, message }) => {
        if (status === 200) {
          Swal.fire('Lista de Ensaio atualizado com sucesso!');
          router.push('/listas/ensaio');
        } else {
          Swal.fire(message);
        }
      });
    },
  });

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
        parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
      } else {
        parametersFilter = filter;
      }
    } else if (typeOrder !== '') {
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}&id_safra=${idSafra}`;
    } else {
      parametersFilter = filter;
    }

    await genotypeTreatmentService.getAll(`${parametersFilter}&skip=0&take=${take}`).then(({ status, response }) => {
      if (status === 200) {
        setGenotypeTreatments(response);
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

  function headerTableFactory(name: any, title: string) {
    return {
      title: (
        <div className="flex items-center">
          <button
            type="button"
            className="font-medium text-gray-900"
            onClick={() => handleOrder(title, orderList)}
          >
            {name}
          </button>
        </div>
      ),
      field: title,
      sorting: false,
    };
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
            <div className="h-10 flex">
              <div>
                <button
                  type="button"
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('')}
                >
                  <AiTwotoneStar size={25} color="#eba417" />
                </button>
              </div>
            </div>
          )
          : (
            <div className="h-10 flex">
              <div>
                <button
                  type="button"
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('#eba417')}
                >
                  <AiTwotoneStar size={25} />
                </button>
              </div>
            </div>
          )
      ),
    };
  }

  function columnsOrder(columnCampos: string) {
    const columnOrder: string[] = columnCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnOrder).forEach((item, index) => {
      if (columnOrder[index] === 'id') {
        tableFields.push(idHeaderFactory());
      }
      if (columnOrder[index] === 'fase') {
        tableFields.push(headerTableFactory('Fase', 'genotipo.lote[0].fase'));
      }
      if (columnOrder[index] === 'cod_tec') {
        tableFields.push(headerTableFactory('Cód. tec. genótipo', 'genotipo.tecnologia.cod_tec'));
      }
      if (columnOrder[index] === 'treatments_number') {
        tableFields.push(headerTableFactory('NT', 'treatments_number'));
      }
      if (columnOrder[index] === 'genotipoName') {
        tableFields.push(headerTableFactory('Nome do genotipo', 'genotipo.name_genotipo'));
      }
      if (columnOrder[index] === 'genotipoGmr') {
        tableFields.push(headerTableFactory('GMR_Genótipo', 'genotipo.gmr'));
      }
      if (columnOrder[index] === 'genotipoBgm') {
        tableFields.push(headerTableFactory('BGM_Genótipo', 'genotipo.bgm'));
      }
      if (columnOrder[index] === 'status') {
        tableFields.push(headerTableFactory('T', 'status'));
      }
      if (columnOrder[index] === 'nca') {
        tableFields.push(headerTableFactory('NCA', 'nca'));
      }
      if (columnOrder[index] === 'cod_lote') {
        tableFields.push(headerTableFactory('Cód. lote', 'genotipo.lote[0].cod_lote'));
      }
      if (columnOrder[index] === 'comments') {
        tableFields.push(headerTableFactory('OBS', 'comments'));
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  async function getValuesColumns() {
    const els: any = document.querySelectorAll("input[type='checkbox'");
    let selecionados = '';
    for (let i = 0; i < els.length; i += 1) {
      if (els[i].checked) {
        selecionados += `${els[i].value},`;
      }
    }
    const totalString = selecionados.length;
    const campos = selecionados.substr(0, totalString - 1);
    if (preferences.id === 0) {
      await userPreferencesService.create({
        table_preferences: campos,
        userId: userLogado.id,
        module_id: 27,
      }).then((response) => {
        userLogado.preferences.genotypeTreatment = {
          id: response.response.id,
          userId: preferences.userId,
          table_preferences: campos,
        };
        preferences.id = response.response.id;
      });
      localStorage.setItem(
        'user',
        JSON.stringify(userLogado),
      );
    } else {
      userLogado.preferences.genotypeTreatment = {
        id: preferences.id,
        userId: preferences.userId,
        table_preferences: campos,
      };
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
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  const downloadExcel = async (): Promise<void> => {
    if (!filterApplication.includes('paramSelect')) {
      filterApplication += `&paramSelect=${camposGerenciados}&id_assay_list=${idAssayList}`;
    }
    await genotypeTreatmentService.getAll(filterApplication).then(({ status, response }) => {
      if (status === 200) {
        const workSheet = XLSX.utils.json_to_sheet(response);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'genotypeTreatments');

        // Buffer
        XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'buffer',
        });
        // Binary
        XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'binary',
        });
        // Download
        XLSX.writeFile(workBook, 'Tratamentos-genótipos.xlsx');
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
    let parametersFilter = `skip=${skip}&take=${take}`;

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await genotypeTreatmentService.getAll(parametersFilter).then(({ status, response }) => {
      if (status === 200) {
        setGenotypeTreatments(response);
      }
    });
  }

  function updateFieldFactory(name: string, title: string) {
    return (
      <div className="w-full h-10">
        <label className="block text-gray-900 text-sm font-bold mb-2">
          {name}
        </label>
        <Input
          style={{ background: '#e5e7eb' }}
          disabled
          required
          id={title}
          name={title}
          value={formik.values[title]}
        />
      </div>
    );
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Atualizar Lista de Ensaio</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-2xl">Atualizar Lista de Ensaio</h1>
          </div>

          <div className="w-full
            flex
            justify-around
            gap-6
            mt-4
            mb-4
          "
          >
            <div className="w-full flex justify-between items-start gap-5 mt-10">

              {updateFieldFactory('Foco', 'foco')}

              {updateFieldFactory('Ensaio', 'type_assay')}

              {updateFieldFactory('Nome Tecnologia', 'tecnologia')}

              {updateFieldFactory('GLI', 'gli')}

              {updateFieldFactory('BGM', 'bgm')}

              {updateFieldFactory('Status do ensaio', 'status')}

            </div>

          </div>

          <div className="w-full
            flex
            justify-around
            gap-6
            mt-4
            mb-4
          "
          >
            <div className="w-full flex justify-between items-start gap-5 mt-10">

              <div className="w-full h-10">
                <label className="block text-gray-900 text-sm font-bold mb-2">
                  Projeto
                </label>
                <Input
                  id="project"
                  name="project"
                  onChange={formik.handleChange}
                  value={formik.values.project}
                />
              </div>
            </div>

            <div className="w-full flex justify-between items-start gap-5 mt-10">
              <div className="w-full h-10">
                <label className="block text-gray-900 text-sm font-bold mb-2">
                  Observações
                </label>
                <Input
                  id="comments"
                  name="comments"
                  onChange={formik.handleChange}
                  value={formik.values.comments}
                />
              </div>
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
                value="Atualizar"
                bgColor="bg-blue-600"
                textColor="white"
                icon={<RiOrganizationChart size={18} />}
                onClick={() => { }}
              />
            </div>
          </div>
        </form>
        <main className="h-4/6 w-full
          flex flex-col
          items-start
          gap-8
        "
        >

          <div style={{ marginTop: '1%' }} className="w-full h-auto overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={genotypeTreatments}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                search: false,
                filtering: false,
                pageSize: itensPerPage,
              }}
              components={{
                Toolbar: () => (
                  <div
                    className="w-full max-h-96
                    flex
                    items-center
                    justify-between
                    gap-4
                    bg-gray-50
                    py-2
                    px-5
                    border-solid border-b
                    border-gray-200
                  "
                  >
                    <div className="flex
                    items-center"
                    >
                      <div className="h-12">
                        <Button
                          title="Genótipo"
                          value="Genótipo"
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => { setTable('genotipo'); }}
                          icon={<FaSortAmountUpAlt size={20} />}
                        />
                      </div>

                      <div className="h-12">
                        <Button
                          title="Experimentos"
                          value="Experimentos"
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => { setTable('experimentos'); }}
                          icon={<FaSortAmountUpAlt size={20} />}
                        />
                      </div>
                    </div>

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2">
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-72">
                          <AccordionFilter title="Gerenciar Campos" grid={statusAccordion}>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                              <Droppable droppableId="characters">
                                {
                                  (provided) => (
                                    <ul
                                      className="w-full h-full characters"
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                    >
                                      <div className="h-8 mb-3">
                                        <Button
                                          value="Atualizar"
                                          bgColor="bg-blue-600"
                                          textColor="white"
                                          onClick={getValuesColumns}
                                          icon={<IoReloadSharp size={20} />}
                                        />
                                      </div>
                                      {
                                        generatesProps.map((generate, index) => (
                                          <Draggable
                                            key={index}
                                            draggableId={String(generate.title)}
                                            index={index}
                                          >
                                            {(dragProps) => (
                                              <li
                                                ref={dragProps.innerRef}
                                                {
                                                ...dragProps.draggableProps}
                                                {
                                                ...dragProps.dragHandleProps}
                                              >
                                                <CheckBox
                                                  name={generate.name}
                                                  title={generate.title?.toString()}
                                                  value={generate.value}
                                                  defaultChecked={
                                                    camposGerenciados.includes(
                                                      generate.value as string,
                                                    )
                                                  }
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

                      <div className="h-12 flex items-center justify-center w-full">
                        <Button title="Exportar planilha de Tratamentos do genótipo" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
                      </div>
                    </div>
                  </div>
                ),
                Pagination: (props) => (
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
                        <Button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          value={`${currentPage + 1}`}
                          bgColor="bg-blue-600"
                          textColor="white"
                          disabled
                        />
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
                ) as any,
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

  const { token } = context.req.cookies;
  const idSafra = context.req.cookies.safraId;

  const { publicRuntimeConfig } = getConfig();
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const idAssayList = Number(context.query.id);
  const filterApplication = `id_safra=${idSafra}&id_assay_list=${idAssayList}`;

  const baseUrlGenotypeTreatment = `${publicRuntimeConfig.apiUrl}/genotype-treatment`;
  const genotypeTreatment = await fetch(`${baseUrlGenotypeTreatment}?${filterApplication}`, requestOptions);
  const { response: allGenotypeTreatment, total: totalItens }: any = await genotypeTreatment.json();

  const baseUrlAssayList = `${publicRuntimeConfig.apiUrl}/assay-list`;
  const assayLists = await fetch(`${baseUrlAssayList}/${context.query.id}`, requestOptions);
  const assayList = await assayLists.json();

  const allExperiments = [
    {
      id: 2,
      id_safra: 2,
      genotipo: {
        name_genotipo: '2',
        gmr: '2',
        bgm: '2',
        lote: [{ cod_lote: '2', fase: '2' }],
        tecnologia: { cod_tec: '02' },
      },
      treatments_number: 2,
      status: 2,
      nca: '2',
      comments: '2',
    },
  ];

  return {
    props: {
      allGenotypeTreatment,
      totalItens,
      itensPerPage,
      filterApplication,
      idAssayList,
      idSafra,
      assayList,
      allExperiments,
    },
  };
};
