import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import router from 'next/router';
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
import { BsDownload } from 'react-icons/bs';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiSettingsFill } from 'react-icons/ri';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { layoutQuadraService, userPreferencesService } from 'src/services';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';

interface ILayoultProps {
  id: number | any;
  id_culture: number | any;
  esquema: string | any;
  semente_metros: number | any;
  disparos: number | any;
  divisor: number | any;
  largura: number | any;
  comp_fisico: number | any;
  comp_parcela: number | any;
  comp_corredor: number | any;
  t4_inicial: number | any;
  t4_final: number | any;
  df_inicial: number | any;
  df_final: number | any;
  created_by: number;
  local: string | any;
  status: number;
}

interface IFilter {
  filterStatus: object | any;
  filterCodigo: string | any;
  filterEsquema: string | any;
  filterTiros: string | any;
  filterDisparos: string | any;
  filterPlantadeira: string | any;
  filterParcelas: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface Idata {
  layouts: ILayoultProps[];
  totalItems: number;
  filter: string | any;
  itensPerPage: number | any;
  filterApplication: object | any;
  local: object | any;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any;
}

export default function Listagem({
  layouts,
  itensPerPage,
  filterApplication,
  totalItems,
  local,
  pageBeforeEdit,
  filterBeforeEdit,
}: Idata) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'QUADRAS'
    ? (tab.statusTab = true)
    : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.layout_quadra || {
    id: 0,
    table_preferences: 'id,esquema,plantadeira,tiros,disparos,parcelas,status',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [quadras, setQuadra] = useState<ILayoultProps[]>(() => layouts);
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);

  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: 'CamposGerenciados[]',
      title: 'Favorito ',
      value: 'id',
      defaultChecked: () => camposGerenciados.includes('id'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Esquema ',
      value: 'esquema',
      defaultChecked: () => camposGerenciados.includes('esquema'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Plantadeira ',
      value: 'plantadeira',
      defaultChecked: () => camposGerenciados.includes('local'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Tiros',
      value: 'tiros',
      defaultChecked: () => camposGerenciados.includes('divisor'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Disparos',
      value: 'disparos',
      defaultChecked: () => camposGerenciados.includes('disparos'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Parcelas',
      value: 'parcelas',
      defaultChecked: () => camposGerenciados.includes('largura'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Status',
      value: 'status',
      defaultChecked: () => camposGerenciados.includes('status'),
    },
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [colorStar, setColorStar] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const columns = colums(camposGerenciados);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterCodigo: '',
      filterEsquema: '',
      filterDisparos: '',
      filterTiros: '',
      filterPlantadeira: '',
      filterParcelas: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterStatus,
      filterEsquema,
      filterDisparos,
      filterTiros,
      filterPlantadeira,
      filterParcelas,
    }) => {
      const parametersFilter = `filterStatus=${
        filterStatus || 1
      }&filterEsquema=${filterEsquema}&filterDisparos=${filterDisparos}&filterTiros=${filterTiros}&filterPlantadeira=${filterPlantadeira}&filterParcelas=${filterParcelas}`;
      setFiltersParams(parametersFilter);
      setCookies('filterBeforeEdit', filtersParams);
      await layoutQuadraService
        .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
        .then((response) => {
          setTotaItems(response.total);
          setFilter(parametersFilter);
          setQuadra(response.response);
        });
    },
  });

  const filters = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatusBeforeEdit = filterBeforeEdit.split('');

  function headerTableFactory(name: any, title: string) {
    return {
      title: (
        <div className="flex items-center">
          <button
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
      render: (rowData: ILayoultProps) => (rowData.status ? (
        <div className="h-7 flex">
          <div
            className="
							h-7
						"
          >
            <Button
              title={`Atualizar ${rowData.esquema}`}
              icon={<BiEdit size={14} />}
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filtersParams);
                router.push(
                  `/config/quadra/layout-quadra/atualizar?id=${rowData.id}`,
                );
              }}
            />
          </div>
          <div style={{ width: 5 }} />
          <div>
            <Button
              title="Ativo"
              icon={<FaRegThumbsUp size={14} />}
              onClick={() => handleStatus(rowData.id, { ...rowData })}
              bgColor="bg-green-600"
              textColor="white"
            />
          </div>
        </div>
      ) : (
        <div className="h-7 flex">
          <div
            className="
							h-7
						"
          >
            <Button
              title={`Atualizar ${rowData.esquema}`}
              icon={<BiEdit size={14} />}
              bgColor="bg-blue-600"
              textColor="white"
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
                setCookies('filterBeforeEdit', filtersParams);
                router.push(
                  `/config/layout-quadra/atualizar?id=${rowData.id}`,
                );
              }}
            />
          </div>
          <div style={{ width: 5 }} />
          <div>
            <Button
              title="Inativo"
              icon={<FaRegThumbsDown size={14} />}
              onClick={() => handleStatus(rowData.id, { ...rowData })}
              bgColor="bg-red-800"
              textColor="white"
            />
          </div>
        </div>
      )),
    };
  }

  function colums(camposGerenciados: any): any {
    const columnCampos: any = camposGerenciados.split(',');
    const tableFields: any = [];
    Object.keys(columnCampos).forEach((item) => {
      if (columnCampos[item] === 'id') {
        tableFields.push(idHeaderFactory());
      }
      if (columnCampos[item] === 'esquema') {
        tableFields.push(headerTableFactory('Esquema', 'esquema'));
      }

      if (columnCampos[item] === 'local') {
        tableFields.push(headerTableFactory('Local', 'local'));
      }

      if (columnCampos[item] === 'plantadeira') {
        tableFields.push(headerTableFactory('Plantadeiras', 'plantadeira'));
      }

      if (columnCampos[item] === 'tiros') {
        tableFields.push(headerTableFactory('Tiros', 'tiros'));
      }

      if (columnCampos[item] === 'disparos') {
        tableFields.push(headerTableFactory('Disparos', 'disparos'));
      }

      if (columnCampos[item] === 'parcelas') {
        tableFields.push(headerTableFactory('Parcelas', 'parcelas'));
      }

      if (columnCampos[item] === 'status') {
        tableFields.push(statusHeaderFactory());
      }
    });
    return tableFields;
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

    await layoutQuadraService
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
      await userPreferencesService
        .create({
          table_preferences: campos,
          userId: userLogado.id,
          module_id: 5,
        })
        .then((response) => {
          userLogado.preferences.layout_quadra = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.layout_quadra = {
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

  async function handleStatus(
    idLayoutQuadra: number,
    data: any,
  ): Promise<void> {
    const parametersFilter = `filterStatus=${1}&id_culture=${
      userLogado.userCulture.cultura_selecionada
    }&esquema=${data.esquema}&status=${1}`;
    if (data.status == 0) {
      await layoutQuadraService.getAll(parametersFilter).then((response) => {
        if (response.total > 0) {
          Swal.fire(
            'Layout não pode ser atualizada pois já existe um layout cadastrada com essas informações ativo',
          );
          router.push('');
        } else {
          data.status = 1;

          layoutQuadraService.update({
            id: idLayoutQuadra,
            status: data.status,
          });

          const index = quadras.findIndex(
            (layout: any) => layout.id === idLayoutQuadra,
          );

          if (index === -1) {
            return;
          }

          setQuadra((oldSafra: any) => {
            const copy = [...oldSafra];
            copy[index].status = data.status;
            return copy;
          });

          const { id, status } = quadras[index];
        }
      });
    } else {
      if (data.status === 0) {
        data.status = 1;
      } else {
        data.status = 0;
      }
      await layoutQuadraService.update({
        id: idLayoutQuadra,
        status: data.status,
      });

      const index = quadras.findIndex(
        (layout: any) => layout.id === idLayoutQuadra,
      );

      if (index === -1) {
        return;
      }

      setQuadra((oldSafra: any) => {
        const copy = [...oldSafra];
        copy[index].status = data.status;
        return copy;
      });

      const { id, status } = quadras[index];
    }
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
    if (!filterApplication.includes('paramSelect')) {
      filterApplication += `&paramSelect=${camposGerenciados}`;
    }

    await layoutQuadraService.getAll(filterApplication).then((response) => {
      if (response.status === 200) {
        const newData = quadras.map((row) => {
          if (row.status === 0) {
            row.status = 'Inativo' as any;
          } else {
            row.status = 'Ativo' as any;
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'quadras');

        // Buffer
        const buf = XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'buffer',
        });
        // Binary
        XLSX.write(workBook, {
          bookType: 'xlsx', // xlsx
          type: 'binary',
        });
        // Download
        XLSX.writeFile(workBook, 'Layout_Quadra.xlsx');
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
    await layoutQuadraService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setQuadra(response.response);
      }
    });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="w-1/2 ml-4">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <Input
          type="text"
          placeholder={name}
          max="40"
          id={title}
          name={title}
          onChange={formik.handleChange}
        />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Listagem dos Layout</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar layouts de quadra">
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
                <div
                  className="w-full h-full
                  flex
                  justify-center
                  pb-2
                "
                >
                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      defaultValue={filterStatusBeforeEdit[13]}
                      values={filters.map((id) => id)}
                      selected="1"
                    />
                  </div>

                  {filterFieldFactory('filterEsquema', 'Esquema')}

                  {filterFieldFactory('filterPlantadeira', 'Plantadeiras')}

                  {filterFieldFactory('filterTiros', 'Tiros')}

                  {filterFieldFactory('filterDisparos', 'Disparos')}

                  {filterFieldFactory('filterParcelas', 'Numero Parcelas')}

                  <div style={{ width: 40 }} />
                  <div className="h-7 w-32 mt-6">
                    <Button
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

          {/* overflow-y-scroll */}
          <div className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={quadras}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                rowStyle: { background: '#f9fafb' },
                search: false,
                filtering: false,
                pageSize: itensPerPage,
              }}
              components={{
                Toolbar: () => (
                  <div
                    className="w-full max-h-max
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
                    <div className="h-12">
                      <Button
                        title="Importar Planilha"
                        value="Importar Planilha"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {}}
                        href="layout-quadra/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
                      />
                    </div>
                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div
                      className="h-full flex items-center gap-2
                    "
                    >
                      <div className="border-solid border-2 border-blue-600 rounded">
                        <div className="w-64">
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
                                        {(provided) => (
                                          <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            <CheckBox
                                              name={generate.name}
                                              title={generate.title?.toString()}
                                              value={generate.value}
                                              defaultChecked={camposGerenciados.includes(
                                                generate.value,
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
                          title="Exportar planilha de layout quadra"
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
                          href="layout-quadra/importar-planilha/config-planilha"
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 10;

  const { token } = req.cookies;
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : 'filterStatus=1';

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/layout-quadra`;
  const urlParameters: any = new URL(baseUrl);

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const filterApplication = 'filterStatus=1';
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const layout = await fetch(urlParameters.toString(), requestOptions);
  const { response: layouts, total: totalItems } = await layout.json();

  return {
    props: {
      layouts,
      totalItems,
      itensPerPage,
      filterApplication,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
