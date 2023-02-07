import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import {AccordionFilter} from "../AccordionFilter";
import {Button} from "../Button";
import {IoReloadSharp} from "react-icons/io5";
import {CheckBox} from "../CheckBox";
import {userPreferencesService} from "../../services";
import {useEffect, useState} from "react";

interface ManageFieldsProps {
  statusAccordionExpanded: boolean;
  generatesPropsDefault: IGenerateProps[];
  camposGerenciadosDefault: any;
  label?: string;
  preferences: any;
  userLogado: any;
  table: string;
  module_name: string;
  module_id: number;
  OnSetGeneratesProps: Function;
  OnSetCamposGerenciados: Function;
  OnColumnsOrder: Function;
  OnSetUserLogado: Function;
  OnSetPreferences: Function;
  OnChangeColumnsOrder?: Function;
}

interface IGenerateProps {
  name: string | undefined;
  title: string | number | readonly string[] | undefined;
  value: string | number | readonly string[] | undefined;
}

export function ManageFields(props: ManageFieldsProps) {
  
  // const [statusAccordion, setStatusAccordion] = useState<boolean>(props.statusAccordionExpanded);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(false);
  
  const [camposGerenciados, setCamposGerenciados] = useState<any>(props.preferences.table_preferences);

  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(props.generatesPropsDefault);

  const [userLogado, setUserLogado] = useState<any>(props.userLogado);
  
  const [preferences, setPreferences] = useState<any>(props.preferences);
  
  //
  // useEffect(() => {
  //  
  // }, [statusAccordion]);

  useEffect(() => {
    reordererGeneretesPros();
  }, [generatesProps]);
  
  useEffect(() => {
    console.log('ManageFields', 'camposGerenciados', camposGerenciados);
    props.OnColumnsOrder(camposGerenciados);
  }, [camposGerenciados]);

  function reordererGeneretesPros(){
    let campos_arr = camposGerenciados.split(',');
    const items = Array.from(generatesProps);
    // const [reorderedItem] = items.splice(result.source.index, 1);
    // const index: number = Number(result.destination?.index);
    //items.splice(index, 0, reorderedItem);
    
    const newItems = [];
    // iterate campos_arr
    for (let i = 0; i < campos_arr.length; i += 1) {
      // iterate items
      for (let j = 0; j < items.length; j += 1) {
        if (campos_arr[i] === items[j].value) {
          newItems.push(items[j]);
        }
      }
    }
    
    // ordena items.value por campos_arr
    items.sort((a, b) => {
      return campos_arr.indexOf(a.value) - campos_arr.indexOf(b.value);
    });
    
    console.log('reordererGeneretesPros', items, newItems);
    
  }
  
  // props.OnColumnsOrder(props.camposGerenciadosDefault);
  
  function handleOnDragEnd(result: DropResult): void {
    setStatusAccordion(true);
    if (!result) return;

    const items = Array.from(generatesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);
    setGeneratesProps(items);
    props.OnSetGeneratesProps(items);
  }

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll("input[type='checkbox'][data-table='tbl_"+props.table+"']");
    let selecionados = "";
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
          module_id: props.module_id,
        })
        .then((response) => {
          
          userLogado.preferences[props.module_name] = {
            id: response.response.id,
            userId: preferences.userId,
            table_preferences: campos,
          };
          
          preferences.id = response.response.id;
          
        });
      localStorage.setItem("user", JSON.stringify(userLogado));
    } else {
      userLogado.preferences[props.module_name] = {
        id: preferences.id,
        userId: preferences.userId,
        table_preferences: campos,
      };
      await userPreferencesService.update({
        table_preferences: campos,
        id: props.preferences.id,
      });
      localStorage.setItem("user", JSON.stringify(userLogado));
    }

    let preferences1 = userLogado.preferences[props.module_name];
    
    setStatusAccordion(false);
    setUserLogado(userLogado);
    setPreferences(preferences1);
    setCamposGerenciados(campos);
    
    console.log('ManageFields', 'getValuesColumns', campos);

    props.OnSetUserLogado(userLogado);
    props.OnSetPreferences(preferences1);
    props.OnSetCamposGerenciados(campos);
    
  }

  return (
    <div className="border-solid border-2 border-blue-600 rounded">
      <div className="w-72">
        {JSON.stringify(props.preferences.table_preferences)}
        {statusAccordion}
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
                      icon={<IoReloadSharp size={20}/>}
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
                            data-table={`tbl_${props.table}`}
                            name={generate.name}
                            title={generate.title?.toString()}
                            value={generate.value}
                            defaultChecked={camposGerenciados.includes(generate.value as string)}
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
  );
}