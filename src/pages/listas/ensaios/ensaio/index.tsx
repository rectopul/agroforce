/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { BsTrashFill } from 'react-icons/bs';
import Swal from 'sweetalert2';
import foco from 'src/pages/api/foco';
import { IGenerateProps } from '../../../../interfaces/shared/generate-props.interface';
import { IAssayList, IAssayListGrid, IAssayListFilter } from '../../../../interfaces/listas/ensaio/assay-list.interface';
import { assayListService, userPreferencesService } from '../../../../services';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import {
  AccordionFilter, Button, CheckBox, Content, Input,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';

export default function TipoEnsaio({
  allAssay,
  itensPerPage,
  filterApplication,
  totalItems,
  idSafra,
  pageBeforeEdit,
  filterBeforeEdit,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns('listas');

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'ENSAIO'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.assayList || { id: 0, table_preferences: 'id,protocol_name,foco,type_assay,gli,tecnologia,treatmentsNumber,status,action' };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const [assayList, setAssayList] = useState<IAssayList[]>(() => allAssay);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [orderList, setOrder] = useState<number>(1);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // {
    //   name: 'CamposGerenciados[]', title: 'Favorito ', value: 'id', defaultChecked: () => camposGerenciados.includes('id'),
    // },
    {
      name: 'CamposGerenciados[]', title: 'Protocolo', value: 'protocol_name', defaultChecked: () => camposGerenciados.includes('protocol_name'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Foco', value: 'foco', defaultChecked: () => camposGerenciados.includes('foco'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Ensaio', value: 'type_assay', defaultChecked: () => camposGerenciados.includes('type_assay'),
    },
    {
      name: 'CamposGerenciados[]', title: 'GLI', value: 'gli', defaultChecked: () => camposGerenciados.includes('gli'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Tecnologia', value: 'tecnologia', defaultChecked: () => camposGerenciados.includes('tecnologia'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Nº de trat.', value: 'treatmentsNumber', defaultChecked: () => camposGerenciados.includes('treatmentsNumber'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Status do ensaio', value: 'status', defaultChecked: () => camposGerenciados.includes('status'),
    },
    {
      name: 'CamposGerenciados[]', title: 'Ação', value: 'action', defaultChecked: () => camposGerenciados.includes('action'),
    },
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [colorStar, setColorStar] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const router = useRouter();
  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const formik = useFormik<IAssayListFilter>({
    initialValues: {
      filterTratFrom: '',
      filterTratTo: '',
      filterFoco: '',
      filterProtocol: '',
      filterTypeAssay: '',
      filterGli: '',
      filterTechnology: '',
      filterCod: '',
      filterTreatmentNumber: '',
      filterStatusAssay: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterCod,
      filterTratFrom,
      filterTratTo,
      filterFoco,
      filterProtocol,
      filterTypeAssay,
      filterGli,
      filterTechnology,
      filterTreatmentNumber,
      filterStatusAssay,
    }) => {
      const parametersFilter = `&filterFoco=${filterFoco}&filterTypeAssay=${filterTypeAssay}&filterGli=${filterGli}&filterTechnology=${filterTechnology}&filterTreatmentNumber=${filterTreatmentNumber}&filterStatusAssay=${filterStatusAssay}&id_safra=${idSafra}&filterProtocol=${filterProtocol}&filterTratTo=${filterTratTo}&filterTratFrom=${filterTratFrom}&filterCod=${filterCod}`;
      setFiltersParams(parametersFilter);
      setCookies('filterBeforeEdit', filtersParams);
      await assayListService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then(({ response, total: allTotal }) => {
        setFilter(parametersFilter);
        setAssayList(response);
        setTotalItems(allTotal);
        setCurrentPage(0);
      });
    },
  });

  async function handleOrder(column: string, order: number): Promise<void> {
    let typeOrder: any;
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = 'asc';
    } else if (order === 2) {
      typeOrder = 'desc';
    } else {
      typeOrder = '';
    }
    setOrderBy(column);
    setOrderType(typeOrder);
    if (filter && typeof (filter) !== 'undefined') {
      if (typeOrder !== '') {
        parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
      } else {
        parametersFilter = filter;
      }
    } else if (typeOrder !== '') {
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}`;
    } else {
      parametersFilter = filter;
    }

    await assayListService.getAll(`${parametersFilter}&skip=0&take=${take}`).then(({ status, response }) => {
      if (status === 200) {
        setAssayList(response);
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

  function headerTableFactory(name: string, title: string) {
    return {
      title: (
        <div className="flex items-center">
          <button type="button" className="font-medium text-gray-900" onClick={() => handleOrder(title, orderList)}>
            {name}
          </button>
        </div>
      ),
      field: title,
      sorting: true,
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
            <div className="h-7 flex">
              <div>
                <button
                  type="button"
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('')}
                >
                  <AiTwotoneStar size={20} color="#eba417" />
                </button>
              </div>
            </div>
          )
          : (
            <div className="h-7 flex">
              <div>
                <button
                  type="button"
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('#eba417')}
                >
                  <AiTwotoneStar size={20} />
                </button>
              </div>
            </div>
          )
      ),
    };
  }

  async function deleteItem(id: number) {
    const { status, message } = await assayListService.deleted({ id, userId: userLogado.id });
    if (status === 200) {
      router.reload();
    } else {
      Swal.fire({
        html: message,
        width: '800',
      });
    }
  }

  function statusHeaderFactory() {
    return {
      title: 'Ações',
      field: 'action',
      sorting: false,
      searchable: false,
      render: (rowData: IAssayList) => (
        !rowData.experiment.length ? (
          <div className="h-7 flex">
            <div className="h-7">
              <Button
                icon={<BiEdit size={14} />}
                title={`Atualizar ${rowData.gli}`}
                onClick={() => {
                  setCookies('pageBeforeEdit', currentPage?.toString());
                  setCookies('filterBeforeEdit', filtersParams);
                  router.push(`/listas/ensaios/ensaio/atualizar?id=${rowData.id}`);
                }}
                bgColor="bg-blue-600"
                textColor="white"
              />
            </div>
            <div style={{ width: 5 }} />
            <div>
              <Button
                title={`Deletar ${rowData.gli}`}
                icon={<BsTrashFill size={14} />}
                onClick={() => deleteItem(rowData.id)}
                bgColor="bg-red-600"
                textColor="white"
              />
            </div>
          </div>
        ) : (
          <div className="h-7 flex">
            <div className="h-7">
              <Button
                icon={<BiEdit size={14} />}
                title={`Atualizar ${rowData.gli}`}
                onClick={() => {
                  setCookies('pageBeforeEdit', currentPage?.toString());
                  setCookies('filterBeforeEdit', filtersParams);
                  router.push(`/listas/ensaios/ensaio/atualizar?id=${rowData.id}`);
                }}
                bgColor="bg-blue-600"
                textColor="white"
              />
            </div>
            <div style={{ width: 5 }} />
            <div>
              <Button
                icon={<BsTrashFill size={14} />}
                title="Ensaio já associado a um experimento"
                disabled
                onClick={() => deleteItem(rowData.id)}
                bgColor="bg-gray-600"
                textColor="white"
              />
            </div>
          </div>
        )

      ),
    };
  }

  function tecnologiaHeaderFactory(name: string, title: string) {
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
      field: 'tecnologia',
      width: 0,
      sorting: true,
      render: (rowData: any) => (
        <div className="h-10 flex">
          <div>
            {`${rowData.tecnologia.cod_tec} ${rowData.tecnologia.name}`}
          </div>
        </div>
      ),
    };
  }

  function orderColumns(columnsOrder: string): Array<object> {
    const columnOrder: any = columnsOrder.split(',');
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((item) => {
      // if (columnOrder[item] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnOrder[item] === 'protocol_name') {
        tableFields.push(headerTableFactory('Protocolo', 'protocol_name'));
      }
      if (columnOrder[item] === 'foco') {
        tableFields.push(headerTableFactory('Foco', 'foco.name'));
      }
      if (columnOrder[item] === 'type_assay') {
        tableFields.push(headerTableFactory('Ensaio', 'type_assay.name'));
      }
      if (columnOrder[item] === 'gli') {
        tableFields.push(headerTableFactory('GLI', 'gli'));
      }
      if (columnOrder[item] === 'tecnologia') {
        tableFields.push(
          tecnologiaHeaderFactory('Tecnologia', 'tecnologia'),
        );
      }
      if (columnOrder[item] === 'treatmentsNumber') {
        tableFields.push(headerTableFactory('Nº de trat.', 'treatmentsNumber'));
      }
      if (columnOrder[item] === 'status') {
        tableFields.push(headerTableFactory('Status do ensaio', 'status'));
      }
      if (columnOrder[item] === 'action') {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  const columns = orderColumns(camposGerenciados);

  async function getValuesColumns(): Promise<void> {
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
        module_id: 26,
      }).then((response) => {
        userLogado.preferences.assayList = {
          id: response.response.id,
          userId: preferences.userId,
          table_preferences: campos,
        };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.assayList = {
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

  function handleOnDragEnd(result: DropResult) {
    setStatusAccordion(true);
    if (!result) return;

    const items = Array.from(generatesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  const downloadExcel = async (): Promise<void> => {
    await assayListService.getAll(filterApplication).then(({ status, response }) => {
      if (status === 200) {
        response.map((item: any) => {
          const newItem = item;

          newItem.SAFRA = newItem.safra?.safraName;
          newItem.PROTOCOLO = newItem?.protocol_name;
          newItem.FOCO = newItem.foco?.name;
          newItem.TIPO_DE_ENSAIO = newItem.type_assay?.name;
          newItem.TECNOLOGIA = newItem.tecnologia?.name;
          newItem.GLI = newItem?.gli;
          newItem.BGM = newItem?.bgm;
          newItem.STATUS = newItem?.status;
          newItem.PROJETO = newItem?.project;
          newItem.OBSERVAÇÕES = newItem?.comments;
          newItem.NÚMERO_DE_TRATAMENTOS = newItem?.countNT;

          delete newItem.safra;
          delete newItem.treatmentsNumber;
          delete newItem.project;
          delete newItem.status;
          delete newItem.bgm;
          delete newItem.gli;
          delete newItem.tecnologia;
          delete newItem.foco;
          delete newItem.protocol_name;
          delete newItem.countNT;
          delete newItem.period;
          delete newItem.comments;
          delete newItem.type_assay;
          delete newItem.id;
          delete newItem.id_safra;
          delete newItem.experiment;
          delete newItem.genotype_treatment;

          return newItem;
        });
        const workSheet = XLSX.utils.json_to_sheet(response);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'Tipo_Ensaio');

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
        XLSX.writeFile(workBook, 'Ensaio.xlsx');
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
    let parametersFilter;
    if (orderType) {
      parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await assayListService.getAll(parametersFilter).then(({ status, response }) => {
      if (status === 200) {
        setAssayList(response);
      }
    });
  }

  function filterFieldFactory(title: string, name: string) {
    return (
      <div className="h-7 w-1/2 ml-4">
        <label className="block text-gray-900 text-sm font-bold mb-1">
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
    );
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de Ensaio</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="listas">
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar ensaios">
            <div className="w-full flex gap-2">
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
                  pb-0
                "
                >
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Protocolo
                    </label>
                    <Input
                      placeholder="Protocolo"
                      id="filterProtocol"
                      name="filterProtocol"
                      onChange={formik.handleChange}
                    />
                  </div>

                  {filterFieldFactory('filterFoco', 'Foco')}
                  {filterFieldFactory('filterTypeAssay', 'Ensaio')}
                  {filterFieldFactory('filterGli', 'GLI')}
                  {filterFieldFactory('filterCod', 'Cód. Tecnologia')}
                  {filterFieldFactory('filterTechnology', 'Nome Tecnologia')}
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nº de trat.
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterTratFrom"
                        name="filterTratFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 8 }}
                        placeholder="Até"
                        id="filterTratTo"
                        name="filterTratTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  {filterFieldFactory('filterStatusAssay', 'Status do ensaio')}

                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
                    <Button
                      onClick={() => { }}
                      value="Filtrar"
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiFilterAlt size={20} />}
                    />
                  </div>
                </div>

              </form>
            </div>
          </AccordionFilter>

          {/* overflow-y-scroll */}
          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={assayList}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
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
                    {/* <div className="h-12">
                      <Button
                        title="Importar Planilha"
                        value="Importar Planilha"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="ensaio/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
                      />
                    </div> */}

                    <div />
                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2
                    "
                    >
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-64">
                          <AccordionFilter title="Gerenciar Campos" grid={statusAccordion}>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                              <Droppable droppableId="characters">
                                {
                                  (provided) => (
                                    <ul className="w-full h-full characters" {...provided.droppableProps} ref={provided.innerRef}>
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
                                            {(providers) => (
                                              <li
                                                ref={providers.innerRef}
                                                {...providers.draggableProps}
                                                {...providers.dragHandleProps}
                                              >
                                                <CheckBox
                                                  name={generate.name}
                                                  title={generate.title?.toString()}
                                                  value={generate.value}
                                                  defaultChecked={
                                                    camposGerenciados.includes(generate.value)
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
                        <Button
                          title="Exportar planilha de ensaios"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => { downloadExcel(); }}
                        />
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
                      onClick={() => setCurrentPage(0)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<MdFirstPage size={18} />}
                      disabled={currentPage < 1}
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
                      onClick={() => setCurrentPage(pages)}
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }: any) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page;

  const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : '';
  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/assay-list`;

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${filterBeforeEdit}&id_culture=${idCulture}&id_safra=${idCulture}`
    : `filterStatus=1&id_culture=${idCulture}&id_safra=${idSafra}`;

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${idCulture}&id_safra=${idSafra}`;

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const {
    response: allAssay,
    total: totalItems,
  } = await fetch(urlParameters.toString(), requestOptions).then((response) => response.json());

  return {
    props: {
      allAssay,
      totalItems,
      itensPerPage,
      filterApplication,
      idCulture,
      idSafra,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
