import { removeCookies, setCookies } from 'cookies-next';
import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { ReactNode, useEffect, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import {
  AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineFileSearch, AiTwotoneStar,
} from 'react-icons/ai';
import {
  BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line, RiPlantLine, RiSettingsFill } from 'react-icons/ri';
import {
  AccordionFilter, Button, CheckBox, Content, Input, Select,
} from 'src/components';
import { UserPreferenceController } from 'src/controllers/user-preference.controller';
import { genotipoService, userPreferencesService } from 'src/services';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import ITabs from '../../../../shared/utils/dropdown';

interface IFilter {
  filterStatus: object | any;
  filterGenotipo: string | any;
  filterGenealogy: string | any;
  filterCruza: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

export interface IGenotipos {
  id: number;
  id_culture: number;
  genealogy: string;
  genotipo: string;
  cruza: string;
  status?: number;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allGenotipos: IGenotipos[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  cultureId: number;
  pageBeforeEdit: string | any;
  filterBeforeEdit: string | any
}

export default function Listagem({
  allGenotipos, totalItems, itensPerPage, filterApplication, cultureId, pageBeforeEdit, filterBeforeEdit,
}: IData) {
  const { TabsDropDowns } = ITabs;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'TMG'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.genotipo || { id: 0, table_preferences: 'id,name_genotipo,name_main,tecnologia,cruza,gmr,bgm' };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);
  const router = useRouter();
  const [genotipos, setGenotipo] = useState<IGenotipos[]>(() => allGenotipos);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [filtersParams, setFiltersParams] = useState<string>(filterBeforeEdit);
  const [itemsTotal, setTotalItems] = useState<number | any>(totalItems || 0);
  const [orderGenealogy, setOrderGenealogy] = useState<number>(0);
  const [orderCruza, setOrderCruza] = useState<number>(0);
  const [arrowGenealogy, setArrowGenealogy] = useState<ReactNode>('');
  const [arrowCruza, setArrowCruza] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Nome genótipo', value: 'name_genotipo' },
    { name: 'CamposGerenciados[]', title: 'Nome principal', value: 'name_main' },
    { name: 'CamposGerenciados[]', title: 'Cód tec', value: 'tecnologia' },
    { name: 'CamposGerenciados[]', title: 'Cruza', value: 'cruza' },
    { name: 'CamposGerenciados[]', title: 'GMR', value: 'gmr' },
    { name: 'CamposGerenciados[]', title: 'Nº Lotes', value: 'bgm' },
    { name: 'CamposGerenciados[]', title: 'ID_S1', value: 'id_s1' },
    { name: 'CamposGerenciados[]', title: 'Nome publico', value: 'name_public' },
    { name: 'CamposGerenciados[]', title: 'Nome experimental', value: 'name_experiment' },
    { name: 'CamposGerenciados[]', title: 'Nome alternativo', value: 'name_alter' },
    { name: 'CamposGerenciados[]', title: 'Elite nome', value: 'elit_name' },
    { name: 'CamposGerenciados[]', title: 'Tipo', value: 'type' },
    { name: 'CamposGerenciados[]', title: 'Progenitor f direto', value: 'progenitor_f_direto' },
    { name: 'CamposGerenciados[]', title: 'Progenitor m direto', value: 'progenitor_m_direto' },
    { name: 'CamposGerenciados[]', title: 'Progenitor f origem', value: 'progenitor_f_origem' },
    { name: 'CamposGerenciados[]', title: 'Progenitor m origem', value: 'progenitor_m_origem' },
    { name: 'CamposGerenciados[]', title: 'Progenitores origem', value: 'progenitores_origem' },
    { name: 'CamposGerenciados[]', title: 'Parentesco', value: 'parentesco_completo' },
    { name: 'CamposGerenciados[]', title: 'Status', value: 'status' },
  ]);

  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');

  const filtersStatusItem = [
    { id: 2, name: 'Todos' },
    { id: 1, name: 'Ativos' },
    { id: 0, name: 'Inativos' },
  ];

  const filterStatusBeforeEdit = filterBeforeEdit.split('');

  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  const columns = columnsOrder(camposGerenciados);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterGenotipo: '',
      filterGenealogy: '',
      filterCruza: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async ({
      filterStatus, filterGenotipo, filterGenealogy, filterCruza,
    }) => {
      const parametersFilter = `filterStatus=${filterStatus || 1}&filterGenotipo=${filterGenotipo}&id_culture=${cultureId}&filterGenealogy=${filterGenealogy}&filterCruza=${filterCruza}`;
      setFiltersParams(parametersFilter);
      setCookies('filterBeforeEdit', filtersParams);
      await genotipoService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response) => {
        setFilter(parametersFilter);
        setGenotipo(response.response);
        setTotalItems(response.total);
        setCurrentPage(0);
      });
    },
  });

  async function handleStatus(idGenotipo: number, data: IGenotipos): Promise<void> {
    if (data.status === 0) {
      data.status = 1;
    } else {
      data.status = 0;
    }

    const index = genotipos.findIndex((genotipo) => genotipo.id === idGenotipo);

    if (index === -1) {
      return;
    }

    setGenotipo((oldSafra) => {
      const copy = [...oldSafra];
      copy[index].status = data.status;
      return copy;
    });

    const {
      id,
      status,
    } = genotipos[index];

    await genotipoService.update({
      id,
      status,
    });
  }

  function columnsOrder(camposGerenciados: any): any {
    const ObjetCampos: any = camposGerenciados.split(',');
    const arrOb: any = [];

    Object.keys(ObjetCampos).forEach((_, index) => {
      if (ObjetCampos[index] === 'id') {
        arrOb.push({
          title: '',
          field: 'id',
          width: 0,
          render: () => (
            colorStar === '#eba417'
              ? (
                <div className="h-10 flex">
                  <div>
                    <button
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
                      className="w-full h-full flex items-center justify-center border-0"
                      onClick={() => setColorStar('#eba417')}
                    >
                      <AiTwotoneStar size={25} />
                    </button>
                  </div>
                </div>
              )
          ),
        });
      }
      if (ObjetCampos[index] === 'name_genotipo') {
        arrOb.push({
          title: 'Nome genótipo',
          field: 'name_genotipo',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'name_main') {
        arrOb.push({
          title: 'Nome principal',
          field: 'name_main',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'tecnologia') {
        arrOb.push({
          title: 'Cód tec',
          field: 'tecnologia.cod_tec',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'cruza') {
        arrOb.push({
          title: 'Cruza',
          field: 'cruza',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'gmr') {
        arrOb.push({
          title: 'GMR',
          field: 'gmr',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'bgm') {
        arrOb.push({
          title: 'Nº Lotes',
          field: 'bgm',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'id_s1') {
        arrOb.push({
          title: 'ID_S1',
          field: 'id_s1',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'name_public') {
        arrOb.push({
          title: 'Nome publico',
          field: 'name_public',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'name_experiment') {
        arrOb.push({
          title: 'Nome experimental',
          field: 'name_experiment',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'name_alter') {
        arrOb.push({
          title: 'Nome alternativo',
          field: 'name_alter',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'elit_name') {
        arrOb.push({
          title: 'Elite nome',
          field: 'elit_name',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'type') {
        arrOb.push({
          title: 'Tipo',
          field: 'type',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'progenitor_f_direto') {
        arrOb.push({
          title: 'Progenitor f direto',
          field: 'progenitor_f_direto',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'progenitor_m_direto') {
        arrOb.push({
          title: 'Progenitor m direto',
          field: 'progenitor_m_direto',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'progenitor_f_origem') {
        arrOb.push({
          title: 'Progenitor f origem',
          field: 'progenitor_f_origem',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'progenitor_m_origem') {
        arrOb.push({
          title: 'Progenitor m origem',
          field: 'progenitor_m_origem',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'progenitores_origem') {
        arrOb.push({
          title: 'Progenitores origem',
          field: 'progenitores_origem',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'parentesco_completo') {
        arrOb.push({
          title: 'Parentesco',
          field: 'parentesco_completo',
          sorting: false,
        });
      }
      if (ObjetCampos[index] === 'status') {
        arrOb.push({
          title: 'Status',
          field: 'status',
          sorting: false,
          searchable: false,
          filterPlaceholder: 'Filtrar por status',
          render: (rowData: IGenotipos) => (
            <div className="h-10 flex">
              <div className="h-10">
                <Button
                  icon={<BiEdit size={16} />}
                  bgColor="bg-blue-600"
                  textColor="white"
                  title={`Editar ${rowData.genealogy}`}
                  onClick={() => {
                    setCookies('pageBeforeEdit', currentPage?.toString());
                    setCookies('filterBeforeEdit', filtersParams);
                    router.push(`/config/tmg/genotipo/atualizar?id=${rowData.id}`);
                  }}
                />
              </div>
              {rowData.status === 1
                ? (
                  <div className="h-10">
                    <Button
                      icon={<FaRegThumbsUp size={16} />}
                      onClick={async () => await handleStatus(rowData.id, {
                        status: rowData.status,
                        ...rowData,
                      })}
                      title="Ativo"
                      bgColor="bg-green-600"
                      textColor="white"
                    />
                  </div>
                )
                : (
                  <div className="h-10">
                    <Button
                      icon={<FaRegThumbsDown size={16} />}
                      onClick={async () => await handleStatus(rowData.id, {
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
        });
      }
      // if (ObjetCampos[index] === 'id_genotipo') {
      //   arrOb.push({
      //     title: "Lote",
      //     field: "id_genotipo",
      //     sorting: false,
      //     searchable: false,
      //     filterPlaceholder: "Filtrar por status",
      //     render: (rowData: IGenotipos) => (
      //       <div className='h-10 flex'>
      //         <div className="h-10">
      //           <Button
      //             icon={<AiOutlineFileSearch size={16} />}
      //             bgColor="bg-yellow-500"
      //             textColor="white"
      //             title={`Lote de ${rowData.genealogy}`}
      //             onClick={() =>{router.push(`/config/tmg/genotipo/lote?id_genotipo=${rowData.id}`)}}
      //           />
      //         </div>
      //       </div>
      //     ),
      //   })
      // }
    });
    return arrOb;
  }

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
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 10 }).then((response) => {
        userLogado.preferences.genotipo = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.genotipo = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
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

  const downloadExcel = async (): Promise<void> => {
    if (!filterApplication.includes('paramSelect')) {
      filterApplication += `&paramSelect=${camposGerenciados}`;
    }

    await genotipoService.getAll(filterApplication).then((response) => {
      if (response.status === 200) {
        const newData = genotipos.map((row) => {
          if (row.status === 0) {
            row.status = 'Inativo' as any;
          } else {
            row.status = 'Ativo' as any;
          }

          return row;
        });

        newData.map((item: any) => item.tecnologia = item.tecnologia?.tecnologia);

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'genotipos');

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
        XLSX.writeFile(workBook, 'Genótipos.xlsx');
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
    let parametersFilter = `skip=${skip}&take=${take}`;

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}&${cultureId}`;
    }
    await genotipoService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setGenotipo(response.response);
      }
    });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head><title>Listagem de genótipos</title></Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        "
        >
          <AccordionFilter title="Filtrar genótipos">
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
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Status
                    </label>
                    <Select name="filterStatus" onChange={formik.handleChange} defaultValue={filterStatusBeforeEdit[13]} values={filtersStatusItem.map((id) => id)} selected="1" />
                  </div>
                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Nome genótipo
                    </label>
                    <Input
                      type="text"
                      placeholder="Genótipo"
                      max="40"
                      id="filterGenotipo"
                      name="filterGenotipo"
                      onChange={formik.handleChange}
                    />
                  </div>

                  <div className="h-10 w-1/2 ml-4">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Cruza
                    </label>
                    <Input
                      type="text"
                      placeholder="Cruza"
                      max="40"
                      id="filterCruza"
                      name="filterCruza"
                      onChange={formik.handleChange}
                    />
                  </div>
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
              data={genotipos}
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
                    {/* <div className='h-12'>
                      <Button
                        title="Cadastrar genótipo"
                        value="Cadastrar genótipo"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => {router.push('genotipo/cadastro')}}
                        icon={<RiPlantLine size={20} />}
                      />
                    </div> */}
                    <div className="h-12">
                      <Button
                        title="Importar Planilha"
                        value="Importar Planilha"
                        bgColor="bg-blue-600"
                        textColor="white"
                        onClick={() => { }}
                        href="genotipo/importar-planilha"
                        icon={<RiFileExcel2Line size={20} />}
                      />
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
                                          <Draggable key={index} draggableId={String(generate.title)} index={index}>
                                            {(provided) => (
                                              <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <CheckBox
                                                  name={generate.name}
                                                  title={generate.title?.toString()}
                                                  value={generate.value}
                                                  defaultChecked={camposGerenciados.includes(String(generate.value))}
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
                        {/* <Button title="Importação de planilha" icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => {router.push('portfolio/importacao')}} /> */}
                        <Button title="Exportar planilha de genótipos" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
                      </div>
                      <div className="h-12 flex items-center justify-center w-full">
                        <Button icon={<RiSettingsFill size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { }} href="genotipo/importar-planilha/config-planilha" />
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
  const itensPerPage = await (await PreferencesControllers.getConfigGerais())?.response[0]?.itens_per_page ?? 10;

  const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;
  const filterBeforeEdit = req.cookies.filterBeforeEdit ? req.cookies.filterBeforeEdit : 'filterStatus=1';

  const { token } = req.cookies;
  const cultureId = Number(req.cookies.cultureId);

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/genotipo`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1&id_culture=${cultureId}`;
  const filterApplication = req.cookies.filterBeforeEdit ? `${req.cookies.filterBeforeEdit}&id_culture=${cultureId}` : 'filterStatus=1';

  removeCookies('filterBeforeEdit', { req, res });
  removeCookies('pageBeforeEdit', { req, res });

  const urlParameters: any = new URL(baseUrl);
  urlParameters.search = new URLSearchParams(param).toString();

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  } as RequestInit | undefined;

  const api = await fetch(`${baseUrl}?id_culture=${cultureId}`, requestOptions);
  const data = await api.json();

  const allGenotipos = data.response;
  const totalItems = data.total;

  return {
    props: {
      allGenotipos,
      totalItems,
      itensPerPage,
      filterApplication,
      cultureId,
      pageBeforeEdit,
      filterBeforeEdit,
    },
  };
};
