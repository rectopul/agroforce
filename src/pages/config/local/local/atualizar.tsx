import { useFormik } from 'formik';
import MaterialTable from 'material-table';
import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiTwotoneStar } from 'react-icons/ai';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import { IoMdArrowBack } from 'react-icons/io';
import { IoReloadSharp } from 'react-icons/io5';
import { MdFirstPage, MdLastPage } from 'react-icons/md';
import { RiFileExcel2Line } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { UserPreferenceController } from '../../../../controllers/user-preference.controller';
import { localService, unidadeCulturaService, userPreferencesService } from '../../../../services';
import {
  AccordionFilter,
  Button, CheckBox, Content,
  Input,
} from '../../../../components';
import * as ITabs from '../../../../shared/utils/dropdown';

export interface IData {
  allCultureUnity: any;
  totalItems: number;
  itensPerPage: number;
  filterApplication: object | any;
  id_local: number;
  id_safra: number;
  local: object | any,
  pageBeforeEdit: string | any
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

interface IUpdateLocal {
  id: number | any;
  name_local_culture: string | any;
  mloc: string | any;
  label: string | any;
  label_country: string | any;
  label_region: string | any;
  name_locality: string | any;
  adress: string | any;
  status: number;
}

export default function AtualizarLocal({
  local, allCultureUnity, totalItems, itensPerPage, filterApplication, id_local, id_safra, pageBeforeEdit,
}: IData) {
  const { TabsDropDowns } = ITabs.default;

  const tabsDropDowns = TabsDropDowns('config');

  tabsDropDowns.map((tab) => (
    tab.titleTab === 'LOCAL'
      ? tab.statusTab = true
      : tab.statusTab = false
  ));

  const router = useRouter();

  const userLogado = JSON.parse(localStorage.getItem('user') as string);
  const preferences = userLogado.preferences.unidadeCultura || { id: 0, table_preferences: 'id,name_unity_culture,year' };
  const [camposGerenciados, setCamposGerenciados] = useState<any>(preferences.table_preferences);

  const [unidadeCultura, setUnidadeCultura] = useState<any>(() => allCultureUnity);
  const [currentPage, setCurrentPage] = useState<number>(Number(pageBeforeEdit));
  const [itemsTotal, setTotaItems] = useState<number | any>(totalItems);
  const [orderList, setOrder] = useState<number>(1);
  const [arrowOrder, setArrowOrder] = useState<ReactNode>('');
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(filterApplication);
  const [colorStar, setColorStar] = useState<string>('');
  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(() => [
    { name: 'CamposGerenciados[]', title: 'Favorito', value: 'id' },
    { name: 'CamposGerenciados[]', title: 'Nome de Unidade de Cultura', value: 'name_unity_culture' },
    { name: 'CamposGerenciados[]', title: 'Ano', value: 'year' },
  ]);
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderType, setOrderType] = useState<string>('');

  const take: number = itensPerPage;
  const total: number = (itemsTotal <= 0 ? 1 : itemsTotal);
  const pages = Math.ceil(total / take);
  const columns = columnsOrder(camposGerenciados);

  const formik = useFormik<IUpdateLocal>({
    initialValues: {
      id: local.id,
      name_local_culture: local.name_local_culture,
      label: local.label,
      mloc: local.mloc,
      adress: local.adress,
      label_country: local.label_country,
      label_region: local.label_region,
      name_locality: local.name_locality,
      status: local.status,
    },
    onSubmit: async (values) => {
      await localService.update({
        id: formik.values.id,
        name_local_culture: formik.values.name_local_culture,
        label: formik.values.label,
        mloc: formik.values.mloc,
        adress: formik.values.adress,
        label_country: formik.values.label_country,
        label_region: formik.values.label_region,
        name_locality: formik.values.name_locality,
      }).then((response) => {
        if (response.status === 200) {
          Swal.fire('atualizado com sucesso!');
          router.back();
        } else {
          Swal.fire(response.message);
        }
      });
    },
  });

  function headerTableFactory(name: any, title: string) {
    return {
      title: (
        <div className="flex items-center">
          <button className="font-medium text-gray-900" onClick={() => handleOrder(title, orderList)}>
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
            <div className="h-7 flex">
              <div>
                <button
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('')}
                >
                  <AiTwotoneStar size={20} color="#eba417" />
                </button>
              </div>
            </div>
          )
          : (
            <div className="h-7 flex">
              <div>
                <button
                  className="w-full h-full flex items-center justify-center border-0"
                  onClick={() => setColorStar('#eba417')}
                >
                  <AiTwotoneStar size={20} />
                </button>
              </div>
            </div>
          )
      ),
    };
  }

  function columnsOrder(camposGerenciados: string) {
    const columnCampos: string[] = camposGerenciados.split(',');
    const tableFields: any = [];

    Object.keys(columnCampos).forEach((item, index) => {
      if (columnCampos[index] === 'id') {
        tableFields.push(idHeaderFactory());
      }
      if (columnCampos[index] === 'name_unity_culture') {
        tableFields.push(headerTableFactory('Nome da Unidade de Cultura', 'name_unity_culture'));
      }
      if (columnCampos[index] === 'year') {
        tableFields.push(headerTableFactory('Ano', 'year'));
      }
    });
    return tableFields;
  }

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
    setOrderBy(column);
    setOrderType(typeOrder);
    if (filter && typeof (filter) !== 'undefined') {
      if (typeOrder !== '') {
        parametersFilter = `${filter}&orderBy=${column}&typeOrder=${typeOrder}`;
      } else {
        parametersFilter = filter;
      }
    } else if (typeOrder !== '') {
      parametersFilter = `orderBy=${column}&typeOrder=${typeOrder}&id_safra=${id_safra}&id_local=${id_local}`;
    } else {
      parametersFilter = filter;
    }

    await unidadeCulturaService.getAll(`${parametersFilter}&skip=0&take=${take}`).then((response) => {
      if (response.status === 200) {
        setUnidadeCultura(response.response);
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
      await userPreferencesService.create({ table_preferences: campos, userId: userLogado.id, module_id: 21 }).then((response) => {
        userLogado.preferences.unidadeCultura = { id: response.response.id, userId: preferences.userId, table_preferences: campos };
        preferences.id = response.response.id;
      });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences.unidadeCultura = { id: preferences.id, userId: preferences.userId, table_preferences: campos };
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
    await unidadeCulturaService.getAll(filterApplication).then((response) => {
      if (response.status === 200) {
        const newData = response.response.map((row: any) => {
          delete row.id;
          delete row.id_unity_culture;
          delete row.id_local;
          delete row.local;
          delete row.id_unity_culture;

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, 'unidade-cultura');

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
        XLSX.writeFile(workBook, 'unidade-cultura.xlsx');
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
    await unidadeCulturaService.getAll(parametersFilter).then((response) => {
      if (response.status === 200) {
        setUnidadeCultura(response.response);
      }
    });
  }

  useEffect(() => {
    handlePagination(); '';
    handleTotalPages();
  }, [currentPage]);

  return (
    <>
      <Head><title>Novo Local</title></Head>

      <Content contentHeader={tabsDropDowns} moduloActive="config">
        <form
          className="w-full bg-white shadow-md rounded px-4 pt-3 pb-3 mt-2"
          onSubmit={formik.handleSubmit}
        >
          <div className="w-full flex justify-between items-start">
            <h1 className="text-xl">Atualizar Local</h1>
          </div>

          <div className="w-full flex justify-around gap-5 mt-2 mb-3">
            <div className="w-full">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *Nome do lugar de cultura
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="name_local_culture"
                name="name_local_culture"
                disabled
                onChange={formik.handleChange}
                value={formik.values.name_local_culture}
              />
            </div>

            <div className="w-full h-7">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *Rótulo
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="label"
                name="label"
                disabled
                onChange={formik.handleChange}
                value={formik.values.label}
              />
            </div>

            <div className="w-full h-7">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *MLOC
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="mloc"
                name="mloc"
                disabled
                onChange={formik.handleChange}
                value={formik.values.mloc}
              />
            </div>
          </div>

          <div className="w-full
            flex
            justify-around
            gap-6
            mb-4
          "
          >
            <div className="w-full h-7">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *Nome da Fazenda
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="adress"
                name="adress"
                disabled
                onChange={formik.handleChange}
                value={formik.values.adress}
              />
            </div>
            <div className="w-full h-7">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *País
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="label_country"
                name="label_country"
                disabled
                onChange={formik.handleChange}
                value={formik.values.label_country}
              />
            </div>
            <div className="w-full h-7">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *Região
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="label_region"
                name="label_region"
                disabled
                onChange={formik.handleChange}
                value={formik.values.label_region}
              />
            </div>
            <div className="w-full h-7">
              <label className="block text-gray-900 text-sm font-bold mb-1">
                *Localidade
              </label>
              <Input
                style={{ background: '#e5e7eb' }}
                id="name_locality"
                name="name_locality"
                disabled
                onChange={formik.handleChange}
                value={formik.values.name_locality}
              />
            </div>
            <div
              // style={{ minWidth: 150, maxWidth: 150 }}
              className="h-7 w-full flex gap-3 justify-center mt-6"
            >
              <div className="w-20" />
              <Button
                type="button"
                value="Voltar"
                bgColor="bg-red-600"
                textColor="white"
                icon={<IoMdArrowBack size={18} />}
                onClick={() => { router.back(); }}
              />
            </div>
          </div>
        </form>
        <main className="w-full
          flex flex-col
          items-start
          gap-8
        "
        >

          <div style={{ marginTop: '1%' }} className="w-full h-auto overflow-y-scroll">
            <MaterialTable
              style={{ background: '#f9fafb' }}
              columns={columns}
              data={unidadeCultura}
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
                    <div className="h-12" />
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
                                                  defaultChecked={camposGerenciados.includes(generate.value as string)}
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
                        <Button title="Exportar planilha de unidade de cultura" icon={<RiFileExcel2Line size={20} />} bgColor="bg-blue-600" textColor="white" onClick={() => { downloadExcel(); }} />
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

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const PreferencesControllers = new UserPreferenceController();
  // eslint-disable-next-line max-len
  const itensPerPage = await (await PreferencesControllers.getConfigGerais())?.response[0]?.itens_per_page ?? 5;

  const { token } = req.cookies;
  const id_local = query.id;
  const id_safra = req.cookies.safraId;
  const pageBeforeEdit = req.cookies.pageBeforeEdit ? req.cookies.pageBeforeEdit : 0;

  const { publicRuntimeConfig } = getConfig();

  const requestOptions: RequestInit | undefined = {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  };

  const baseUrlUnidadeCultura = `${publicRuntimeConfig.apiUrl}/unidade-cultura`;
  const responseUnidadeCultura = await fetch(`${baseUrlUnidadeCultura}?id_local=${id_local}`, requestOptions);

  const baseUrlShow = `${publicRuntimeConfig.apiUrl}/local`;
  const responseLocal = await fetch(`${baseUrlShow}/${query.id}`, requestOptions);

  const filterApplication = `filterStatus=1&id_safra=${id_safra}&id_local=${id_local}`;

  const { response: allCultureUnity, total: totalItems }: any = await responseUnidadeCultura.json();

  const { response: local } = await responseLocal.json();

  return {
    props: {
      allCultureUnity,
      totalItems,
      itensPerPage,
      filterApplication,
      id_local,
      id_safra,
      local,
      pageBeforeEdit,
    },
  };
};
