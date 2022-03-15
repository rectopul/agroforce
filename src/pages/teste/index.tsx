import { GetServerSideProps } from 'next';
import getConfig from 'next/config';
import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useDrag } from 'react-dnd';

import { Content, TabHeader } from 'src/components';

import { tabs, dropDowns } from '../../utils/statics/tabs';

interface ITestesProps {
  id: number;
  avatar: string;
  name: string;
  email?: string;
  status?: number | boolean;
  telefone?: string;
}

interface IData {
  data: ITestesProps[];
}

export default function Teste({data}: IData) { 
  const [characters, setCharacters] = useState<ITestesProps[]>(() => data);

  function handleOnDragEnd(result: DropResult) {
    if (!result)  return;
    
    const items = Array.from(characters);
    const [reorderedItem] = items.slice(result.source.index, 1);
    items.slice(result.destination?.index, Number(reorderedItem));

    setCharacters(items);
  }

  return (
    <>
      <Content   headerCotent={  
        <TabHeader data={tabs} dataDropDowns={dropDowns} />
      }>
        <>
          <h1>Agroforce - TMG</h1>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId='characters'>
              {
                (provided) => (
                  <ul className="w-full h-full characters" { ...provided.droppableProps } ref={provided.innerRef}>
                    {
                      characters.map(({ id, name, avatar  }, index) => (
                        <Draggable key={id} draggableId={id.toString()} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <div className="w-full h-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={avatar} alt={name} />
                              </div>
                              <p>{name}</p>
                            </li>
                          )}
                        </Draggable>
                      ))
                    }
                    { provided.placeholder }
                  </ul>
                )
              }
            </Droppable>
          </DragDropContext>
        </>
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const  token  =  req.cookies.token;
  const { publicRuntimeConfig } = getConfig();
  const baseUrl = `${publicRuntimeConfig.apiUrl}/testes`;

  const urlParameters: any = new URL(baseUrl);

  const requestOptions = {
    method: 'GET',
    credentials: 'include',
    headers:  { Authorization: `Bearer ${token}` }
  } as RequestInit | undefined;

  const teste = await fetch(urlParameters.toString(), requestOptions);
  const data = await teste.json();

  console.log(data);

  return {
    props: {
      data,
    },
  }
}
