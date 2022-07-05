/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { useFormik } from 'formik';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import MaterialTable from 'material-table';
import { SiMicrogenetics } from 'react-icons/si';
import Swal from 'sweetalert2';

import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import {
  AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar,
} from 'react-icons/ai';
import {
  BiLeftArrow, BiRightArrow,
} from 'react-icons/bi';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { userPreferencesService, disparosService, quadraService } from '../../../services';
import { UserPreferenceController } from '../../../controllers/user-preference.controller';
import {
  Button,
  Content,
  Input,
  AccordionFilter, CheckBox,
} from '../../../components';
import * as ITabs from '../../../shared/utils/dropdown';

interface IFilter {
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}
interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IData {
  allDisparos: any[];
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  idQuadra: number;
  quadra: any;
}

export default function Atualizarquadra({
  allDisparos, totalItems, itensPerPage, filterApplication, idQuadra, quadra,
}: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns();

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'QUADRAS'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();

  const formik = useFormik<any>({
    initialValues: {
      id: quadra.id,
      cod_quadra: quadra.cod_quadra,
      id_culture: quadra.id_culture,
      id_safra: quadra.id_safra,
      local_preparo: quadra.localPreparo.name_local_culture,
      local_plantio: quadra.local_plantio,
      larg_q: quadra.larg_q,
      comp_p: quadra.comp_p,
      linha_p: quadra.linha_p,
      comp_c: quadra.comp_c,
      esquema: quadra.esquema,
      tiro_fixo: quadra.tiro_fixo,
      disparo_fixo: quadra.disparo_fixo,
      q: quadra.q,
    },
    onSubmit: async (values) => {
      await quadraService.update({
        id: values.id,
        cod_quadra: values.cod_quadra,
        id_culture: values.id_culture,
        id_safra: values.id_safra,
        local_preparo: values.localPreparo.name_local_culture,
        local_plantio: values.local_plantio,
        larg_q: values.larg_q,
        comp_p: values.comp_p,
        linha_p: values.linha_p,
        comp_c: values.comp_c,
        esquema: values.esquema,
        tiro_fixo: values.tiro_fixo,
        disparo_fixo: values.disparo_fixo,
        q: values.q,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('Genótipo atualizado com sucesso!');
          router.back();
        } else {
          Swal.fire(response.message);
        }
      });
    },
  });

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.disparos || { id: 0, table_preferences: 'id,divisor,sem_metros,t4_i,t4_f,di,df,status' };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [disparos, setDisparos] = useState<any[]>(() => allDisparos);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<any>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Divisor', value: 'divisor' },
    { name: 'CamposGerenciados[]', title: 'Sem metro', value: 'sem_metros' },
    { name: 'CamposGerenciados[]', title: 'T4I', value: 't4_i' },
    { name: 'CamposGerenciados[]', title: 'T4F', value: 't4_f' },
    { name: 'CamposGerenciados[]', title: 'DI', value: 'di' },
    { name: 'CamposGerenciados[]', title: 'DF', value: 'df' },
  ]);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');

  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);

  useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: async (values) => {
      const parametersFilter = `filterStatus=${values.filterStatus}&filterSearch=${values.filterSearch}&id_quadra=${idQuadra}`;
      await disparosService.getAll(`${parametersFilter}&skip=0&take=${itensPerPage}`).then((response: any[]) => {
        setDisparos(response);
        setTotaItems(response.length);
        setFilter(parametersFilter);
      });
    },
  });

  async function handleOrder(column: string, order: string | any): Promise<void> {
    let typeOrder: any;
    let parametersFilter: any;
    if (order === 1) {
      typeOrder = 'asc';
    } else if (order === 2) {
      typeOrder = 'desc';
    } else {
      typeOrder = '';
    }

    if (filter && typeof (filter) !== 'undefined') {
      if (typeOrder !== '') {
        parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
      } else {
        parametersFilter = filter;
      }
    } else if (typeOrder !== '') {
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}&id_quadra=${idQuadra}`;
    } else {
      parametersFilter = filter;
    }

    await disparosService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setDisparos(response.response);
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
      if (columnCampos[index] === 'divisor') {
        tableFields.push(headerTableFactory('Divisor', 'divisor'));
      }
      if (columnCampos[index] === 'sem_metros') {
        tableFields.push(headerTableFactory('Sem metro', 'sem_metros'));
      }
      if (columnCampos[index] === 't4_i') {
        tableFields.push(headerTableFactory('T4I', 't4_i'));
      }
      if (columnCampos[index] === 't4_f') {
        tableFields.push(headerTableFactory('T4F', 't4_f'));
      }
      if (columnCampos[index] === 'di') {
        tableFields.push(headerTableFactory('DI', 'di'));
      }
      if (columnCampos[index] === 'df') {
        tableFields.push(headerTableFactory('DF', 'df'));
      }
    });
    return tableFields;
  }

  const columns = columnsOrder(camposGerenciados);

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox'");
    let selecionados = '';
    for (let i = 0; i < els.length; i++) {
      if (els[i].checked) {
        selecionados += `${els[i].value},`;
      }
    }
    const totalString = selecionados.length;
    const campos = selecionados.substr(0, totalString - 1);
    if (preferences.id === 0) {
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 18 }).then((response) => {
        userLogado.preferences.disparos = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.disparos = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
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
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGeneratesProps(items);
  }

  const downloadExcel = async (): Promise<void> => {
    if (!filterApplication.includes('paramSelect')) {
      filterApplication += `&paramSelect=${camposGerenciados}&id_quadra=${idQuadra}`;
    }

    await disparosService.getAll(filterApplication).then((response) => {
      if (response.status === 200) {
        const newData = response.response.map((row: { status: any }) => {
          if (row.status === 0) {
            row.status = 'Inativo';
          } else {
            row.status = 'Ativo';
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'disparos');

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
        XLSX.writeFile(workBook, 'disparos.xlsx');
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
    let parametersFilter = `skip=${skip}&take=${take}&id_quadra=${idQuadra}`;

    if (filter) {
      parametersFilter = `${parametersFilter}&${filter}`;
    }
    await disparosService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setDisparos(response.response);
      }
    });
  }

  useEffect(() => {
    handlePagination();
    handleTotalPages();
  }, [currentPage]);

  function updateFieldFactory(title: string, name: string) {
    return (
      <div className="w-full h-10">
        <label className="block text-gray-900 text-sm font-bold mb-2">
          {name}
        </label>
        <Input
          style={{ background: '#e5e7eb' }}
          disabled
          required
          id={title}
          name={title}
          value={formik.values[title]}
        />
      </div>
    );
  }

  return (
    <>
      <Head><title>Atualizar quadra</title></Head>
      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <h1 className="text-2xl">Atualizar quadra</h1>

          <div className="w-full flex justify-between items-start gap-5 mt-5">

            {updateFieldFactory('cod_quadra', 'Código Quadra')}

            <div className="w-full h-10">
              <label className="block text-gray-900 text-sm font-bold mb-2">
                Local Preparo
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                disabled
                required
                id="localPreparo"
                name="localPreparo"
                value={quadra.localPreparo.name_local_culture}
              />
            </div>

            {updateFieldFactory('esquema', 'Esquema')}

          </div>
          <div className="w-full flex justify-between items-start gap-5 mt-10">

            {updateFieldFactory('larg_q', 'Largura Q')}

            {updateFieldFactory('comp_p', 'Comp P.')}

            {updateFieldFactory('linha_p', 'Linha P.')}

            {updateFieldFactory('comp_c', 'Comp C.')}

            {updateFieldFactory('tiro_fixo', 'Tiro fixo')}

            {updateFieldFactory('disparo_fixo', 'Disparo fixo')}

          </div>
          <div className="w-full flex justify-between items-start gap-5 mt-10">

            {updateFieldFactory('cruza', 'Status quadra')}

            {updateFieldFactory('local_plantio', 'Local realizado')}

            {updateFieldFactory('q', 'Q')}

          </div>
          <div className="h-10 w-full
            flex
            gap-3
            justify-center
            mt-10
          "
          >
            <div className="w-30">
              <Button
                type="button"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                onClick={() => router.back()}
              />
            </div>
            <div className="w-40">
              <Button
                // type="submit"
                value="Mapa"
                bgColor="bg-blue-600"
                disabled
                textColor="white"
                icon={<SiMicrogenetics size={18} />}
                onClick={() => { }}
              />
            </div>
          </div>
        </form>
        <main className="h-3/6 w-full
          flex flex-col
          items-start
          gap-8
        "
        >

          <div style={{ marginTop: '1%' }} className="w-full h-full overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={disparos}
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
                                                  defaultChecked={
                                                    camposGerenciados
                                                      .includes(generate.value as string)
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
                        <Button title="Exportar planilha de disparos" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
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
                      onClick={() => setCurrentPage(currentPage + 10)}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const PreferencesControllers = new UserPreferenceController();
  const itensPerPage = await (await PreferencesControllers.getConfigGerais(''))?.response[0]?.itens_per_page ?? 10;

  const { token } = context.req.cookies;

  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/quadra`;
  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const apiQuadra = await fetch(`${baseUrl}/${context.query.id}`, requestOptions);
  const quadra = await apiQuadra.json();

  const baseUrlDisparos = `${publicRuntimeConfig.apiUrl}/disparos`;

  const param = `skip=0&take=${itensPerPage}&filterStatus=1`;
  const urlParameters: any = new URL(baseUrlDisparos);
  urlParameters.search = new URLSearchParams(param).toString();
  const idQuadra = Number(context.query.id);

  const filterApplication = `filterStatus=1&id_quadra=${idQuadra}`;

  const disparos = await fetch(`${baseUrlDisparos}?id_quadra=${idQuadra}`, requestOptions);
  const { response: allDisparos, total: totalItems } = await disparos.json();

  console.log('quadra');
  console.log(quadra);

  return {
    props: {
      quadra,
      allDisparos,
      totalItems,
      itensPerPage,
      filterApplication,
      idQuadra,
    },
  };
};
