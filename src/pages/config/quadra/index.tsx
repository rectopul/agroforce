/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-array-index-key */
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiTwotoneStar,
} from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiSettingsFill } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { removeCookies, setCookies } from 'cookies-next';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
} from '../../../components';
import { quadraService, userPreferencesService } from '../../../services';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import ITabs from '../../../shared/utils/dropdown';

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  filterSchema: string | any;
  filterPreparation: string | any;
  filterPFrom: string | any;
  filterPTo: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export interface IQuadra {
  id: number;
  id_culture: number;
  local: any;
  local_plagio: string;
  cod_quadra: string;
  comp_p: string;
  linha_p: string;
  esquema: string;
  divisor: string;
  status?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  quadras: IQuadra[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  cultureId: number;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
}

export default function Listagem({
  quadras,
  totalItems,
  itensPerPage,
  filterApplication,
  cultureId,
  pageBeforeEdit,
  filterBeforeEdit,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'QUADRAS'
    ? (tab.statusTab = true)
    : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.quadras || {
    id: 0,
    table_preferences: 'id,local_preparo,cod_quadra,linha_p,esquema,status',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const router = useRouter();
  const [quadra, setQuadra] = useState<IQuadra[]>(() => quadras);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems || 0);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    {
      name: 'CamposGerenciados[]',
      title: 'Local preparo',
      value: 'local_preparo',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Código quadra',
      value: 'cod_quadra',
    },
    { name: 'CamposGerenciados[]', title: 'Linha P', value: 'linha_p' },
    { name: 'CamposGerenciados[]', title: 'Esquema', value: 'esquema' },
    { name: 'CamposGerenciados[]', title: 'Status', value: 'status' },
  ]);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const filtersStatusItem = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatusBeforeEdit = filterBeforeEdit.split('');

  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      filterSchema: '',
      filterPTo: '',
      filterPFrom: '',
      filterPreparation: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterStatus,
      filterSearch,
      filterSchema,
      filterPTo,
      filterPFrom,
    }) => {
      const parametersFilter = `filterStatus=${
        filterStatus || 1
      }&filterSearch=${filterSearch}&id_culture=${cultureId}&filterSchema=${filterSchema}&filterPTo=${filterPTo}&filterPFrom=${filterPFrom}`;
      setFiltersParams(parametersFilter);
      setCookies('filterBeforeEdit', filtersParams);
      await quadraService
        .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
        .then((response) => {
          setFilter(parametersFilter);
          setQuadra(response.response);
          setTotalItems(response.total);
          setCurrentPage(0);
        });
    },
  });

  async function handleStatus(idQuadra: number, data: IQuadra): Promise<void> {
    const parametersFilter = `filterStatus=${1}&cod_quadra=${
      data.cod_quadra
    }&local_preparo=${data.local.name_local_culture}`;
    if (data.status === 0) {
      data.status = 1;
    } else {
      data.status = 0;
    }

    await quadraService.getAll(parametersFilter).then(async ({ status }) => {
      if (status === 200 && data.status === 1) {
        Swal.fire('Foco já ativado');
        return;
      }
      await quadraService.update({
        id: idQuadra,
        status: data.status,
      });
    });

    const index = quadra.findIndex(
      (quadraIndex) => quadraIndex.id === idQuadra,
    );

    if (index === -1) {
      return;
    }

    setQuadra((oldSafra) => {
      const copy = [...oldSafra];
      copy[index].status = data.status;
      return copy;
    });
  }

  async function handleOrder(
    column: string,
    order: string | any,
  ): Promise<void> {
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
    if (filter && typeof filter !== 'undefined') {
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

    await quadraService
      .getAll(`${parametersFilter}&skip=0&take=${take}`)
      .then((response) => {
        if (response.status === 200) {
          setQuadra(response.response);
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
      sorting: true,
    };
  }

  function idHeaderFactory() {
    return {
      title: <div className="flex items-center">{arrowOrder}</div>,
      field: 'id',
      width: 0,
      sorting: false,
      render: () => (colorStar === '#eba417' ? (
        <div className="h-9 flex">
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
      ) : (
        <div className="h-9 flex">
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
      )),
    };
  }

  function statusHeaderFactory() {
    return {
      title: 'Status',
      field: 'status',
      sorting: false,
      searchable: false,
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: IQuadra) => (
        <div className="h-7 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              bgColor="bg-blue-600"
              textColor="white"
              title={`Editar ${rowData.cod_quadra}`}
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filtersParams);
                router.push(`/config/quadra/atualizar?id=${rowData.id}`);
              }}
            />
          </div>
          <div style={{ width: 5 }} />
          {rowData.status === 1 ? (
            <div className="h-7">
              <Button
                icon={<FaRegThumbsUp size={14} />}
                onClick={async () => handleStatus(rowData.id, {
                  status: rowData.status,
                  ...rowData,
                })}
                title="Ativo"
                bgColor="bg-green-600"
                textColor="white"
              />
            </div>
          ) : (
            <div className="h-7">
              <Button
                icon={<FaRegThumbsDown size={14} />}
                onClick={async () => handleStatus(rowData.id, {
                  status: rowData.status,
                  ...rowData,
                })}
                title="Inativo"
                bgColor="bg-red-800"
                textColor="white"
              />
            </div>
          )}
        </div>
      ),
    };
  }

  function columnsOrder(columnsCampos: any): any {
    const columnCampos: any = columnsCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((_, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === 'cod_quadra') {
        tableFields.push(headerTableFactory('Código quadra', 'cod_quadra'));
      }
      if (columnCampos[index] === 'comp_p') {
        tableFields.push(headerTableFactory('Comp P', 'comp_p'));
      }
      if (columnCampos[index] === 'linha_p') {
        tableFields.push(headerTableFactory('Linha P', 'linha_p'));
      }
      if (columnCampos[index] === 'esquema') {
        tableFields.push(headerTableFactory('Esquema', 'esquema'));
      }
      if (columnCampos[index] === 'divisor') {
        tableFields.push(headerTableFactory('Divisor', 'divisor'));
      }
      if (columnCampos[index] === 'local_plantio') {
        tableFields.push(headerTableFactory('Local plantio', 'local_plantio'));
      }
      if (columnCampos[index] === 'local_preparo') {
        tableFields.push(
          headerTableFactory('Local preparo', 'local.name_local_culture'),
        );
      }
      if (columnCampos[index] === 'status') {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox']");
    let selecionados = '';
    for (let i = 0; i < els.length; i += 1) {
      if (els[i].checked) {
        selecionados += `${els[i].value},`;
      }
    }
    const totalString = selecionados.length;
    const campos = selecionados.substr(0, totalString - 1);
    if (preferences.id === 0) {
      await userPreferencesService
        .create({
          table_preferences: campos,
          userId: userLogado.id,
          module_id: 17,
        })
        .then((response) => {
          userLogado.preferences.quadras = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.quadras = {
        id: preferences.id,
        userId: preferences.userId,
        table_preferences: campos,
      };
      await userPreferencesService.update({
        table_preferences: campos,
        id: preferences.id,
      });
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
    await quadraService.getAll(filterApplication).then(({ status, response }) => {
      if (status === 200) {
        const newData = response.map((row: any) => {
          if (row.status === 0) {
            row.status = 'Inativo' as any;
          } else {
            row.status = 'Ativo' as any;
          }

          row.COD_QUADRA = row.cod_quadra;
          row.LOCAL = row.local?.name_local_culture;
          row.ESQUEMA = row.esquema;
          row.LARG_Q = row.larg_q;
          row.COMP_P = row.comp_p;
          row.LINHA_P = row.linha_p;
          row.COMP_C = row.comp_c;
          row.TIRO_FIXO = row.tiro_fixo;
          row.DISPARO_FIXO = row.disparo_fixo;
          row.STATUS = row.status;

          delete row.cod_quadra;
          delete row.local;
          delete row.esquema;
          delete row.larg_q;
          delete row.comp_p;
          delete row.linha_p;
          delete row.q;
          delete row.comp_c;
          delete row.tiro_fixo;
          delete row.disparo_fixo;
          delete row.status;
          delete row.id;
          delete row.safra;
          delete row.tableData;
          delete row.local_plantio;
          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'quadra');

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
        XLSX.writeFile(workBook, 'Quadras.xlsx');
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
    let parametersFilter;
    if (orderType) {
      parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}&${cultureId}`;
    }
    await quadraService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setQuadra(response.response);
      }
    });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de quadras</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar quadras">
            <div className="w-full flex gap-2">
              <form
                className="flex flex-col
                  w-full
                  items-center
                  px-2
                  bg-white
                "
                onSubmit={formik.handleSubmit}
              >
                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pb-0
                "
                >
                  <div className="h-7 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      defaultValue={filterStatusBeforeEdit[13]}
                      values={filtersStatusItem.map((id) => id)}
                      selected="1"
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Local preparo
                    </label>
                    <Input
                      type="text"
                      placeholder="Local Preparo"
                      max="40"
                      id="filterPreparation"
                      name="filterPreparation"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Código quadra
                    </label>
                    <Input
                      type="text"
                      placeholder="Código quadra"
                      max="40"
                      id="filterSearch"
                      name="filterSearch"
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Linha P
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="De"
                        id="filterPFrom"
                        name="filterPFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        placeholder="Até"
                        id="filterPTo"
                        name="filterPTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Esquema
                    </label>
                    <Input
                      type="text"
                      placeholder="Esquema"
                      max="40"
                      id="filterSchema"
                      name="filterSchema"
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="h-7 w-32 mt-6" style={{ marginLeft: 10 }}>
                    <Button
                      type="submit"
                      onClick={() => {}}
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

          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={quadra}
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
                        href="quadra/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
                      />
                    </div> */}

                    <div />

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2">
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-72">
                          <AccordionFilter
                            title="Gerenciar Campos"
                            grid={statusAccordion}
                          >
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                              <Droppable droppableId="characters">
                                {(provided) => (
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
                                    {generatesProps.map((generate, index) => (
                                      <Draggable
                                        key={index}
                                        draggableId={String(generate.title)}
                                        index={index}
                                      >
                                        {(provider) => (
                                          <li
                                            ref={provider.innerRef}
                                            {...provider.draggableProps}
                                            {...provider.dragHandleProps}
                                          >
                                            <CheckBox
                                              name={generate.name}
                                              title={generate.title?.toString()}
                                              value={generate.value}
                                              defaultChecked={camposGerenciados.includes(
                                                String(generate.value),
                                              )}
                                            />
                                          </li>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </ul>
                                )}
                              </Droppable>
                            </DragDropContext>
                          </AccordionFilter>
                        </div>
                      </div>

                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportar planilha de quadras"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            downloadExcel();
                          }}
                        />
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Configurar Importação de Planilha"
                          icon={<RiSettingsFill size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {}}
                          href="quadra/importar-planilha/config-planilha"
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
                    {Array(1)
                      .fill('')
                      .map((value, index) => (
                        <Button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          value={`${currentPage + 1}`}
                          bgColor="bg-blue-600"
                          textColor="white"
                          disabled
                        />
                      ))}
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}: any) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 15;

  const { token } = req.cookies;
  const cultureId: number = Number(req.cookies.cultureId);
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : 'filterStatus=1';

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}&id_culture=${cultureId}`
    : `filterStatus=1&id_culture=${cultureId}`;

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/quadra`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${cultureId}`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const response = await fetch(
    `${baseUrl}?id_culture=${cultureId}`,
    requestOptions,
  );
  const { response: quadras, total: totalItems } = await response.json();

  return {
    props: {
      quadras,
      totalItems,
      itensPerPage,
      filterApplication,
      cultureId,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
