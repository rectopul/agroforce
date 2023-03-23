import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import { IoReloadSharp, IoTrash } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { AccordionFilter } from '../AccordionFilter';
import { Button } from '../Button';
import { CheckBox } from '../CheckBox';
import { userPreferencesService } from '../../services';

interface IPreferences {
  id: number;
  userId?: number;
  table_preferences: string;
}

interface ManageFieldsProps {
  statusAccordionExpanded: boolean;
  generatesPropsDefault: IGenerateProps[];
  camposGerenciadosDefault: any;
  label?: string;
  preferences: IPreferences;
  preferencesDefault: IPreferences;
  userLogado: any;
  table: string;
  module_name: string;
  module_id: number;
  identifier_preference: string;
  OnSetStatusAccordion: Function;
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
  // console.log('🚀 ~ file: index.tsx:47 ~ ManageFields ~ identifier_preference:', props.identifier_preference);
  // console.log('🚀 ~ file: index.tsx:47 ~ ManageFields ~ props:', props);
  const router = useRouter();

  const { preferencesDefault } = props;

  // const [statusAccordion, setStatusAccordion] = useState<boolean>(props.statusAccordionExpanded);
  const [statusAccordion, setStatusAccordion] = useState<boolean>(props.statusAccordionExpanded);

  const [camposGerenciados, setCamposGerenciados] = useState<any>(props.preferences.table_preferences);

  const [generatesProps, setGeneratesProps] = useState<IGenerateProps[]>(props.generatesPropsDefault);

  const [userLogado, setUserLogado] = useState<any>(props.userLogado);

  const [preferences, setPreferences] = useState<any>(props.preferences);

  const [identifier_preference, setIdentifierPreference] = useState<string>(props.identifier_preference);

  useEffect(() => {
    //reorderGeneratedProps();
    //props.OnSetGeneratesProps(generatesProps);
  }, [camposGerenciados]);
  
  useEffect(() => {
    console.log('useEffect preferences', preferences);
    props.OnSetPreferences(preferences);
    reorderGeneratedPropsDefault();
  }, [preferences]);

  function reorderGeneratedPropsDefault() {
    const campos_arr = props.camposGerenciadosDefault.split(',');
    const items = Array.from(generatesProps);
    
    setGeneratesProps(items);
  }

  // useEffect(() => {
  // }, [statusAccordion]);

  // useEffect(() => {
  //   props.OnColumnsOrder(camposGerenciados);
  // }, [camposGerenciados]);

  function reorderGeneratedProps() {
    const campos_arr = camposGerenciados.split(',');
    const items = Array.from(generatesProps);
    // const [reorderedItem] = items.splice(result.source.index, 1);
    // const index: number = Number(result.destination?.index);
    // items.splice(index, 0, reorderedItem);

    const items_restantes = items;
    const newItems = [];
    // iterate campos_arr
    for (let i = 0; i < campos_arr.length; i += 1) {
      // iterate items
      for (let j = 0; j < items.length; j += 1) {
        if (campos_arr[i] === items[j].value) {
          newItems.push(items[j]);
          items_restantes.splice(j, 1);
        }
      }
    }

    for (let i = 0; i < items_restantes.length; i += 1) {
      newItems.push(items_restantes[i]);
    }
    setGeneratesProps(newItems);
  }

  function handleOnDragEnd(result: DropResult): void {
    setStatusAccordion(true);
    if (!result) return;

    const items = Array.from(generatesProps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const index: number = Number(result.destination?.index);
    items.splice(index, 0, reorderedItem);
    setGeneratesProps(items);
    // props.OnSetGeneratesProps(items);
    setStatusAccordion(true);
  }
  
  async function deleteAllPreferencesByUserAndModule() : Promise<void>{
    await userPreferencesService
      .getAll({
        userId: userLogado.id,
        route_usage: router.route,
        module_id: props.module_id,
      })
      .then((response) => {
        console.log('🚀 ~ file: index.tsx:47 ~ ManageFields ~ response:', response);
        if(response.status === 200){

          response.response.forEach(async (item: any) => {
            await userPreferencesService.deleted(item.id).then(({ statusD, responseD }) => {
              console.log('deleted', item, statusD, responseD);
            });
          });
          
        }
        
        
      });
  }

  async function clearPreferencesByUserAndModule(): Promise<void> {
    
    if (preferences.id === 0) {

      await deleteAllPreferencesByUserAndModule();
      return;
      
    }

    await userPreferencesService
      .deleted(preferences.id)
      .then(async ({ status, response }) => {
        if (status === 200) {

          await deleteAllPreferencesByUserAndModule();
          
          // simulação de exclusão de preferências
          preferences.id = 0;
          preferences.table_preferences = props.camposGerenciadosDefault;
          preferences.userId = userLogado.id;
          preferences.route_usage = router.route;
          userLogado.preferences[props.identifier_preference] = preferences;

          setPreferences(preferences);
          props.OnSetPreferences(preferences);

          setUserLogado(userLogado);
          props.OnSetUserLogado(userLogado);

          // camposGerenciados
          setCamposGerenciados(props.camposGerenciadosDefault);
          props.OnSetCamposGerenciados(props.camposGerenciadosDefault);

          localStorage.setItem('user', JSON.stringify(userLogado));

          reorderGeneratedProps();
          props.OnSetGeneratesProps(generatesProps);

          await userPreferencesService
            .create({
              table_preferences: props.camposGerenciadosDefault,
              userId: userLogado.id,
              route_usage: router.route,
              module_id: props.module_id,
              identifier_extra: props.identifier_preference,
            })
            .then((response) => {
              userLogado.preferences[props.identifier_preference] = {
                id: response.response.id,
                route_usage: router.route,
                userId: userLogado.id,
                table_preferences: props.camposGerenciadosDefault,
              };
              setPreferences(userLogado.preferences[props.identifier_preference]);
            });

          // getValuesColumns();

          /*
          preferencesDefault.userId = userLogado.id;
          delete userLogado.preferences[props.identifier_preference];
          userLogado.preferences[props.identifier_preference] = preferencesDefault;

          const preferences1 = userLogado.preferences[props.identifier_preference];
          setUserLogado(userLogado);
          setPreferences(preferencesDefault);
          props.OnSetUserLogado(userLogado);
          props.OnSetPreferences(preferencesDefault);
          localStorage.setItem('user', JSON.stringify(userLogado));

          getValuesColumns();/* */
        }
      })
      .catch((error) => {
        Swal.fire({
          title: 'Falha ao excluir preferências',
          html: `Ocorreu um erro ao excluir as preferências do usuário. Tente novamente mais tarde.\r\n${JSON.stringify(error)}`,
          width: '800',
        });
      });
  }

  async function getValuesColumns(): Promise<void> {
    const els: any = document.querySelectorAll(`ul[data-rbd-droppable-id='tbl_${props.table}'] input[type='checkbox']`);
    let selecionados = '';
    for (let i = 0; i < els.length; i += 1) {
      if (els[i].checked) {
        selecionados += `${els[i].value},`;
      }
    }
    const totalString = selecionados.length;
    const campos = selecionados.substr(0, totalString - 1);
    if (preferences.id === 0 || preferences.id === null) {
      await userPreferencesService
        .create({
          table_preferences: campos,
          userId: userLogado.id,
          route_usage: router.route,
          module_id: props.module_id,
          identifier_extra: props.identifier_preference,
        })
        .then((response) => {
          userLogado.preferences[props.identifier_preference] = {
            id: response.response.id,
            route_usage: router.route,
            userId: userLogado.id,
            table_preferences: campos,
            identifier_extra: props.identifier_preference,
          };
          
          setPreferences(userLogado.preferences[props.identifier_preference]);
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    } else {
      userLogado.preferences[props.identifier_preference] = {
        id: preferences.id,
        userId: preferences.userId,
        table_preferences: campos,
        identifier_extra: props.identifier_preference,
      };

      // verifica se existe alguma preferência salva no banco
      await userPreferencesService.getAll({ id: preferences.id })
        .then((response) => {

        })
        .catch((error) => {

        });

      const response = await userPreferencesService.update({
        id: preferences.id,
        table_preferences: campos,
        identifier_extra: props.identifier_preference,
      })
        .then((response) => {
          
          console.log("atualizar gerenciar campos:", response);
          
        })
        .catch((error) => {
          Swal.fire({
            title: 'Falha ao atualizar preferências',
            html: `Ocorreu um erro ao atualizar as preferências do usuário. Tente novamente mais tarde.\r\n${JSON.stringify(error)}`,
            width: '800',
          });
        });
      localStorage.setItem('user', JSON.stringify(userLogado));
    }

    const preferences1 = userLogado.preferences[props.identifier_preference];

    setUserLogado(userLogado);
    setPreferences(preferences1);
    setCamposGerenciados(campos);

    props.OnSetUserLogado(userLogado);
    props.OnSetPreferences(preferences1);
    props.OnSetCamposGerenciados(campos);
    // manda para o pai os generetesProps ao clicar em atualizar, pois finalizamos nossa ordenação;
    props.OnSetGeneratesProps(generatesProps);

    setStatusAccordion(false);
  }

  return (
    <div className="border-solid border-2 border-blue-600 rounded">
      <div className="w-72">
        {props.identifier_preference}<br/>
        {userLogado.preferences[props.identifier_preference]}
        <AccordionFilter
          title="Gerenciar Campos"
          grid={statusAccordion}
        >
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={`tbl_${props.table}`}>
              {(provided) => (
                <ul
                  className="w-full h-full characters"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  title={identifier_preference}
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

                  <div className="h-8 mb-3">
                    <Button
                      value="Limpar Preferências"
                      bgColor="bg-red-600"
                      textColor="white"
                      onClick={clearPreferencesByUserAndModule}
                      icon={<IoTrash size={20} />}
                    />
                  </div>

                  {generatesProps.map((generate, index) => (
                    <Draggable
                      key={String(generate.value)}
                      draggableId={String(generate.value)}
                      index={index}
                    >
                      {(provider) => (
                        <li
                          ref={provider.innerRef}
                          {...provider.draggableProps}
                          {...provider.dragHandleProps}
                        >
                          {/* {generate.value}::{camposGerenciados} */}

                          <CheckBox
                            name={generate.name}
                            title={generate.title?.toString()}
                            value={generate.value}
                            defaultChecked={camposGerenciados.split(',').indexOf(generate.value) > -1}
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

        {/* <span style={{fontSize:9}} className="w-30"> */}
        {/*  Preferences COMP: {JSON.stringify(props.preferences.table_preferences,null, 2)}<br/> */}
        {/*  Status Acordion COMP: {statusAccordion} */}
        {/* </span> */}

      </div>
    </div>
  );
}
