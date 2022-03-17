import Head from "next/head";
import { useState } from "react";
import { useFormik } from "formik";
import MaterialTable from "material-table";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { FaRegThumbsDown, FaRegThumbsUp, FaRegUserCircle } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { MdDateRange, MdFirstPage, MdLastPage } from "react-icons/md";
import { BiEdit, BiFilterAlt, BiLeftArrow, BiRightArrow } from "react-icons/bi";
import * as XLSX from 'xlsx';

import { userPreferencesService, userService } from "src/services";

import { AccordionFilter, Button, CheckBox, Content, Input, Select, TabHeader } from "src/components";

import ITabs from "../../../../shared/utils/dropdown";

interface IFilter{
  filterStatus: object | any;
  filterSearch: string | any;
  orderBy: object | any;
  typeOrder: object | any;
}

interface ISafra{
  id: number;
  value: string;
  description: string;
  status: boolean;
}

interface IGenarateProps {
  name: string | undefined;
  title:  string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}
interface IData {
  data: ISafra[];
  totalItems: number;
  itensPerPage: number;
  filterAplication: object | any;
}

export default function Listagem({data, totalItems, itensPerPage, filterAplication}: IData) {
  const { tabs, tmgDropDown } = ITabs;

  const userLogado = JSON.parse(localStorage.getItem("user") as string);
  const preferences = userLogado.preferences.usuario;

  const [safras, setSafras] = useState<ISafra[]>(() => data);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsTotal, setTotaItems] = useState<number>(totalItems);
  const [arrowValue, setArrowValue] = useState<string>('');
  const [arrowDescription, setArrowDescription] = useState<string>('');
  const [managedFields, setManagedFields] = useState<string>(preferences.table_preferences);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  const [genaratesProps, setGenaratesProps] = useState<IGenarateProps[]>(() => [
    { name: "CamposGerenciados[]", title: "Safra", value: "safra"},
    { name: "CamposGerenciados[]", title: "Descrição", value: "description" },
    { name: "CamposGerenciados[]", title: "Status", value: "status" }
  ]);

  const filtersStatusItem = [
    { id: 2, name: 'Todos'},
    { id: 1, name: 'Ativos'},
    { id: 0, name: 'Inativos'},
  ];

  const take: number = itensPerPage;
  const total: number = itemsTotal;
  const pages = Math.ceil(total / take);

  const columns = columnsOrder(managedFields);

  const formik = useFormik<IFilter>({
    initialValues: {
      filterStatus: '',
      filterSearch: '',
      orderBy: '',
      typeOrder: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  function handleStatusSafra(id: number, status: any): void {
    if (status) {
      status = 1;
    } else {
      status = 0;
    }

    // Arrumar aqui !!!
    // userService.updateUsers({id: id, status: status}).then((response) => {
  
    // });
    const index = safras.findIndex((safra) => safra.id === id);

    if (index === -1) {
      return;
    }

    setSafras((oldSafra) => {
      const copy = [...oldSafra];
      copy[index].status = status;
      return copy;
    });
  };

  function columnsOrder(camposGerenciados: string) {
    let ObjetCampos: string[] = camposGerenciados.split(',');
    var arrOb: any = [];

    Object.keys(ObjetCampos).forEach((item, index) => {
      if (ObjetCampos[index] == 'safra') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              { arrowValue }
              <button className='font-medium text-gray-900' onClick={() => {} /*handleOrderName('value', item.value)*/}>
                Safra
              </button>
            </div>
          ),
          field: "value",
          sorting: false
        },);
      }
      if (ObjetCampos[index] == 'description') {
        arrOb.push({
          title: (
            <div className='flex items-center'>
              { arrowDescription }
              <button className='font-medium text-gray-900' onClick={() =>{} /*handleOrderEmail('description', item.description)*/}>
                Descrição
              </button>
            </div>
          ), 
          field: "email",
          sorting: false
        },);
      }
      if (ObjetCampos[index] == 'status') {
        arrOb.push({
          title: "Status",
          field: "status",
          sorting: false,
          searchable: false,
          filterPlaceholder: "Filtrar por status",
          render: (rowData: ISafra) => (
            <div className='h-10 flex'>
              <div className="h-10">
                <Button 
                  icon={<FaRegUserCircle size={16} />}
                  onClick={() =>{}}
                  bgColor="bg-yellow-500"
                  textColor="white"
                  href="perfil"
                />
              </div>
              <div className="h-10">
                <Button 
                  icon={<BiEdit size={16} />}
                  onClick={() =>{}}
                  bgColor="bg-blue-600"
                  textColor="white"
                  href={`/config/tmg/usuarios/atualizar-usuario?id=${rowData.id}`}
                />
              </div>
              rowData.status ? (
                <div className="h-10">
                  <Button 
                    icon={<FaRegThumbsUp size={16} />}
                    onClick={() => handleStatusSafra(
                      rowData.id, !rowData.status
                    )}
                    bgColor="bg-green-600"
                    textColor="white"
                  />
                </div>
              ) : (
                <div className="h-10">
                  <Button 
                    icon={<FaRegThumbsDown size={16} />}
                    onClick={() => handleStatusSafra(
                      rowData.id, !rowData.status
                    )}
                    bgColor="bg-red-800"
                    textColor="white"
                  />
                </div>
              )
            </div>
          ),
        })
      }
    });
    return arrOb;
  };

  function getValuesComluns(): void {
    var els:any = document.querySelectorAll("input[type='checkbox'");
    var selecionados = '';
    for (var i = 0; i < els.length; i++) {
      if (els[i].checked) {
        selecionados += els[i].value + ',';
      }
    } 
    var totalString = selecionados.length;
    let campos = selecionados.substr(0, totalString- 1)
    userLogado.preferences.usuario = {id: preferences.id, userId: preferences.userId, table_preferences: campos};
    userPreferencesService.updateUsersPreferences({table_preferences: campos, id: preferences.id });
    localStorage.setItem('user', JSON.stringify(userLogado));

    setStatusAccordion(false);

    setManagedFields(campos);
  };

  function handleOnDragEnd(result: DropResult) {
    setStatusAccordion(true);
    if (!result)  return;
    
    const items = Array.from(genaratesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);

    setGenaratesProps(items);
  };

  const downloadExcel = (): void => {
    if (filterAplication) {
      filterAplication += `&paramSelect=${managedFields}`;
    }
    
    userService.getAll(filterAplication).then((response) => {
      if (response.status == 200) {
        const newData = response.response.map((row: { status: any }) => {
          if (row.status === 0) {
            row.status = "Inativo";
          } else {
            row.status = "Ativo";
          }

          return row;
        });

        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "safras");
    
        // Buffer
        let buf = XLSX.write(workBook, {
          bookType: "csv", //xlsx
          type: "buffer",
        });
        // Binary
        XLSX.write(workBook, {
          bookType: "csv", //xlsx
          type: "binary",
        });
        // Download
        XLSX.writeFile(workBook, "Safras.csv");
      }
    });
  };
  
  return (
    <>
      <Head><title>Listagem de safras</title></Head>

      <Content headerCotent={
        <TabHeader data={tabs} dataDropDowns={tmgDropDown}  />
      }>
        <main className="h-full w-full
          flex flex-col
          items-start
          gap-8
        ">
          <AccordionFilter title="Filtrar safras">
              <div className='w-full flex gap-2'>
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
                  ">
                    <div className="h-10 w-1/2 ml-4">
                      <label className="block text-gray-900 text-sm font-bold mb-2">
                        Status
                      </label>
                      <Select name="filterStatus" onChange={formik.handleChange} values={filtersStatusItem.map(id => id)} selected={'1'} />
                    </div>
                    <div className="h-10 w-1/2 ml-4">
                      <label className="block text-gray-900 text-sm font-bold mb-2">
                        Pesquisar
                      </label>
                      <Input 
                        type="text" 
                        placeholder="safra"
                        max="40"
                        id="filterSearch"
                        name="filterSearch"
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>

                  <div className="h-16 w-32 mt-3">
                    <Button
                      onClick={() => {}}
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
                data={safras}
                options={{
                  showTitle: false,
                  headerStyle: {
                    zIndex: 20
                  },
                  // rowStyle: { background: '#f9fafb'},
                  search: false,
                  filtering: false,
                  pageSize: itensPerPage
                }}
                components={{
                  Toolbar: () => (
                    <div
                    className='w-full max-h-96	
                      flex
                      items-center
                      justify-between
                      gap-4
                      bg-gray-50
                      py-2
                      px-5
                      border-solid border-b
                      border-gray-200
                    '>
                      <div className='h-12'>
                        <Button 
                          title="Cadastrar uma safra"
                          value="Cadastrar uma safra"
                          bgColor="bg-blue-600"
                          textColor="white"
                          onClick={() => {}}
                          href="safra/cadastro"
                          icon={<MdDateRange size={20} />}
                        />
                      </div>

                      <strong className='text-blue-600'>Total registrado: { itemsTotal }</strong>

                      <div className='h-full flex items-center gap-2'>
                        <div className="border-solid border-2 border-blue-600 rounded">
                          <div className="w-64">
                            <AccordionFilter title='Gerenciar Campos' grid={statusAccordion}>
                              <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId='characters'>
                                  {
                                    (provided) => (
                                      <ul className="w-full h-full characters" { ...provided.droppableProps } ref={provided.innerRef}>
                                        {
                                          genaratesProps.map((genarate, index) => (
                                          <Draggable key={index} draggableId={String(genarate.title)} index={index}>
                                            {(provided) => (
                                              <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <CheckBox
                                                  name={genarate.name}
                                                  title={genarate.title?.toString()}
                                                  value={genarate.value}
                                                  defaultChecked={managedFields.includes(genarate.value as string)}
                                                />
                                              </li>
                                            )}
                                          </Draggable>
                                          ))
                                        }
                                        { provided.placeholder }
                                        <div className="h-8 mt-2">
                                          <Button value="Atualizar" bgColor='bg-blue-600' textColor='white' onClick={getValuesComluns} />
                                        </div>
                                      </ul>
                                    )
                                  }
                                </Droppable>
                              </DragDropContext>
                            </AccordionFilter>
                          </div>
                        </div>

                        <div className='h-12 flex items-center justify-center w-full'>
                        <Button icon={<RiFileExcel2Line size={20} />} bgColor='bg-blue-600' textColor='white' onClick={() => {downloadExcel()}} />
                        </div>
                      </div>
                    </div>
                  ),
                  Pagination: (props) => (
                    <>
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
                          <>
                              <Button
                                key={index}
                                onClick={() => setCurrentPage(index)}
                                value={`${currentPage + 1}`}
                                bgColor="bg-blue-600"
                                textColor="white"
                                disabled={true}
                              />
                          </>
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
                        disabled={currentPage + 1>= pages}
                      />
                    </div>
                    </>
                  ) as any
                }}
              />
            </div>
        </main>
      </Content>
    </>
  );
}
