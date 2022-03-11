import { ReactNode } from "react";

import {
  Aside,
  MainHeader,
  Select
} from '../../components';

interface IContentProps {
  children: never[] | ReactNode;
  headerCotent: never[] | ReactNode;
}

interface IUsers {
  id: number,
  name: string,
  cpf: string,
  email: string,
  tel: string,
  avatar: string | ReactNode,
  status: boolean,
}

export function Content({ headerCotent, children }: IContentProps) {
  // const plantas = [ "Milho", "Algodão", "Soja" ];
  const safras = [{id: "03/19", name:"03/19" }, { id: "04/20", name: "03/21"}];
  const userLogado: IUsers | any = JSON.parse(localStorage.getItem('user') as string);
  return (
    <>
      <MainHeader
        name={userLogado.name}
        avatar="/images/person.jpg"

        headerSelects={
          <Select values={safras} selected={false}/>
        }
      >
        { headerCotent }
      </MainHeader>

      <div className='flex flex-row'>
        <Aside />
        <div className="flex flex-col
            w-container-all-main-contents
            h-content
            p-8

            border border-gray-700
            bg-gray-300
          ">
          { children }
        </div>
      </div>

    </>
  );
}
