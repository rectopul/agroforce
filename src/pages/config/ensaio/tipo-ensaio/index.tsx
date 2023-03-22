/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
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
import { RiFileExcel2Line, RiOrganizationChart } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import ComponentLoading from '../../../../components/Loading';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
  FieldItemsPerPage,
  ButtonToogleConfirmation,
  ManageFields,
} from '../../../../components';

import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import { typeAssayService, userPreferencesService } from '../../../../services';
import * as ITabs from '../../../../shared/utils/dropdown';
import { tableGlobalFunctions } from '../../../../helpers';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import { functionsUtils } from '../../../../shared/utils/functionsUtils';
import { perm_can_do } from '../../../../shared/utils/perm_can_do';

interface ITypeAssayProps {
  id: number;
  name: string;
  envelope?: [];
  created_by: number;
  status: number;
}

interface IFilter {
  filterStatus: string;
  filterName: string;
  filterProtocolName: string;
  filterSeedsTo: string;
  filterSeedsFrom: string;
  orderBy: string;
  typeOrder: string;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allTypeAssay: ITypeAssayProps[];
  totalItems: number;
  filter: string;
  itensPerPage: number;
  filterApplication: object;
  idCulture: number;
  safraId: string;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string;
  typeOrderServer: any | string; // RR
  orderByserver: any | string; // RR
}

export default function TipoEnsaio({
  allTypeAssay,
  itensPerPage,
  filterApplication,
  totalItems,
  idCulture,
  safraId,
  pageBeforeEdit,
  filterBeforeEdit,
  typeOrderServer, // RR
  orderByserver, // RR
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [loading, setLoading] = useState<boolean>(false);
  const { TabsDropDowns } = ITabs.default;

  const tableRef = useRef<any>(null);

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));
  const router = useRouter();
  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const table = 'type_assay';
  const module_name = 'tipo-ensaio';
  const module_id = 9;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'id,name,protocol_name,envelope,safra,status,action';
  const preferencesDefault = {
    id: 0,
    route_usage: router.route,
    table_preferences: camposGerenciadosDefault,
  };

  const [preferences, setPreferences] = useState<any>(
    userLogado.preferences[identifier_preference] || preferencesDefault,
  );
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );
  const [typeAssay, setTypeAssay] = useState<ITypeAssayProps[]>(
    () => allTypeAssay,
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );

  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    {
      name: 'CamposGerenciados[]',
      title: 'Nome',
      value: 'name',
      defaultChecked: () => camposGerenciados.includes('name'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Quant de sementes por envelope',
      value: 'envelope',
      defaultChecked: () => camposGerenciados.includes('envelope'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Safra',
      value: 'safra',
      defaultChecked: () => camposGerenciados.includes('safra'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Status',
      value: 'status',
      defaultChecked: () => camposGerenciados.includes('status'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Ação',
      value: 'action',
      defaultChecked: () => camposGerenciados.includes('action'),
    },
  ]);

  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(false);
  const [colorStar, setColorStar] = useState<string>('');

  // const [orderBy, setOrderBy] = useState<string>("");

  const [orderType, setOrderType] = useState<string>('');
  const [take, setTake] = useState<number>(itensPerPage);
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);
  const [orderBy, setOrderBy] = useState<string>(orderByserver); // RR
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer); // RR
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedModal, setSelectedModal] = useState<any>(null);

  const pathExtra = `skip=${
    currentPage * Number(take)
  }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`; // RR

  const filters = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatusBeforeEdit = filterBeforeEdit.split('');

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: filterStatusBeforeEdit[13],
      filterName: checkValue('filterName'),
      filterProtocolName: checkValue('filterProtocolName'),
      filterSeedsTo: checkValue('filterSeedsTo'),
      filterSeedsFrom: checkValue('filterSeedsFrom'),
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterStatus,
      filterName,
      filterProtocolName,
      filterSeedsTo,
      filterSeedsFrom,
    }) => {
      if (!functionsUtils?.isNumeric(filterSeedsFrom)) {
        return Swal.fire(
          'O campo Quantidade de Sementes não pode ter ponto ou vírgula.',
        );
      }
      if (!functionsUtils?.isNumeric(filterSeedsTo)) {
        return Swal.fire(
          'O campo Quantidade de Sementes não pode ter ponto ou vírgula.',
        );
      }

      const parametersFilter = `filterStatus=${
        filterStatus || 1
      }&filterName=${filterName}&filterProtocolName=${filterProtocolName}&filterSeedsTo=${filterSeedsTo}&filterSeedsFrom=${filterSeedsFrom}&id_culture=${idCulture}&id_safra=${safraId}`;
      setFiltersParams(parametersFilter);
      setCookies('filterBeforeEdit', filtersParams);
      setFilter(parametersFilter);
      setCurrentPage(0);
      setLoading(true);
      await callingApi(parametersFilter);
      setLoading(false);
      // await typeAssayService
      //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //   .then((response) => {
      //     setFilter(parametersFilter);
      //     setTypeAssay(response.response);
      //     setTotalItems(response.total);
      //     setCurrentPage(0);
      //   });
    },
  });

  // Calling common API

  async function callingApi(parametersFilter: any, page: any = 0) {
    setCurrentPage(page);

    setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    setCookies('filterBeforeEditOrderBy', orderBy);

    // parametersFilter = `${parametersFilter}&${pathExtra}`;
    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);
    await typeAssayService
      .getAll(parametersFilter)
      .then((response) => {
        if (response.status === 200 || response.status === 400) {
          setTypeAssay(response.response);
          setTotalItems(response.total);
          setLoading(false);
          tableRef.current.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
          setLoading(false);
        }
      })
      .catch((_) => {
        setLoading(false);
      });
  }

  // Call that function when change type order value.

  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  async function handleOrder(
    column: string,
    order: string | any,
    name: string | any,
  ): Promise<void> {
    const {
      typeOrderG, columnG, orderByG, arrowOrder,
    } = await tableGlobalFunctions.handleOrderG(column, order, orderList);

    setFieldOrder(columnG);
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    typeOrderG !== '' ? (typeOrderG == 'desc' ? setOrder(1) : setOrder(2)) : '';
    setArrowOrder(arrowOrder);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }

  async function handleStatus(data: any): Promise<void> {
    setLoading(true);
    await typeAssayService.update({
      id: data?.id,
      status: data?.status === 1 ? 0 : 1,
      created_by: userLogado.id,
    });

    handlePagination(currentPage);
  }

  function actionHeaderFactory() {
    return {
      title: 'Ação',
      field: 'action',
      sorting: false,
      searchable: false,
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: ITypeAssayProps) => (
        <div className="flex">
          {rowData.status ? (
            <div className="h-7 flex">
              <div className="h-7">
                <Button
                  icon={<BiEdit size={14} />}
                  title={`Atualizar ${rowData.name}`}
                  style={{
                    display: !perm_can_do('/config/ensaio/tipo-ensaio', 'edit')
                      ? 'none'
                      : '',
                  }}
                  onClick={() => {
                    setCookies('pageBeforeEdit', currentPage?.toString());
                    setCookies('filterBeforeEdit', filter);
                    setCookies('filterBeforeEditTypeOrder', typeOrder);
                    setCookies('filterBeforeEditOrderBy', orderBy);
                    setCookies('filtersParams', filtersParams);
                    setCookies('lastPage', 'atualizar');
                    setCookies('takeBeforeEdit', take);
                    setCookies('urlPage', 'ensaio');
                    router.push(
                      `/config/ensaio/tipo-ensaio/atualizar?id=${rowData.id}`,
                    );
                  }}
                  bgColor="bg-blue-600"
                  textColor="white"
                />
              </div>
            </div>
          ) : (
            <div className="h-7 flex">
              <div className="h-7">
                <Button
                  title={`Atualizar ${rowData.name}`}
                  icon={<BiEdit size={14} />}
                  onClick={() => {}}
                  style={{
                    display: !perm_can_do('/config/ensaio/tipo-ensaio', 'edit')
                      ? 'none'
                      : '',
                  }}
                  bgColor="bg-blue-600"
                  textColor="white"
                  href={`/config/ensaio/tipo-ensaio/atualizar?id=${rowData.id}`}
                />
              </div>
            </div>
          )}
          <div className="ml-1" />
          <ButtonToogleConfirmation
            data={rowData}
            style={{
              display: !perm_can_do('/config/ensaio/tipo-ensaio', 'disable')
                ? 'none'
                : '',
            }}
            text="o tipo ensaio"
            keyName="name"
            onPress={handleStatus}
          />
        </div>
      ),
    };
  }

  function returnFalse() {
    return false;
  }

  function colums(columnsOrder: any): any {
    const columnOrder: any = columnsOrder.split(',');

    const tableFields: any = [];

    Object.keys(columnOrder).forEach((item: any) => {
      // if (columnOrder[item] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }

      if (columnOrder[item] === 'name') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Nome',
            title: 'name',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'envelope') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Quant de sementes por envelope',
            title: 'envelope.seeds',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'safra') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Safra',
            title: 'envelope.safra.safraName',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnOrder[item] === 'status') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Status',
            title: 'status',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => (
              <div className="h-7">
                {rowData?.status == 1 ? 'Ativo' : 'Inativo'}
              </div>
            ),
          }),
        );
      }
      if (columnOrder[item] === 'action') {
        tableFields.push(actionHeaderFactory());
      }
    });

    return tableFields;
  }

  const columns = colums(camposGerenciados);

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

          module_id: 9,
        })

        .then((response) => {
          userLogado.preferences.tipo_ensaio = {
            id: response.response.id,

            userId: preferences.userId,

            table_preferences: campos,
          };

          preferences.id = response.response.id;
        });

      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.tipo_ensaio = {
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
    setLoading(true);
    const skip = 0;
    const take = 10;

    const filterParam = `${filter}&skip=${skip}&take=${take}&createFile=true`;

    await typeAssayService.getAll(filterParam).then(({ status, response }) => {
      if (!response.A1) {
        Swal.fire('Nenhum dado para extrair');
        return;
      }
      if (status === 200) {
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, response, 'Tipo_Ensaio');

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

        XLSX.writeFile(workBook, 'Tipo_Ensaio.xlsx');

        setLoading(false);
      } else {
        setLoading(false);
        Swal.fire('Não existem registros para serem exportados, favor checar.');
      }
    });
  };

  // manage total pages

  async function handleTotalPages() {
    if (currentPage < 0) {
      setCurrentPage(0);
    }
  }

  async function handlePagination(page: any): Promise<void> {
    // const skip = currentPage * Number(take);
    // let parametersFilter;
    // if (orderType) {
    //   parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
    // } else {
    //   parametersFilter = `skip=${skip}&take=${take}`;
    // }
    // if (filter) {
    //   parametersFilter = `${parametersFilter}&${filter}`;
    // }
    // await typeAssayService
    //   .getAll(parametersFilter)
    //   .then(({ status, response }) => {
    //     if (status === 200) {
    //       setTypeAssay(response);
    //     }
    //   });
    await callingApi(filter, page); // handle pagination globly
  }

  // Checking defualt values

  function checkValue(value: any) {
    const parameter = tableGlobalFunctions.getValuesForFilter(
      value,
      filtersParams,
    );

    return parameter;
  }

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  return (
    <>
      {loading && <ComponentLoading text="" />}

      <Head>
        <title>Listagem Tipos de Ensaios</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main className="h-full w-full flex flex-col items-start gap-4 overflow-y-hidden">
          <AccordionFilter
            title="Filtrar tipos de ensaios"
            onChange={(_, e) => setStatusAccordionFilter(e)}
          >
            <div className="w-full flex gap-2">
              <form
                className="flex flex-col w-full items-center px-4 bg-white"
                onSubmit={formik.handleSubmit}
              >
                <div className="w-full h-full flex justify-center pb-2">
                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Status
                    </label>

                    <Select
                      name="filterStatus"
                      onChange={formik.handleChange} // defaultValue={filterStatusBeforeEdit[13]}
                      defaultValue={filterStatusBeforeEdit[13]}
                      values={filters.map((id) => id)}
                      selected="1"
                    />
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome
                    </label>

                    <Input
                      type="text"
                      placeholder="Nome"
                      id="filterName"
                      name="filterName"
                      defaultValue={checkValue('filterName')}
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="h-6 w-1/2 ml-2">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Quant de sementes por envelope
                    </label>

                    <div className="flex gap-2">
                      <div className="w-full">
                        <Input
                          type="number"
                          placeholder="De"
                          id="filterSeedsFrom"
                          name="filterSeedsFrom"
                          defaultValue={checkValue('filterSeedsFrom')}
                          onChange={formik.handleChange}
                        />
                      </div>

                      <div className="w-full">
                        <Input
                          type="number"
                          placeholder="Até"
                          id="filterSeedsTo"
                          name="filterSeedsTo"
                          defaultValue={checkValue('filterSeedsTo')}
                          onChange={formik.handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <FieldItemsPerPage selected={take} onChange={setTake} />

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
          <div className="w-full h-full">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={typeAssay}
              options={{
                showTitle: false,
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 410 : 320
                }px)`,
                headerStyle: {
                  zIndex: 1,
                },
                rowStyle: { background: '#f9fafb', height: 35 },
                search: false,
                filtering: false,
                pageSize: Number(take),
              }}
              components={{
                Toolbar: () => (
                  <div className="w-full max-h-96 flex items-center justify-between gap-4 bg-gray-50 py-2  px-5 border-solid border-b border-gray-200 ">
                    <div className="h-12">
                      <Button
                        title="Cadastrar Tipo Ensaio"
                        value="Cadastrar Tipo Ensaio"
                        bgColor="bg-blue-600"
                        style={{
                          display: !perm_can_do(
                            '/config/ensaio/tipo-ensaio',
                            'create',
                          )
                            ? 'none'
                            : '',
                        }}
                        textColor="white"
                        onClick={() => {
                          setCookies('pageBeforeEdit', currentPage?.toString());
                          setCookies('filterBeforeEdit', filter);
                          setCookies('filterBeforeEditTypeOrder', typeOrder);
                          setCookies('filterBeforeEditOrderBy', orderBy);
                          setCookies('filtersParams', filtersParams);
                          setCookies('takeBeforeEdit', take);
                          setCookies('lastPage', 'cadastro');
                          router.push('tipo-ensaio/cadastro ');
                        }}
                        // href="/config/ensaio/tipo-ensaio/cadastro"
                        icon={<RiOrganizationChart size={20} />}
                      />
                    </div>

                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="h-full flex items-center gap-2">
                      <ManageFields
                        statusAccordionExpanded={false}
                        generatesPropsDefault={generatesProps}
                        camposGerenciadosDefault={camposGerenciadosDefault}
                        preferences={preferences}
                        preferencesDefault={preferencesDefault}
                        userLogado={userLogado}
                        label="Gerenciar Campos"
                        table={table}
                        module_name={module_name}
                        module_id={module_id}
                        identifier_preference={identifier_preference}
                        OnSetStatusAccordion={(e: any) => {
                          setStatusAccordion(e);
                        }}
                        OnSetGeneratesProps={(e: any) => {
                          setGeneratesProps(e);
                        }}
                        OnSetCamposGerenciados={(e: any) => {
                          setCamposGerenciados(e);
                        }}
                        OnColumnsOrder={(e: any) => {
                          columns(e);
                        }}
                        OnSetUserLogado={(e: any) => {
                          setUserLogado(e);
                        }}
                        OnSetPreferences={(e: any) => {
                          setPreferences(e);
                        }}
                      />

                      <div className="h-12 flex items-center justify-center w-full">
                        <Button
                          title="Exportar planilha de ensaios"
                          icon={<RiFileExcel2Line size={20} />}
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {
                            downloadExcel();
                          }}
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
                      onClick={() => handlePagination(0)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<MdFirstPage size={18} />}
                      disabled={currentPage < 1}
                    />

                    <Button
                      onClick={() => handlePagination(currentPage - 1)}
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
                          onClick={() => handlePagination(index)}
                          value={`${currentPage + 1}`}
                          bgColor="bg-blue-600"
                          textColor="white"
                          disabled
                        />
                      ))}

                    <Button
                      onClick={() => handlePagination(currentPage + 1)}
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<BiRightArrow size={15} />}
                      disabled={currentPage + 1 >= pages}
                    />

                    <Button
                      onClick={() => handlePagination(pages - 1)}
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
  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const { safraId } = req.cookies;
  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;

  // Last page

  const lastPageServer = req.cookies.lastPage ? req.cookies.lastPage : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No' || req.cookies.urlPage !== 'ensaio') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
    removeCookies('itensPage', { req, res });
  }

  const itensPerPage = req.cookies.takeBeforeEdit
    ? req.cookies.takeBeforeEdit
    : 10;

  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
    : `filterStatus=1&id_culture=${idCulture}&id_safra=${safraId}`;
  // RR

  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'desc';
  // RR

  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : 'name';
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/type-assay`;
  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `filterStatus=1&id_culture=${idCulture}&id_safra=${safraId}`;
  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });
  removeCookies('takeBeforeEdit', { req, res });
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${idCulture}&id_safra=${safraId}`;
  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allTypeAssay = [], total: totalItems = 0 } = await fetch(
    urlParameters.toString(),
    requestOptions,
  ).then((response) => response.json());

  return {
    props: {
      allTypeAssay,
      totalItems,
      itensPerPage,
      filterApplication,
      idCulture,
      safraId,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver,
      typeOrderServer,
    },
  };
};
