/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  useState, ReactNode, useEffect, useRef,
} from 'react';
import { IoMdArrowBack } from 'react-icons/io';
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
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import {
  genotipoService,
  loteService,
  userPreferencesService,
} from '../../../../services';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import {
  Button,
  Content,
  Input,
  AccordionFilter,
  CheckBox,
  ManageFields,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';
import headerTableFactoryGlobal from '../../../../shared/utils/headerTableFactory';
import ComponentLoading from '../../../../components/Loading';
import { tableGlobalFunctions } from '../../../../helpers';

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
export interface IUpdateGenotipo {
  id: number;
  id_culture: number;
  id_dados: string;
  name_genotipo: string;
  name_main: string;
  name_public: string;
  name_experiment: string;
  name_alter: string;
  elit_name: string;
  type: string;
  cruza: string;
  cod_tec: string;
  tecnologia?: object | any;
  status: number;
  gmr: any;
  bgm: number;
  progenitor_f_direto: string;
  progenitor_m_direto: string;
  progenitor_f_origem: string;
  progenitor_m_origem: string;
  progenitores_origem: string;
  parentesco_completo: string;
}

export interface LoteGenotipo {
  id: number;
  id_culture: number;
  id_genotipo: number;
  genealogy: string;
  name: string;
  volume: number;
  status?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allLote: LoteGenotipo[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  idGenotipo: number;
  genotipo: IUpdateGenotipo;
  typeOrderServer: any | string; // RR
  orderByserver: any | string; // RR
}

export default function Atualizargenotipo({
  allLote,
  totalItems,
  itensPerPage,
  filterApplication,
  idGenotipo,
  genotipo,
  typeOrderServer, // RR
  orderByserver,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const router = useRouter();

  const formik = useFormik<IUpdateGenotipo>({
    initialValues: {
      id: genotipo.id,
      id_culture: genotipo.id_culture,
      cruza: genotipo.cruza,
      cod_tec: `${genotipo.tecnologia.cod_tec} ${genotipo.tecnologia.name}`,
      status: genotipo.status,
      id_dados: genotipo.id_dados,
      name_genotipo: genotipo.name_genotipo,
      name_main: genotipo.name_main,
      name_public: genotipo.name_public,
      name_experiment: genotipo.name_experiment,
      name_alter: genotipo.name_alter,
      elit_name: genotipo.elit_name,
      type: genotipo.type,
      gmr: genotipo.gmr ? Number(genotipo.gmr).toFixed(1) : '',
      bgm: genotipo.bgm,
      progenitor_f_direto: genotipo.progenitor_f_direto,
      progenitor_m_direto: genotipo.progenitor_m_direto,
      progenitor_f_origem: genotipo.progenitor_f_origem,
      progenitor_m_origem: genotipo.progenitor_m_origem,
      progenitores_origem: genotipo.progenitores_origem,
      parentesco_completo: genotipo.parentesco_completo,
    },
    onSubmit: async () => {
      await genotipoService
        .update({
          id: genotipo.id,
          id_culture: formik.values.id_culture,
          cruza: formik.values.cruza,
          status: genotipo.status,
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire('Genótipo atualizado com sucesso!');
            router.back();
          } else {
            Swal.fire(response.message);
          }
        });
    },
  });

  const [userLogado, setUserLogado] = useState<any>(
    JSON.parse(localStorage.getItem('user') as string),
  );
  const table = 'lote';
  const module_name = 'lote';
  const module_id = 12;
  // identificador da preferencia do usuario, usado em casos que o formulário tem tabela de subregistros; atualizar de experimento com parcelas;
  const identifier_preference = module_name + router.route;
  const camposGerenciadosDefault = 'id,year,cod_lote,ncc,fase,peso,quant_sementes';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [lotes, setLotes] = useState<LoteGenotipo[]>(() => allLote);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [orderList, setOrder] = useState<number>(
    typeOrderServer == 'desc' ? 1 : 2,
  );
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [statusAccordionFilter, setStatusAccordionFilter] = useState<boolean>(true);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Ano', value: 'year' },
    { name: 'CamposGerenciados[]', title: 'Cod lote', value: 'cod_lote' },
    { name: 'CamposGerenciados[]', title: 'NCC', value: 'ncc' },
    { name: 'CamposGerenciados[]', title: 'Fase', value: 'fase' },
    { name: 'CamposGerenciados[]', title: 'Peso (kg)', value: 'peso' },
    {
      name: 'CamposGerenciados[]',
      title: 'Quant sementes',
      value: 'quant_sementes',
    },
  ]);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const [fieldOrder, setFieldOrder] = useState<any>(orderByserver);
  const [typeOrder, setTypeOrder] = useState<string>('');

  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const tableRef = useRef<any>(null);

  useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async (values) => {
      const parametersFilter = `filterStatus=${values.filterStatus}&filterSearch=${values.filterSearch}&id_genotipo=${idGenotipo}`;
      await loteService
        .getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`)
        .then((response: LoteGenotipo[]) => {
          setLotes(response);
          setTotaItems(response.length);
          setFilter(parametersFilter);
        });
    },
  });

  // Calling common API
  async function callingApi(parametersFilter: any, page: any = 0) {
    setCurrentPage(page);

    parametersFilter = `${parametersFilter}&skip=${
      page * Number(take)
    }&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;

    setLoading(true);

    await loteService
      .getAll(parametersFilter)
      .then((response) => {
        if (
          response.status === 200
          || (response.status === 400 && response.total == 0)
        ) {
          setLotes(response.response);
          setTotaItems(response.total);
          tableRef.current?.dataManager.changePageSize(
            response.total >= take ? take : response.total,
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          title: 'Falha ao buscar lotes',
          html: `Ocorreu um erro ao buscar lotes. Tente novamente mais tarde.`,
          width: '800',
        });
      });

    setLoading(false);
  }

  async function handleOrder(
    column: string,
    order: string | any,
    name: any,
  ): Promise<void> {
    // Gobal manage orders
    const {
      typeOrderG, columnG, orderByG, arrowOrder,
    } = await tableGlobalFunctions.handleOrderG(column, order, orderList);

    setFieldOrder(columnG);
    setTypeOrder(typeOrderG);
    setOrderBy(columnG);
    // eslint-disable-next-line no-unused-expressions, no-nested-ternary
    typeOrderG !== '' ? (typeOrderG == 'desc' ? setOrder(1) : setOrder(2)) : '';
    setArrowOrder(arrowOrder);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }

  // Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);

  function idHeaderFactory() {
    return {
      title: <div className="flex items-center">{arrowOrder}</div>,
      field: 'id',
      width: 0,
      sorting: false,
      render: () => (colorStar === '#eba417' ? (
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
      ) : (
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
      )),
    };
  }

  function formatPeso(num: number) {
    return num ? Number(num).toFixed(5) : '';
  }

  function columnsOrder(columnsCampos: string) {
    const columnCampos: string[] = columnsCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === 'year') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Ano',
            title: 'year',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'cod_lote') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Cod lote',
            title: 'cod_lote',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'ncc') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'NCC',
            title: 'ncc',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'fase') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Fase',
            title: 'fase',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
      if (columnCampos[index] === 'peso') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Peso',
            title: 'peso',
            orderList,
            fieldOrder,
            handleOrder,
            render: (rowData: any) => formatPeso(rowData.peso),
          }),
        );
      }
      if (columnCampos[index] === 'quant_sementes') {
        tableFields.push(
          headerTableFactoryGlobal({
            name: 'Quant sementes',
            title: 'quant_sementes',
            orderList,
            fieldOrder,
            handleOrder,
          }),
        );
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

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
          module_id: 12,
        })
        .then((response) => {
          userLogado.preferences.lote = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          preferences.id = response.response.id;
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.lote = {
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
    setLoading(true);
    const skip = 0;
    const take = 10;

    const filterParam = `${filter}&skip=${skip}&take=${take}&createFile=true`;

    await loteService.getAll(filterParam).then(({ status, response }) => {
      if (!response.A1) {
        Swal.fire('Nenhum dado para extrair');
        return;
      }
      if (status === 200) {
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, response, 'lotes');

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
        XLSX.writeFile(workBook, 'Lotes.xlsx');
      } else {
        Swal.fire('Não existem registros para serem exportados, favor checar.');
      }
    });
    setLoading(false);
  };

  function handleTotalPages(): void {
    if (currentPage < 0) {
      setCurrentPage(0);
    } else if (currentPage >= pages) {
      setCurrentPage(pages - 1);
    }
  }

  async function handlePagination(page: any): Promise<void> {
    await callingApi(filter, page); // handle pagination globly
  }

  // useEffect(() => {
  //   handlePagination();
  //   handleTotalPages();
  // }, [currentPage]);

  return (
    <>
      <Head>
        <title>Atualizar genótipo</title>
      </Head>

      {loading && <ComponentLoading text="" />}

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main className="w-full flex flex-col items-start gap-0 overflow-y-hidden">
          <AccordionFilter
            title=""
            grid
            full
            onChange={(_, e) => setStatusAccordionFilter(e)}
          >
            <form
              className="w-full bg-white px-0 pt-0 pb-0 mt-0"
              onSubmit={formik.handleSubmit}
            >
              <div className="rounded border-inherit text-sm">
                <span>Informações do material</span>
                <hr />
              </div>
              <div className="w-full flex justify-between items-start gap-5 mt-3">
                <div className="w-2/4 grid grid-cols-3 gap-2">
                  <div className="w-full ">
                    <label className="block text-gray-900 text-xs font-bold mb-1">
                      Nome genótipo
                    </label>
                    <Input
                      required
                      style={{ background: '#e5e7eb' }}
                      disabled
                      id="name_genotipo"
                      name="name_genotipo"
                      onChange={formik.handleChange}
                      value={formik.values.name_genotipo}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-gray-900 text-xs font-bold mb-1">
                      Nome principal
                    </label>
                    <Input
                      required
                      style={{ background: '#e5e7eb' }}
                      disabled
                      id="name_main"
                      name="name_main"
                      onChange={formik.handleChange}
                      value={formik.values.name_main}
                    />
                  </div>
                  <div className="w-full ">
                    <label className="block text-gray-900 text-xs font-bold mb-1">
                      Nome publico
                    </label>
                    <Input
                      style={{ background: '#e5e7eb' }}
                      disabled
                      id="name_public"
                      name="name_public"
                      onChange={formik.handleChange}
                      value={formik.values.name_public}
                    />
                  </div>
                </div>
                <div className="w-2/4 flex justify-end">
                  <div className="w-2/4 flex flex-wrap gap-2">
                    <div className="flex-1">
                      <label className="block text-gray-900 text-xs font-bold mb-1">
                        Tecnologia
                      </label>
                      <Input
                        style={{ background: '#e5e7eb' }}
                        disabled
                        id="cod_tec"
                        name="cod_tec"
                        onChange={formik.handleChange}
                        value={formik.values.cod_tec}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-between items-start gap-5 mt-3">
                <div className="w-2/4 grid grid-cols-3 gap-2">
                  <div className="w-full ">
                    <label className="block text-gray-900 text-xs font-bold mb-1">
                      Nome experimental
                    </label>
                    <Input
                      required
                      style={{ background: '#e5e7eb' }}
                      disabled
                      id="name_experiment"
                      name="name_experiment"
                      onChange={formik.handleChange}
                      value={formik.values.name_experiment}
                    />
                  </div>
                  <div className="w-full ">
                    <label className="block text-gray-900 text-xs font-bold mb-1">
                      Nome alternativo
                    </label>
                    <Input
                      required
                      style={{ background: '#e5e7eb' }}
                      disabled
                      id="name_alter"
                      name="name_alter"
                      onChange={formik.handleChange}
                      value={formik.values.name_alter}
                    />
                  </div>
                  <div className="w-full ">
                    <label className="block text-gray-900 text-xs font-bold mb-1">
                      Elite nome
                    </label>
                    <Input
                      style={{ background: '#e5e7eb' }}
                      disabled
                      id="elit_name"
                      name="elit_name"
                      onChange={formik.handleChange}
                      value={formik.values.elit_name}
                    />
                  </div>
                </div>

                <div className="w-2/4 flex justify-end">
                  <div className="w-2/4 flex flex-wrap gap-2">
                    <div className="w-1/4">
                      <label className="block text-gray-900 text-xs font-bold mb-1">
                        Tipo
                      </label>
                      <Input
                        style={{ background: '#e5e7eb' }}
                        disabled
                        id="type"
                        name="type"
                        onChange={formik.handleChange}
                        value={formik.values.type}
                      />
                    </div>
                    <div className="flex w-2/4 gap-5">
                      <div className="w-full ">
                        <label className="block text-gray-900 text-xs font-bold mb-1">
                          GMR
                        </label>
                        <Input
                          style={{ background: '#e5e7eb' }}
                          disabled
                          id="gmr"
                          name="gmr"
                          onChange={formik.handleChange}
                          value={formik.values.gmr}
                        />
                      </div>
                      <div className="w-full ">
                        <label className="block text-gray-900 text-xs font-bold mb-1">
                          BGM
                        </label>
                        <Input
                          style={{ background: '#e5e7eb' }}
                          disabled
                          id="bgm"
                          name="bgm"
                          onChange={formik.handleChange}
                          value={formik.values.bgm}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="rounded border-inherit text-sm"
                style={{ marginTop: '1%' }}
              >
                <span>Informações dos progenitores</span>
                <hr />
              </div>
              <div className="w-full flex justify-between items-start gap-2 mt-3">
                <div className="w-full ">
                  <label className="block text-gray-900 text-xs font-bold mb-1">
                    Cruza de origem
                  </label>
                  <Input
                    required
                    style={{ background: '#e5e7eb' }}
                    disabled
                    id="cruza"
                    name="cruza"
                    onChange={formik.handleChange}
                    value={formik.values.cruza}
                  />
                </div>
                <div className="w-full ">
                  <label className="block text-gray-900 text-xs font-bold mb-1">
                    Progenitor F direto
                  </label>
                  <Input
                    required
                    style={{ background: '#e5e7eb' }}
                    disabled
                    id="progenitor_f_direto"
                    name="progenitor_f_direto"
                    onChange={formik.handleChange}
                    value={formik.values.progenitor_f_direto}
                  />
                </div>
                <div className="w-full ">
                  <label className="block text-gray-900 text-xs font-bold mb-1">
                    Progenitor M direto
                  </label>
                  <Input
                    style={{ background: '#e5e7eb' }}
                    disabled
                    id="progenitor_m_direto"
                    name="progenitor_m_direto"
                    onChange={formik.handleChange}
                    value={formik.values.progenitor_m_direto}
                  />
                </div>
                <div className="w-full ">
                  <label className="block text-gray-900 text-xs font-bold mb-1">
                    Progenitor F de origem
                  </label>
                  <Input
                    style={{ background: '#e5e7eb' }}
                    disabled
                    id="progenitor_f_origem"
                    name="progenitor_f_origem"
                    onChange={formik.handleChange}
                    value={formik.values.progenitor_f_origem}
                  />
                </div>
                <div className="w-full ">
                  <label className="block text-gray-900 text-xs font-bold mb-1">
                    Progenitor M de origem:
                  </label>
                  <Input
                    style={{ background: '#e5e7eb' }}
                    disabled
                    id="progenitor_m_origem"
                    name="progenitor_m_origem"
                    onChange={formik.handleChange}
                    value={formik.values.progenitor_m_origem}
                  />
                </div>
                <div className="w-full ">
                  <label className="block text-gray-900 text-xs font-bold mb-1">
                    Progenitores de origem:
                  </label>
                  <Input
                    style={{ background: '#e5e7eb' }}
                    disabled
                    id="progenitores_origem"
                    name="progenitores_origem"
                    onChange={formik.handleChange}
                    value={formik.values.progenitores_origem}
                  />
                </div>
              </div>
              <div className="w-full flex justify-between items-start gap-2 mt-3">
                <div className="w-3/4 ">
                  <label className="block text-gray-900 text-xs font-bold mb-1">
                    Parentesco completo
                  </label>
                  <Input
                    style={{ background: '#e5e7eb' }}
                    disabled
                    id="parentesco_completo"
                    name="parentesco_completo"
                    onChange={formik.handleChange}
                    value={formik.values.parentesco_completo}
                  />
                </div>
                <div className="w-40 h-7" style={{ marginTop: '1%' }}>
                  <Button
                    type="button"
                    value="Voltar"
                    bgColor="bg-red-600"
                    textColor="white"
                    icon={<IoMdArrowBack size={18} />}
                    onClick={() => router.back()}
                  />
                </div>
              </div>
            </form>
          </AccordionFilter>

          <div style={{ marginTop: '1%' }} className="w-full h-auto">
            <MaterialTable
              tableRef={tableRef}
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={lotes}
              options={{
                showTitle: false,
                // maxBodyHeight: "calc(100vh - 585px)",
                maxBodyHeight: `calc(100vh - ${
                  statusAccordionFilter ? 630 : 320
                }px)`,
                headerStyle: {
                  zIndex: 1,
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
                    <div className="h-12" />
                    <strong className="text-blue-600">
                      Total registrado:
                      {' '}
                      {itemsTotal}
                    </strong>

                    <div className="flex items-center gap-2">
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
                          columnsOrder(e);
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
                          title="Exportar planilha de lotes"
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
                      onClick={() => {
                        handlePagination(currentPage - 1);
                      }}
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
                      bgColor="bg-blue-600 RR"
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 5;

  const { token } = context.req.cookies;

  const { publicRuntimeConfig } = getConfig();
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const baseUrl = `${publicRuntimeConfig.apiUrl}/genotipo`;
  const apiGenotipo = await fetch(
    `${baseUrl}/${context.query.id}`,
    requestOptions,
  );
  const genotipo = await apiGenotipo.json();

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const baseUrlLote = `${publicRuntimeConfig.apiUrl}/lote`;
  const urlParameters: any = new URL(baseUrlLote);
  urlParameters.search = new URLSearchParams(param).toString();

  const idGenotipo = Number(context.query.id);
  const filterApplication = `filterStatus=1&id_genotipo=${idGenotipo}`;

  const response = await fetch(
    `${baseUrlLote}?id_genotipo=${idGenotipo}`,
    requestOptions,
  );

  const { response: allLote, total: totalItems } = await response.json();
  return {
    props: {
      genotipo,
      allLote,
      totalItems,
      itensPerPage,
      filterApplication,
      idGenotipo,
    },
  };
};
