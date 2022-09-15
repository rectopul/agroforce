import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
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
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { Router, useRouter } from 'next/router';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiSettingsFill } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { removeCookies } from 'cookies-next';
import { npeService, userPreferencesService } from '../../../services';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
} from '../../../components';
import * as ITabs from '../../../shared/utils/dropdown';

interface INpeProps {
  id: number | any;
  local: number;
  safra: number;
  foco: number;
  type_assay: number;
  ogm: number;
  epoca: number;
  npei: number;
  npef: number;
  consumedQT: number;
  prox_npe: number;
  status?: number;
  created_by: number;
}

interface IFilter {
  filterStatus: object | any;
  filterLocal: string | any;
  filterSafra: string | any;
  filterFoco: string | any;
  filterEnsaio: string | any;
  filterTecnologia: string | any;
  filterEpoca: string | any;
  filterNPE: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface IData {
  allNpe: any;
  totalItems: number;
  filter: string | any;
  itensPerPage: number | any;
  filterApplication: object | any;
}

export default function Listagem({
  allNpe,
  itensPerPage,
  filterApplication,
  totalItems,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { tabsOperation } = ITabs.default;

  const tabsOperationMenu = tabsOperation.map((i) => (i.titleTab === 'AMBIENTE' ? { ...i, statusTab: true } : i));

  const router = useRouter();

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.npe || {
    id: 0,
    table_preferences:
      'id,local,safra,foco,ensaio,tecnologia,epoca,npei,npef',
  };
  preferences.table_preferences = 'id,local,safra,foco,ensaio,tecnologia,epoca,npei,npef';
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const [npe, setNPE] = useState(allNpe);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [selectedNPE, setSelectedNPE] = useState<INpeProps[]>([]);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // {
    //   name: 'CamposGerenciados[]',
    //   title: 'Favorito ',
    //   value: 'id',
    //   defaultChecked: () => camposGerenciados.includes('id'),
    // },
    {
      name: 'CamposGerenciados[]',
      title: 'Lugar de cultura',
      value: 'local',
      defaultChecked: () => camposGerenciados.includes('local'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Safra ',
      value: 'safra',
      defaultChecked: () => camposGerenciados.includes('safra'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Foco ',
      value: 'foco',
      defaultChecked: () => camposGerenciados.includes('foco'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Ensaio ',
      value: 'ensaio',
      defaultChecked: () => camposGerenciados.includes('ensaio'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Tecnologia',
      value: 'tecnologia',
      defaultChecked: () => camposGerenciados.includes('tecnologia'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Época',
      value: 'epoca',
      defaultChecked: () => camposGerenciados.includes('epoca'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'NPE Inicial ',
      value: 'npei',
      defaultChecked: () => camposGerenciados.includes('npei'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'NPE Final',
      value: 'npef',
      defaultChecked: () => camposGerenciados.includes('npef'),
    },
  ]);

  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterLocal: '',
      filterSafra: '',
      filterFoco: '',
      filterEnsaio: '',
      filterTecnologia: '',
      filterEpoca: '',
      filterNPE: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterStatus,
      filterLocal,
      filterSafra,
      filterFoco,
      filterEnsaio,
      filterTecnologia,
      filterEpoca,
      filterNPE,
    }) => {
      const parametersFilter = `filterStatus=${filterStatus || 1
      }&filterLocal=${filterLocal}&filterSafra=${filterSafra}&filterFoco=${filterFoco}&filterEnsaio=${filterEnsaio}&filterTecnologia=${filterTecnologia}&filterEpoca=${filterEpoca}&filterNPE=${filterNPE}&id_safra=${userLogado.safras.safra_selecionada
      }`;
      await npeService
        .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
        .then((response) => {
          setFilter(parametersFilter);
          setNPE(response.response);
          setTotalItems(response.total);
          setCurrentPage(0);
        });
    },
  });

  const filters = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatus = filterApplication.split('');

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

  function colums(camposGerenciados: any): any {
    const columnCampos: any = camposGerenciados.split(',');
    const tableFields: any = [];
    Object.keys(columnCampos).forEach((item) => {
      if (columnCampos[item] === 'local') {
        tableFields.push(
          headerTableFactory('Lugar de cultura', 'local.name_local_culture'),
        );
      }
      if (columnCampos[item] === 'safra') {
        tableFields.push(headerTableFactory('Safra', 'safra.safraName'));
      }
      if (columnCampos[item] === 'foco') {
        tableFields.push(headerTableFactory('Foco', 'foco.name'));
      }
      if (columnCampos[item] === 'ensaio') {
        tableFields.push(headerTableFactory('Ensaio', 'type_assay.name'));
      }
      if (columnCampos[item] === 'tecnologia') {
        tableFields.push(headerTableFactory('Tecnologia', 'tecnologia.name'));
      }
      if (columnCampos[item] === 'epoca') {
        tableFields.push(headerTableFactory('Época', 'epoca'));
      }
      if (columnCampos[item] === 'npei') {
        tableFields.push(headerTableFactory('NPE Inicial', 'npei'));
      }
      if (columnCampos[item] === 'npef') {
        tableFields.push(headerTableFactory('NPE Final', 'npef'));
      }
    });
    return tableFields;
  }

  const columns = colums(camposGerenciados);

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

    await npeService
      .getAll(`${parametersFilter}&skip=0&take=${take}`)
      .then((response) => {
        if (response.status === 200) {
          setNPE(response.response);
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
          userLogado.preferences.npe = {
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

  async function handleStatus(idNPE: number, data: any): Promise<void> {
    const parametersFilter = `filterStatus=${1}&id_safra=${data.id_safra
    }&id_foco=${data.id_foco}&id_ogm=${data.id_ogm}&id_type_assay=${data.id_type_assay
    }&epoca=${String(data.epoca)}`;
    if (data.status == 0) {
      await npeService.getAll(parametersFilter).then((response) => {
        if (response.total > 0) {
          Swal.fire(
            'NPE não pode ser atualizada pois já existe uma npei cadastrada com essas informações',
          );
          router.push('');
        }
      });
    } else {
      if (data.status === 0) {
        data.status = 1;
      } else {
        data.status = 0;
      }
      await npeService.update({ id: idNPE, status: data.status });

      const index = npe.findIndex((npe: any) => npe.id === idNPE);

      if (index === -1) {
        return;
      }

      setNPE((oldSafra: any) => {
        const copy = [...oldSafra];
        copy[index].status = data.status;
        return copy;
      });
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

    await npeService.getAll(filterApplication).then((response) => {
      if (response.status === 200) {
        const newData = response.response.map(
          (row: { avatar: any; status: any }) => {
            delete row.avatar;
            if (row.status === 0) {
              row.status = 'Inativo';
            } else {
              row.status = 'Ativo';
            }

            return row;
          },
        );

        newData.map((item: any) => {
          item.foco = item.foco?.name;
          item.local = item.local?.name_local_culture;
          item.safra = item.safra?.safraName;
          item.tecnologia = item.tecnologia?.name;
          item.type_assay = item.type_assay?.name;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'npe');

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
        XLSX.writeFile(workBook, 'NPE.xlsx');
      } else {
        Swal.fire('Erro ao exportar');
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
    await npeService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setNPE(response.response);
      }
    });
  }

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="h-7 w-1/2 ml-4">
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

  function handleSelectionRow(data: any) {
    const selectedRow = data?.map((e: any) => (
      { ...e, tableData: { id: e.tableData.id, checked: false } }));
    setSelectedNPE(selectedRow);
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  const handleRowSelection = (rowData: any) => {
    if (selectedNPE?.includes(rowData)) {
      rowData.tableData.checked = false;
      setSelectedNPE(selectedNPE.filter((item) => item != rowData));
    } else {
      rowData.tableData.checked = true;
      setSelectedNPE([...selectedNPE, rowData]);
    }
  };

  return (
    <>
      <Head>
        <title>Listagem dos NPEs</title>
      </Head>
      <Content contentHeader={tabsOperationMenu} moduloActive="operacao">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar ambientes">
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
                  <div className="h-6 w-1/2 ml-1">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>
                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange}
                      defaultValue={filterStatus[13]}
                      values={filters.map((id) => id)}
                      selected="1"
                    />
                  </div>

                  {filterFieldFactory('filterLocal', 'Lugar de cultura')}

                  {filterFieldFactory('filterSafra', 'Safra')}

                  {filterFieldFactory('filterFoco', 'Foco')}

                  {filterFieldFactory('filterEnsaio', 'Ensaio')}

                  {filterFieldFactory('filterTecnologia', 'Tecnologia')}

                  {filterFieldFactory('filterEpoca', 'Época')}

                  {filterFieldFactory('filterNPE', 'NPE Inicial')}

                  <div className="h-7 w-32 mt-6" style={{ marginLeft: 15 }}>
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
              data={npe}
              onRowClick={(evt, selectedRow: any) => {
                handleRowSelection(selectedRow);
              }}
              options={{
                showTitle: false,
                headerStyle: {
                  zIndex: 20,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
                search: false,
                filtering: false,
                pageSize: itensPerPage,
                selection: true,
                showSelectAllCheckbox: false,
                showTextRowsSelected: false,
              }}
              onSelectionChange={handleSelectionRow}
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
                        title="Gerar sorteio"
                        value="Gerar sorteio"
                        bgColor={selectedNPE?.length <= 0 ? 'bg-gray-400' : 'bg-blue-600'}
                        textColor="white"
                        disabled={selectedNPE.length <= 0}
                        onClick={() => {
                          selectedNPE.sort((a, b) => a.npei - b.npei);
                          localStorage.setItem('selectedNPE', JSON.stringify(selectedNPE));
                          router.push({
                            pathname: '/operacao/ambiente/experimento',
                          });
                        }}
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
                          title="Exportar planilha de NPE"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            downloadExcel();
                          }}
                        />
                        {/* <Button
                          icon={<RiSettingsFill size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => { }}
                          href="npe/importar-planilha/config-planilha"
                        /> */}
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
                      onClick={() => setCurrentPage(currentPage + 10)}
                      bgColor="bg-blue-600 testing"
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

  const { token } = req.cookies;
  const id_safra: any = req.cookies.safraId;

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/npe`;

  const filterApplication = `filterStatus=1&safraId=${id_safra}`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&safraId=${id_safra}`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const {
    response: allNpe = [],
    total: totalItems = 0,
  } = await fetch(urlParameters.toString(), requestOptions).then((response) => (response.json()));

  return {
    props: {
      allNpe,
      totalItems,
      itensPerPage,
      filterApplication,
    },
  };
};
