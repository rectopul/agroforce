/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { removeCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult
} from 'react-beautiful-dnd';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from 'react-icons/ai';
import {
  BiFilterAlt, BiLeftArrow, BiRightArrow
} from 'react-icons/bi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {
  AccordionFilter, Button, CheckBox, Content, Input
} from '../../../../components';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import { loteService, userPreferencesService } from '../../../../services';
import ITabs from '../../../../shared/utils/dropdown';

interface IFilter {
  filterYear: string
  filterCodLote: string
  filterNcc: string
  filterFase: string
  filterPeso: string
  filterSeeds: string
  filterGenotipo: string
  filterMainName: string
  filterGmr: string
  filterBgm: string
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
  idSafra: number
  itensPerPage: number;
}

export default function Listagem({
  allLote, idSafra, totalItems, itensPerPage,
}: IData) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.lote || {
    id: 0, table_preferences: 'id,year,cod_lote,ncc,fase,peso,quant_sementes,name_genotipo,name_main,gmr,bgm,tecnologia',
  };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [lotes, setLotes] = useState<LoteGenotipo[]>(() => allLote);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [orderList, setOrder] = useState<number>(1);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Ano lote', value: 'year' },
    { name: 'CamposGerenciados[]', title: 'Cód lote', value: 'cod_lote' },
    { name: 'CamposGerenciados[]', title: 'NCC', value: 'ncc' },
    { name: 'CamposGerenciados[]', title: 'Fase', value: 'fase' },
    { name: 'CamposGerenciados[]', title: 'Peso (kg)', value: 'peso' },
    { name: 'CamposGerenciados[]', title: 'Quant sementes', value: 'quant_sementes' },
    { name: 'CamposGerenciados[]', title: 'Nome do genotipo', value: 'name_genotipo' },
    { name: 'CamposGerenciados[]', title: 'Mome principal', value: 'name_main' },
    { name: 'CamposGerenciados[]', title: 'GMR', value: 'gmr' },
    { name: 'CamposGerenciados[]', title: 'BGM', value: 'bgm' },
    { name: 'CamposGerenciados[]', title: 'Tecnologia', value: 'tecnologia' },
  ]);
  const [filter, setFilter] = useState<any>();
  const [colorStar, setColorStar] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');
  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const formik = useFormik<IFilter>({
    initialValues: {
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
      const parametersFilter = `&filterYear=${filterYear}&filterCodLote=${filterCodLote}&filterNcc=${filterNcc}&filterFase=${filterFase}&filterPeso=${filterPeso}&filterSeeds=${filterSeeds}&filterGenotipo=${filterGenotipo}&filterMainName=${filterMainName}&filterGmr=${filterGmr}&filterBgm=${filterBgm}&filterTecnologiaCod=${filterTecnologiaCod}&filterTecnologiaDesc=${filterTecnologiaDesc}`;
      await loteService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setLotes(response.response);
        setTotalItems(response.total);
        setCurrentPage(0);
      });
    },
  });

  async function handleOrder(column: string, order: string | any): Promise<void> {
    const skip = currentPage * Number(take);
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

    await loteService.getAll(`${parametersFilter}&skip=${skip}&take=${take}`).then((response) => {
      if (response.status === 200) {
        setLotes(response.response);
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
      sorting: false,
      render: (rowData: any) => (
        <div className="h-10 flex">
          <div>
            {console.log(rowData.genotipo)}
            {/* {`${rowData.genotipo.tecnologia.cod_tec} ${rowData.genotipo.name_genotipo}`} */}
          </div>
        </div>
      ),
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

  function columnsOrder(columnsCampos: string) {
    const columnCampos: string[] = columnsCampos.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      if (columnCampos[index] === 'id') {
        tableFields.push(idHeaderFactory());
      }
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
        tableFields.push(headerTableFactory('Peso', 'peso'));
      }
      if (columnCampos[index] === 'quant_sementes') {
        tableFields.push(headerTableFactory('Quant. sementes', 'quant_sementes'));
      }
      if (columnCampos[index] === 'name_genotipo') {
        tableFields.push(headerTableFactory('Nome genotipo', 'genotipo.name_genotipo'));
      }
      if (columnCampos[index] === 'name_main') {
        tableFields.push(headerTableFactory('Nome principal', 'genotipo.name_main'));
      }
      if (columnCampos[index] === 'gmr') {
        tableFields.push(headerTableFactory('GMR', 'genotipo.gmr'));
      }
      if (columnCampos[index] === 'bgm') {
        tableFields.push(headerTableFactory('BGM', 'genotipo.bgm'));
      }
      if (columnCampos[index] === 'tecnologia') {
        tableFields.push(tecnologiaHeaderFactory('Tecnologia', 'genotipo.tecnologia.cod_tec'));
      }
    });
    return tableFields;
  }

  const downloadExcel = async (): Promise<void> => {
    await loteService.getAll(filter).then(({ status, response }) => {
      if (status === 200) {
        const newData = response.map((item: any) => {
          const newItem = item;
          newItem.name_genotipo = item.genotipo.name_genotipo;
          newItem.name_main = item.genotipo.name_main;
          newItem.gmr = item.genotipo.gmr;
          newItem.bgm = item.genotipo.bgm;
          newItem.tecnologia = `${item.genotipo.tecnologia.cod_tec} ${item.genotipo.tecnologia.desc}`;
          delete newItem.id;
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
      await userPreferencesService.create({
        table_preferences: campos,
        userId: userLogado.id,
        module_id: 12,
      }).then((response) => {
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
    const index = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

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
      parametersFilter = `skip=${skip}&take=${take}&id_safra=${idSafra}&orderBy=${orderBy}&typeOrder=${orderType}`;
    } else {
      parametersFilter = `skip=${skip}&take=${take}&id_safra=${idSafra}`;
    }

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await loteService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setLotes(response.response);
      }
    });
  }

  function filterFieldFactory(title: any, name: any) {
    return (
      <div className="h-10 w-1/2 ml-4">
        <label className="block text-gray-900 text-sm font-bold mb-2">
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
      <Head><title>Listagem de Lotes</title></Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
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
                <div className="w-full h-full
                  flex
                  justify-center
                  pb-2
                "
                >
                  {filterFieldFactory('filterYear', 'Ano')}

                  {filterFieldFactory('filterCodLote', 'Cód lote')}

                  {filterFieldFactory('filterNcc', 'NCC')}

                  {filterFieldFactory('filterFase', 'Fase')}

                  {filterFieldFactory('filterPeso', 'Peso')}

                  {filterFieldFactory('filterSeeds', 'Sementes')}

                  {filterFieldFactory('filterGenotipo', 'Genótipo')}

                  {filterFieldFactory('filterMainName', 'Principal')}

                </div>

                <div className="w-full h-full
                  flex
                  justify-center
                  pb-2
                "
                >

                  {filterFieldFactory('filterGmr', 'GMR')}

                  {filterFieldFactory('filterBgm', 'BGM')}

                  {filterFieldFactory('filterTecnologiaCod', 'Cód. Tec')}

                  {filterFieldFactory('filterTecnologiaDesc', 'Nome Tec.')}

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
              data={lotes}
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
                                                  defaultChecked={camposGerenciados
                                                    .includes(generate.value as string)}
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
                        <Button title="Exportar planilha de genótipos" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = await (await PreferencesControllers.getConfigGerais())?.response[0]?.itens_per_page ?? 10;

  const { token } = req.cookies;
  const idSafra = Number(req.cookies.safraId);

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/lote`;
  const urlParameters: any = new URL(baseUrl);

  const param = `skip=0&take=${itensPerPage}&id_safra=${idSafra}`;
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const { response: allLote, total: totalItems } = await fetch(`${urlParameters.toString()}`, requestOptions)
    .then((response) => response.json());

  console.log(allLote);

  return {
    props: {
      allLote,
      totalItems,
      idSafra,
      itensPerPage,
    },
  };
};
