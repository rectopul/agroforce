/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
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
import { RiFileExcel2Line, RiOrganizationChart } from 'react-icons/ri';
<<<<<<< HEAD
import handleStatusGlobal from 'src/shared/utils/handleStatusGlobal';
=======
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
import * as XLSX from 'xlsx';
import {
  AccordionFilter,
  Button,
  CheckBox,
  Content,
  Input,
  Select,
<<<<<<< HEAD
<<<<<<< Updated upstream
} from "../../../../components";
import { UserPreferenceController } from "../../../../controllers/user-preference.controller";
import { typeAssayService, userPreferencesService } from "../../../../services";
import * as ITabs from "../../../../shared/utils/dropdown";
=======
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import { typeAssayService, userPreferencesService } from '../../../../services';
import * as ITabs from '../../../../shared/utils/dropdown';
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
import { tableGlobalFunctions } from '../../../../helpers';
=======
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import { typeAssayService, userPreferencesService } from '../../../../services';
import * as ITabs from '../../../../shared/utils/dropdown';
>>>>>>> Stashed changes

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
  idSafra: string;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string;
  typeOrderServer :any| string, // RR
  orderByserver : any |string // RR
}

export default function TipoEnsaio({
  allTypeAssay,
  itensPerPage,
  filterApplication,
  totalItems,
  idCulture,
  idSafra,
  pageBeforeEdit,
  filterBeforeEdit,
  typeOrderServer, // RR
  orderByserver, // RR
}: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'ENSAIO' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.tipo_ensaio || {
    id: 0,
    table_preferences: 'id,name,protocol_name,envelope,status',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [typeAssay, setTypeAssay] = useState<ITypeAssayProps[]>(
    () => allTypeAssay,
  );
  const [currentPage, setCurrentPage] = useState<number>(
    Number(pageBeforeEdit),
  );
  const [orderList, setOrder] = useState<number>(1);
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [filter, setFilter] = useState<any>(filterApplication);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // {
    //   name: 'CamposGerenciados[]',
    //   title: 'Favorito ',
    //   value: 'id',
    //   defaultChecked: () => camposGerenciados.includes('id'),
    // },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome',
      value: 'name',
      defaultChecked: () => camposGerenciados.includes('name'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome do Protocolo',
      value: 'protocol_name',
      defaultChecked: () => camposGerenciados.includes('protocol_name'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Quant. de sementes por envelope',
      value: 'envelope',
      defaultChecked: () => camposGerenciados.includes('envelope'),
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Status',
      value: 'status',
      defaultChecked: () => camposGerenciados.includes('status'),
    },
  ]);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
<<<<<<< HEAD
<<<<<<< Updated upstream
  const [colorStar, setColorStar] = useState<string>("");
  // const [orderBy, setOrderBy] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("");
=======
  const [colorStar, setColorStar] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
>>>>>>> Stashed changes
=======
  const [colorStar, setColorStar] = useState<string>('');
  // const [orderBy, setOrderBy] = useState<string>("");
  const [orderType, setOrderType] = useState<string>('');
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
  const router = useRouter();
  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy, setOrderBy] = useState<string>(orderByserver); // RR
  const [typeOrder, setTypeOrder] = useState<string>(typeOrderServer); // RR
  const pathExtra = `skip=${currentPage * Number(take)}&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`; // RR

  const filters = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatusBeforeEdit = filterBeforeEdit.split('');

  const formik = useFormik<IFilter>({
    initialValues: {
<<<<<<< Updated upstream
      filterStatus: filterStatusBeforeEdit[13],
      filterName: checkValue('filterName'),
<<<<<<< HEAD
      filterProtocolName:  checkValue('filterProtocolName'),
      filterSeedsTo:  checkValue('filterSeedsTo'),
      filterSeedsFrom:  checkValue('filterSeedsFrom'),
      orderBy: "",
      typeOrder: "",
=======
      filterStatus: '',
      filterName: '',
      filterProtocolName: '',
      filterSeedsTo: '',
      filterSeedsFrom: '',
      orderBy: '',
      typeOrder: '',
>>>>>>> Stashed changes
=======
      filterProtocolName: checkValue('filterProtocolName'),
      filterSeedsTo: checkValue('filterSeedsTo'),
      filterSeedsFrom: checkValue('filterSeedsFrom'),
      orderBy: '',
      typeOrder: '',
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
    },
    onSubmit: async ({
      filterStatus,
      filterName,
      filterProtocolName,
      filterSeedsTo,
      filterSeedsFrom,
    }) => {
      const parametersFilter = `filterStatus=${
        filterStatus || 1
      }&filterName=${filterName}&filterProtocolName=${filterProtocolName}&filterSeedsTo=${filterSeedsTo}&filterSeedsFrom=${filterSeedsFrom}&id_culture=${idCulture}`;
      setFiltersParams(parametersFilter);
<<<<<<< HEAD
<<<<<<< Updated upstream
      setCookies("filterBeforeEdit", filtersParams);
=======
      setCookies('filterBeforeEdit', filtersParams);
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45

      setFilter(parametersFilter);
      setCurrentPage(0);
      await callingApi(parametersFilter);

      // await typeAssayService
      //   .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
      //   .then((response) => {
      //     setFilter(parametersFilter);
      //     setTypeAssay(response.response);
      //     setTotalItems(response.total);
      //     setCurrentPage(0);
      //   });
    },
  });

  // Calling common API
  async function callingApi(parametersFilter : any) {
    setCookies('filterBeforeEdit', parametersFilter);
    setCookies('filterBeforeEditTypeOrder', typeOrder);
    setCookies('filterBeforeEditOrderBy', orderBy);
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies('filtersParams', parametersFilter);

    await typeAssayService.getAll(parametersFilter).then((response) => {
      if (response.status === 200 || response.status === 400) {
        setTypeAssay(response.response);
        setTotalItems(response.total);
      }
    });
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

<<<<<<< HEAD
=======
      setCookies('filterBeforeEdit', filtersParams);
      await typeAssayService
        .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
        .then((response) => {
          setFilter(parametersFilter);
          setTypeAssay(response.response);
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

  const filterStatusBeforeEdit = filterBeforeEdit.split('');

  async function handleStatus(id: number, data: any) {
    const params = `filterStatus=${1}&id_culture=${cultureId}&filterSearch=${data.name}`;
    const index: any = await handleStatusGlobal({
      id, status: data.status, service: focoService, params, table: 'foco', data: focos,
    });
    if (!index || index === -1) {
      return;
    }
    setFocos((oldFocos) => {
      const copy = [...oldFocos];
      copy[index].status = data.status;
      return copy;
    });
  }
>>>>>>> Stashed changes

=======
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
  async function handleOrder(
    column: string,
    order: string | any,
  ): Promise<void> {
<<<<<<< Updated upstream
    // let typeOrder: any;
    // let parametersFilter: any;
    // if (order === 1) {
    //   typeOrder = "asc";
    // } else if (order === 2) {
    //   typeOrder = "desc";
    // } else {
    //   typeOrder = "";
    // }
    // setOrderBy(column);
    // setOrderType(typeOrder);
    // if (filter && typeof filter !== "undefined") {
    //   if (typeOrder !== "") {
    //     parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
    //   } else {
    //     parametersFilter = filter;
    //   }
    // } else if (typeOrder !== "") {
    //   parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}`;
    // } else {
    //   parametersFilter = filter;
    // }
=======
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
>>>>>>> Stashed changes

    // await typeAssayService
    //   .getAll(`${parametersFilter}&skip=0&take=${take}`)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       setTypeAssay(response.response);
    //     }
    //   });

    // if (orderList === 2) {
    //   setOrder(0);
    //   setArrowOrder(<AiOutlineArrowDown />);
    // } else {
    //   setOrder(orderList + 1);
    //   if (orderList === 1) {
    //     setArrowOrder(<AiOutlineArrowUp />);
    //   } else {
    //     setArrowOrder("");
    //   }
    // }

    // Gobal manage orders
    const {
      typeOrderG, columnG, orderByG, arrowOrder,
    } = await tableGlobalFunctions.handleOrderG(column, order, orderList);

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
=======
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    setOrder(orderByG);
    setArrowOrder(arrowOrder);
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
  }

  async function handleStatus(id: number, status: any): Promise<void> {
    if (status) {
      status = 1;
    } else {
      status = 0;
    }

    await typeAssayService.update({ id, status });

    const index = typeAssay.findIndex(
      (typeAssayIndex) => typeAssayIndex.id === id,
    );

    if (index === -1) {
      return;
    }

    setTypeAssay((oldUser) => {
      const copy = [...oldUser];
      copy[index].status = status;
      return copy;
    });
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
<<<<<<< HEAD
<<<<<<< Updated upstream
      filterPlaceholder: "Filtrar por status",
      render: (rowData: ITypeAssayProps) =>
        rowData.status ? (
          <div className="h-7 flex">
            <div className="h-7">
              <Button
                icon={<BiEdit size={14} />}
                title={`Atualizar ${rowData.name}`}
                onClick={() => {
                  setCookies("pageBeforeEdit", currentPage?.toString());
                  setCookies("filterBeforeEdit", filter);
                  setCookies("filterBeforeEditTypeOrder", typeOrder);
                  setCookies("filterBeforeEditOrderBy", orderBy);
                  setCookies("filtersParams", filtersParams);
                  setCookies("lastPage", "atualizar");
                  router.push(
                    `/config/ensaio/tipo-ensaio/atualizar?id=${rowData.id}`
                  );
                }}
                bgColor="bg-blue-600"
                textColor="white"
              />
            </div>
            <div style={{ width: 5 }} />
            <div>
              <Button
                title="Ativo"
                icon={<FaRegThumbsUp size={14} />}
                onClick={() => handleStatus(rowData.id, !rowData.status)}
                bgColor="bg-green-600"
                textColor="white"
              />
            </div>
=======
=======
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
      filterPlaceholder: 'Filtrar por status',
      render: (rowData: ITypeAssayProps) => (rowData.status ? (
        <div className="h-7 flex">
          <div className="h-7">
            <Button
              icon={<BiEdit size={14} />}
              title={`Atualizar ${rowData.name}`}
              onClick={() => {
                setCookies('pageBeforeEdit', currentPage?.toString());
<<<<<<< HEAD
                setCookies('filterBeforeEdit', filtersParams);
=======
                setCookies('filterBeforeEdit', filter);
                setCookies('filterBeforeEditTypeOrder', typeOrder);
                setCookies('filterBeforeEditOrderBy', orderBy);
                setCookies('filtersParams', filtersParams);
                setCookies('lastPage', 'atualizar');
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
                router.push(
                  `/config/ensaio/tipo-ensaio/atualizar?id=${rowData.id}`,
                );
              }}
              bgColor="bg-blue-600"
              textColor="white"
            />
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
          </div>
          <div style={{ width: 5 }} />
          <div>
            <Button
              title="Ativo"
              icon={<FaRegThumbsUp size={14} />}
              onClick={() => handleStatus(rowData.id, !rowData.status)}
              bgColor="bg-green-600"
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
              bgColor="bg-blue-600"
              textColor="white"
              href={`/config/ensaio/tipo-ensaio/atualizar?id=${rowData.id}`}
            />
          </div>
          <div style={{ width: 5 }} />
          <div>
            <Button
              title="Inativo"
              icon={<FaRegThumbsDown size={14} />}
              onClick={() => handleStatus(rowData.id, !rowData.status)}
              bgColor="bg-red-800"
              textColor="white"
            />
          </div>
        </div>
      )),
    };
  }

  function colums(columnsOrder: any): any {
    const columnOrder: any = columnsOrder.split(',');
    const tableFields: any = [];
    Object.keys(columnOrder).forEach((item) => {
      // if (columnOrder[item] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnOrder[item] === 'name') {
        tableFields.push(headerTableFactory('Nome', 'name'));
      }
      if (columnOrder[item] === 'protocol_name') {
        tableFields.push(
          headerTableFactory('Nome do Protocolo', 'protocol_name'),
        );
      }
      if (columnOrder[item] === 'envelope') {
        tableFields.push(
          headerTableFactory(
            'Quant. de sementes por envelope',
            'envelope.seeds',
          ),
        );
      }
      if (columnOrder[item] === 'status') {
        tableFields.push(statusHeaderFactory());
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
    await typeAssayService
      .getAll(filter)
      .then(({ status, response }) => {
        if (status === 200) {
          const newData = response.map((row: any) => {
            const newRow = row;
            newRow.envelope = row.envelope.seeds;
            newRow.status = row.status === 0 ? 'Inativo' : 'Ativo';

            newRow.NOME = newRow.name;
            newRow.NOME_PROTOCOLO = newRow.protocol_name;
            newRow.QUANT_SEMENTES = newRow.envelope;
            newRow.STATUS = newRow.status;

            delete newRow.name;
            delete newRow.protocol_name;
            delete newRow.envelope;
            delete newRow.status;
            delete newRow.id;
            return newRow;
          });

          const workSheet = XLSX.utils.json_to_sheet(newData);
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
          XLSX.writeFile(workBook, 'Tipo_Ensaio.xlsx');
        }
      });
  };

  // manage total pages
  async function handleTotalPages() {
    if (currentPage < 0) {
      setCurrentPage(0);
    }
  }

  async function handlePagination(): Promise<void> {
    // const skip = currentPage * Number(take);
    // let parametersFilter;
    // if (orderType) {
    //   parametersFilter = `skip=${skip}&take=${take}&orderBy=${orderBy}&typeOrder=${orderType}`;
    // } else {
    //   parametersFilter = `skip=${skip}&take=${take}`;
    // }

    // if (filter) {
    //   parametersFilter = `${parametersFilter}&${filter}`;
    // }
    // await typeAssayService
    //   .getAll(parametersFilter)
    //   .then(({ status, response }) => {
    //     if (status === 200) {
    //       setTypeAssay(response);
    //     }
    //   });
    await callingApi(filter); // handle pagination globly
  }

  // Checking defualt values
  function checkValue(value: any) {
    const parameter = tableGlobalFunctions.getValuesForFilter(value, filtersParams);
    return parameter;
  }

  function filterFieldFactorySeeds(name: any) {
    return (
      <div className="h-6 w-1/2 ml-4">
        <label className="block text-gray-900 text-sm font-bold mb-1">
          {name}
        </label>
        <div className="flex gap-2">
          <div className="w-full">
            <Input
              type="text"
              placeholder="De"
              max="40"
              id="filterSeedsFrom"
              name="filterSeedsFrom"
              onChange={formik.handleChange}
            />
          </div>
          <div className="w-full">
            <Input
              type="text"
              placeholder="Até"
              max="40"
              id="filterSeedsTo"
              name="filterSeedsTo"
              onChange={formik.handleChange}
            />
          </div>
        </div>
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
        <title>Listagem Tipos de Ensaio</title>
      </Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar tipos de ensaio">
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
                      // defaultValue={filterStatusBeforeEdit[13]}
                      defaultValue={checkValue('filterStatus')}
                      values={filters.map((id) => id)}
                      selected="1"
                    />
                  </div>

                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome
                    </label>
                    <Input
                      type="text"
                      placeholder="Nome"
                      max="40"
                      id="filterName"
                      name="filterName"
                      defaultValue={checkValue('filterName')}
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="h-6 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Nome do Protocolo
                    </label>
                    <Input
                      type="text"
                      placeholder="Nome do Protocolo"
                      max="40"
                      id="filterProtocolName"
                      name="filterProtocolName"
                      defaultValue={checkValue('filterProtocolName')}
                      onChange={formik.handleChange}
                    />
                  </div>

                  {filterFieldFactorySeeds('Quant. de sementes por envelope')}

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
              data={typeAssay}
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
                    <div className="h-12">
                      <Button
                        title="Cadastrar Tipo Ensaio"
                        value="Cadastrar Tipo Ensaio"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {}}
                        href="/config/ensaio/tipo-ensaio/cadastro"
                        icon={<RiOrganizationChart size={20} />}
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
<<<<<<< HEAD
<<<<<<< Updated upstream
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
                        .fill("")
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
                        onClick={() => setCurrentPage(pages-1)}
                        bgColor="bg-blue-600"
                        textColor="white"
                        icon={<MdLastPage size={18} />}
                        disabled={currentPage + 1 >= pages}
                      />
                    </div>
=======
=======
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
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
<<<<<<< HEAD
                      onClick={() => setCurrentPage(pages)}
=======
                      onClick={() => setCurrentPage(pages - 1)}
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
                      bgColor="bg-blue-600"
                      textColor="white"
                      icon={<MdLastPage size={18} />}
                      disabled={currentPage + 1 >= pages}
                    />
                  </div>
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45
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
  // eslint-disable-next-line max-len
  const itensPerPage = await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page;

  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;

  const pageBeforeEdit = req.cookies.pageBeforeEdit
    ? req.cookies.pageBeforeEdit
    : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit
    ? req.cookies.filterBeforeEdit
<<<<<<< Updated upstream
    : `filterStatus=1&id_culture=${idCulture}`;

  // Last page
  const lastPageServer = req.cookies.lastPage
    ? req.cookies.lastPage
    : 'No';

  if (lastPageServer == undefined || lastPageServer == 'No') {
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies('filterBeforeEditTypeOrder', { req, res });
    removeCookies('filterBeforeEditOrderBy', { req, res });
    removeCookies('lastPage', { req, res });
  }

  // RR
  const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
    ? req.cookies.filterBeforeEditTypeOrder
    : 'desc';

<<<<<<< HEAD
=======
    : 'filterStatus=1';
  const { token } = req.cookies;
  const idCulture = req.cookies.cultureId;
  const idSafra = req.cookies.safraId;
>>>>>>> Stashed changes
=======
  // RR
  const orderByserver = req.cookies.filterBeforeEditOrderBy
    ? req.cookies.filterBeforeEditOrderBy
    : 'name';
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/type-assay`;

  const filterApplication = req.cookies.filterBeforeEdit
    ? `${req.cookies.filterBeforeEdit}`
    : `filterStatus=1&id_culture=${idCulture}`;

<<<<<<< HEAD
<<<<<<< Updated upstream
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
  
    //RR
    removeCookies("filterBeforeEditTypeOrder", { req, res });
    removeCookies("filterBeforeEditOrderBy", { req, res });
    removeCookies("lastPage", { req, res });
=======
  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });
>>>>>>> Stashed changes
=======
  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  // RR
  removeCookies('filterBeforeEditTypeOrder', { req, res });
  removeCookies('filterBeforeEditOrderBy', { req, res });
  removeCookies('lastPage', { req, res });
>>>>>>> bd0cf8edac5d356b065dba0071eaa705058fcc45

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${idCulture}`;

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allTypeAssay, total: totalItems } = await fetch(
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
      idSafra,
      pageBeforeEdit,
      filterBeforeEdit,
      orderByserver,
      typeOrderServer,
    },
  };
};
