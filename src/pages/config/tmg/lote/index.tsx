/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { removeCookies, setCookies } from "cookies-next";
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
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
import { BiFilterAlt, BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { fetchWrapper } from 'src/helpers';
import {
  AccordionFilter, Button, CheckBox, Content, Input,
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import { loteService, userPreferencesService } from '../../../../services';
import ITabs from '../../../../shared/utils/dropdown';

interface IFilter {
  filterYearFrom: string | number;
  filterYearTo: string | number;
  filterSeedFrom: string | number;
  filterSeedTo: string | number;
  filterWeightFrom: string | any;
  filterWeightTo: string | any;
  filterGmrFrom: string | any;
  filterGmrTo: string | any;
  filterBgmFrom: string | any;
  filterBgmTo: string | any;
  filterYear: string;
  filterCodLote: string;
  filterNcc: string;
  filterFase: string;
  filterPeso: string;
  filterSeeds: string;
  filterGenotipo: string;
  filterMainName: string;
  filterGmr: string;
  filterBgm: string;
  filterTecnologiaCod: string | any;
  filterTecnologiaDesc: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export interface LoteGenotipo {
  id: number;
  id_culture: number;
  genealogy: string;
  name: string;
  volume: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allLote: LoteGenotipo[];
  totalItems: number;
  
  idSafra: number;
  idCulture : number;
  itensPerPage: number;
  typeOrderServer :any| string,
  orderByserver : any |string,
  filterApplication : any |string,
}



export default function Listagem({
  allLote,
  totalItems,
  idSafra,
  idCulture, 
  itensPerPage,
  typeOrderServer, 
  orderByserver,
  filterApplication

}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (tab.titleTab === 'TMG' ? (tab.statusTab = true) : (tab.statusTab = false)));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.lote || {
    id: 0,
    table_preferences:
      'id,year,cod_lote,ncc,fase,peso,quant_sementes,name_genotipo,name_main,gmr,bgm,tecnologia',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(
    preferences.table_preferences,
  );

  const [lotes, setLotes] = useState<LoteGenotipo[]>(() => allLote);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [orderList, setOrder] = useState<number>(1);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [filtersParams, setFiltersParams] = useState<any>(''); // Set filter Parameter

  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    // { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Ano', value: 'year' },
    { name: 'CamposGerenciados[]', title: 'Cód lote', value: 'cod_lote' },
    { name: 'CamposGerenciados[]', title: 'NCC', value: 'ncc' },
    { name: 'CamposGerenciados[]', title: 'Fase', value: 'fase' },
    { name: 'CamposGerenciados[]', title: 'Peso (kg)', value: 'peso' },
    {
      name: 'CamposGerenciados[]',
      title: 'Quant sementes',
      value: 'quant_sementes',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome genótipo',
      value: 'name_genotipo',
    },
    {
      name: 'CamposGerenciados[]',
      title: 'Nome principal',
      value: 'name_main',
    },
    { name: 'CamposGerenciados[]', title: 'GMR', value: 'gmr' },
    { name: 'CamposGerenciados[]', title: 'BGM', value: 'bgm' },
    { name: 'CamposGerenciados[]', title: 'Tecnologia', value: 'tecnologia' },
  ]);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');
  // const [orderBy, setOrderBy] = useState<string>('');
  // const [orderType, setOrderType] = useState<string>('');
  const take: number = itensPerPage;
  const total: number = itemsTotal <= 0 ? 1 : itemsTotal;
  const pages = Math.ceil(total / take);

  const [orderBy,setOrderBy]=useState<string>(orderByserver); //RR
  const [typeOrder,setTypeOrder]=useState<string>(typeOrderServer); //RR
  const pathExtra =`skip=${currentPage * Number(take)}&take=${take}&orderBy=${orderBy}&typeOrder=${typeOrder}`;  //RR

  const formik = useFormik<IFilter>({
    initialValues: {
      filterYearTo: '',
      filterYearFrom: '',
      filterSeedTo: '',
      filterSeedFrom: '',
      filterWeightTo: '',
      filterWeightFrom: '',
      filterGmrFrom: '',
      filterGmrTo: '',
      filterBgmTo: '',
      filterBgmFrom: '',
      filterYear: '',
      filterCodLote: '',
      filterNcc: '',
      filterFase: '',
      filterPeso: '',
      filterSeeds: '',
      filterGenotipo: '',
      filterMainName: '',
      filterGmr: '',
      filterBgm: '',
      filterTecnologiaCod: '',
      filterTecnologiaDesc: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterYearTo,
      filterYearFrom,
      filterSeedTo,
      filterSeedFrom,
      filterWeightTo,
      filterWeightFrom,
      filterGmrFrom,
      filterGmrTo,
      filterBgmTo,
      filterBgmFrom,
      filterYear,
      filterCodLote,
      filterNcc,
      filterFase,
      filterPeso,
      filterSeeds,
      filterGenotipo,
      filterMainName,
      filterGmr,
      filterBgm,
      filterTecnologiaCod,
      filterTecnologiaDesc,
    }) => {
      // // Call filter with there parameter
      // const parametersFilter = await fetchWrapper.handleFilterParameter('lote', filterYear, filterCodLote, filterNcc, filterFase, filterPeso, filterSeeds, filterGenotipo, filterMainName, filterGmr, filterBgm, filterTecnologiaCod, filterTecnologiaDesc, filterYearTo, filterYearFrom, filterSeedTo, filterSeedFrom, filterWeightTo, filterWeightFrom, filterGmrFrom, filterGmrTo, filterBgmTo, filterBgmFrom);
      // setFiltersParams(parametersFilter); // Set filter pararameters

      // await loteService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response) => {
      //   setFilter(parametersFilter);
      //   setLotes(response.response);
      //   setTotalItems(response.total);
      //   setCurrentPage(0);
      // });
      

      const parametersFilter = `&filterGmrFrom=${filterGmrFrom}&filterYear=${filterYear}&filterCodLote=${filterCodLote}&filterNcc=${filterNcc}&filterFase=${filterFase}&filterPeso=${filterPeso}&filterSeeds=${filterSeeds}&filterGenotipo=${filterGenotipo}&filterMainName=${filterMainName}&filterGmr=${filterGmr}&filterBgm=${filterBgm}&filterTecnologiaCod=${filterTecnologiaCod}&filterTecnologiaDesc=${filterTecnologiaDesc}&filterGmrTo=${filterGmrTo}&id_culture=${idCulture}&id_safra=${idSafra}`;

      setFilter(parametersFilter);
      setCurrentPage(0);
      await callingApi(parametersFilter); 
    },
  });

  //Calling common API 
  async function callingApi(parametersFilter : any ){

    setCookies("filterBeforeEdit", parametersFilter);
    setCookies("filterBeforeEditTypeOrder", typeOrder);
    setCookies("filterBeforeEditOrderBy", orderBy);  
    parametersFilter = `${parametersFilter}&${pathExtra}`;
    setFiltersParams(parametersFilter);
    setCookies("filtersParams", parametersFilter);

    await loteService.getAll(parametersFilter).then((response) => {
      if (response.status === 200 || response.status === 400 ) {
        setLotes(response.response);
        setTotalItems(response.total);
      }
    });
  } 

  //Call that function when change type order value.
  useEffect(() => {
    callingApi(filter);
  }, [typeOrder]);
  

  async function handleOrder(column: string, order: string | any): Promise<void> {
    // // Manage orders of colunms
    // const parametersFilter = await fetchWrapper.handleOrderGlobal(column, order, filter, 'lote');

    // const value = await fetchWrapper.skip(currentPage, parametersFilter);

    // await loteService.getAll(value).then((response) => {
    //   if (response.status === 200) {
    //     setLotes(response.response);
    //     setFiltersParams(parametersFilter);
    //   }
    // });
    // if (orderList === 2) {
    //   setOrder(0);
    //   setArrowOrder(<AiOutlineArrowDown />);
    // } else {
    //   setOrder(orderList + 1);
    //   if (orderList === 1) {
    //     setArrowOrder(<AiOutlineArrowUp />);
    //   } else {
    //     setArrowOrder('');
    //   }
    // }

      //Gobal manage orders
      const {typeOrderG, columnG, orderByG, arrowOrder} = await fetchWrapper.handleOrderG(column, order , orderList);

      setTypeOrder(typeOrderG);
      setOrderBy(columnG);
      setOrder(orderByG);
      setArrowOrder(arrowOrder);
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
            {`${rowData.genotipo.tecnologia.cod_tec} ${rowData.genotipo.tecnologia.name}`}
          </div>
        </div>
      ),
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

  function columnsOrder(columnsCampos: string) {
    const columnCampos: string[] = columnsCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      // if (columnCampos[index] === 'id') {
      //   tableFields.push(idHeaderFactory());
      // }
      if (columnCampos[index] === 'year') {
        tableFields.push(headerTableFactory('Ano', 'year'));
      }
      if (columnCampos[index] === 'cod_lote') {
        tableFields.push(headerTableFactory('Cód. lote', 'cod_lote'));
      }
      if (columnCampos[index] === 'ncc') {
        tableFields.push(headerTableFactory('NCC', 'ncc'));
      }
      if (columnCampos[index] === 'fase') {
        tableFields.push(headerTableFactory('Fase', 'fase'));
      }
      if (columnCampos[index] === 'peso') {
        tableFields.push(headerTableFactory('Peso (kg)', 'peso'));
      }
      if (columnCampos[index] === 'quant_sementes') {
        tableFields.push(
          headerTableFactory('Quant. sementes', 'quant_sementes'),
        );
      }
      if (columnCampos[index] === 'name_genotipo') {
        tableFields.push(
          headerTableFactory('Nome genótipo', 'genotipo.name_genotipo'),
        );
      }
      if (columnCampos[index] === 'name_main') {
        tableFields.push(
          headerTableFactory('Nome principal', 'genotipo.name_main'),
        );
      }
      if (columnCampos[index] === 'gmr') {
        tableFields.push(headerTableFactory('GMR', 'genotipo.gmr'));
      }
      if (columnCampos[index] === 'bgm') {
        tableFields.push(headerTableFactory('BGM', 'genotipo.bgm'));
      }
      if (columnCampos[index] === 'tecnologia') {
        tableFields.push(tecnologiaHeaderFactory('Tecnologia', 'genotipo.tecnologia'));
      }
    });
    return tableFields;
  }

  const downloadExcel = async (): Promise<void> => {
    await loteService.getAll(filter).then(({ status, response }) => {
      if (status === 200) {
        const newData = response.map((item: any) => {
          const newItem = item;
          const dataExp = new Date();
          let hours: string;
          let minutes: string;
          let seconds: string;
          if (String(dataExp.getHours()).length === 1) {
            hours = `0${String(dataExp.getHours())}`;
          } else {
            hours = String(dataExp.getHours());
          }
          if (String(dataExp.getMinutes()).length === 1) {
            minutes = `0${String(dataExp.getMinutes())}`;
          } else {
            minutes = String(dataExp.getMinutes());
          }
          if (String(dataExp.getSeconds()).length === 1) {
            seconds = `0${String(dataExp.getSeconds())}`;
          } else {
            seconds = String(dataExp.getSeconds());
          }
          newItem.DT = `${dataExp.toLocaleDateString(
            'pt-BR',
          )} ${hours}:${minutes}:${seconds}`;

          newItem.ID_S2 = item?.id_s2;
          newItem.ID_DADOS = item?.id_dados;
          newItem.ANO = item?.year;
          newItem.COD_LOTE = item?.cod_lote;
          newItem.NCC = item?.ncc;
          newItem.FASE = item?.fase;
          newItem.PESO = item?.peso;
          newItem.QUANT_SEMENTES = item?.quant_sementes;
          newItem.NOME_GENOTIPO = item?.genotipo.name_genotipo;
          newItem.NOME_PRINCIPAL = item?.genotipo.name_main;
          newItem.GMR = item?.genotipo.gmr;
          newItem.BGM = item?.genotipo.bgm;
          newItem.TECNOLOGIA = `${item?.genotipo.tecnologia.cod_tec} ${item?.genotipo.tecnologia.name}`;
          newItem.DATA = newItem.DT;

          delete newItem.quant_sementes;
          delete newItem.peso;
          delete newItem.fase;
          delete newItem.ncc;
          delete newItem.cod_lote;
          delete newItem.year;
          delete newItem.id_s2;
          delete newItem.id_dados;
          delete newItem.DT;
          delete newItem.id;
          delete newItem.id_genotipo;
          delete newItem.genotipo;

          return newItem;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'lotes');

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
        Swal.fire(response);
      }
    });
  };

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
    const index = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  function handleTotalPages(): void {
    if (currentPage < 0) {
      setCurrentPage(0);
    }
    //  else if (currentPage >= pages) {
    //   setCurrentPage(pages - 1);
    // }
  }

  async function handlePagination(): Promise<void> {
    // // manage using comman function
    // const { parametersFilter, currentPages } = await fetchWrapper.handlePaginationGlobal(currentPage, take, filter);

    // await loteService.getAll(parametersFilter).then((response) => {
    //   if (response.status === 200) {
    //     setLotes(response.response);
    //     setTotalItems(response.total); // Set new total records
    //     setCurrentPage(currentPages); // Set new current page
    //   }
    // });

    await callingApi(filter); //handle pagination globly

  }

  // Checking defualt values
  function checkValue(value: any) {
    const parameter = fetchWrapper.getValuesForFilter(value , filtersParams);
    return parameter;
  }
  

  function filterFieldFactory(title: any, name: any, small: boolean = false) {
    return (
      <div className={small ? 'h-8 w-full ml-4' : 'h-8 w-full ml-4'}>
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

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>Listagem de Lotes</title>
      </Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main
          className="h-full w-full
          flex flex-col
          items-start
          gap-4
        "
        >
          <AccordionFilter title="Filtrar lotes">
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
                  pb-7
                "
                >
                  <div className="h-6 w-full ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Ano
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterYearFrom"
                        name="filterYearFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 5 }}
                        placeholder="Até"
                        id="filterYearTo"
                        name="filterYearTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  {filterFieldFactory('filterCodLote', 'Cód. lote')}

                  {filterFieldFactory('filterNcc', 'NCC')}

                  {filterFieldFactory('filterFase', 'Fase', true)}

                  <div className="h-6 w-full ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Peso (kg)
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterWeightFrom"
                        name="filterWeightFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 5 }}
                        placeholder="Até"
                        id="filterWeightTo"
                        name="filterWeightTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-6 w-full ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-1">
                      Quant. sementes
                    </label>
                    <div className="flex">
                      <Input
                        placeholder="De"
                        id="filterSeedFrom"
                        name="filterSeedFrom"
                        onChange={formik.handleChange}
                      />
                      <Input
                        style={{ marginLeft: 5 }}
                        placeholder="Até"
                        id="filterSeedTo"
                        name="filterSeedTo"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="w-full h-full flex justify-center pb-0"
                >
                  {filterFieldFactory('filterGenotipo', 'Nome genótipo')}

                  {filterFieldFactory('filterMainName', 'Nome principal')}

                  <div className="h-6 w-full ml-4 flex">
                    <div>
                      <label className="block text-gray-900 text-sm font-bold mb-1">
                        GMR
                      </label>
                      <div className="flex">
                        <Input
                          placeholder="De"
                          id="filterGmrFrom"
                          name="filterGmrFrom"
                          onChange={formik.handleChange}
                        />
                        <Input
                          style={{ marginLeft: 5 }}
                          placeholder="Até"
                          id="filterGmrTo"
                          name="filterGmrTo"
                          onChange={formik.handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-6 w-full ml-4 flex">
                    <div>
                      <label className="block text-gray-900 text-sm font-bold mb-1">
                        BGM
                      </label>
                      <div className="flex">
                        <Input
                          placeholder="De"
                          id="filterBgmFrom"
                          name="filterBgmFrom"
                          onChange={formik.handleChange}
                        />
                        <Input
                          style={{ marginLeft: 5 }}
                          placeholder="Até"
                          id="filterBgmTo"
                          name="filterBgmTo"
                          onChange={formik.handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {filterFieldFactory('filterTecnologiaCod', 'Cód. Tecnologia')}

                  {filterFieldFactory('filterTecnologiaDesc', 'Nome Tecnologia')}

                  {/* <div className="w-full" style={{ marginLeft: -40 }} /> */}
                  <div style={{ marginLeft: 20 }} />
                  <div className="h-7 w-32 mt-6">
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
              data={lotes}
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
                    <div className="h-12" />
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
                                                generate.value as string,
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
                          title="Exportar planilha de genótipos"
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
                      onClick={() => setCurrentPage(pages - 1)}
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
  // eslint-disable-next-line max-len
  const itensPerPage = (await (
    await PreferencesControllers.getConfigGerais()
  )?.response[0]?.itens_per_page) ?? 10;

   //Last page
   const lastPageServer = req.cookies.lastPage
   ? req.cookies.lastPage
   : "No";
 
  if(lastPageServer == undefined || lastPageServer == "No"){
    removeCookies('filterBeforeEdit', { req, res });
    removeCookies('pageBeforeEdit', { req, res });
    removeCookies("filterBeforeEditTypeOrder", { req, res });
    removeCookies("filterBeforeEditOrderBy", { req, res });
    removeCookies("lastPage", { req, res });  
  }
   //RR
   const typeOrderServer = req.cookies.filterBeforeEditTypeOrder
   ? req.cookies.filterBeforeEditTypeOrder
   : "desc";
        
   //RR
   const orderByserver = req.cookies.filterBeforeEditOrderBy
   ? req.cookies.filterBeforeEditOrderBy
   : "year";


  const { token } = req.cookies;
  const idSafra = Number(req.cookies.safraId);
  const idCulture = Number(req.cookies.cultureId);
  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/lote`;
  const urlParameters: any = new URL(baseUrl);

  const param = `skip=0&take=${itensPerPage}&id_culture=${idCulture}&id_safra=${idSafra}`;
  urlParameters.search = new URLSearchParams(param).toString();


  
  const filterApplication = req.cookies.filterBeforeEdit
  ? `${req.cookies.filterBeforeEdit}`
  : `&id_culture=${idCulture}&id_safra=${idSafra}`;


  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  
  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allLote, total: totalItems } = await fetch(`${urlParameters.toString()}`, requestOptions)
    .then((response) => response.json());

  return {
    props: {
      allLote,
      totalItems,
      idSafra,
      idCulture,
      itensPerPage,
      orderByserver,
      typeOrderServer,  
      filterApplication
    },
  };
};
