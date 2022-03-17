import { ReactNode, useState } from "react";

import {
  Aside,
  MainHeader,
  Select2
} from '../../components';

interface IUsers {
  id: number,
  name: string,
  cpf: string,
  email: string,
  tel: string,
  avatar: string | ReactNode,
  status: boolean,
};
interface ICulturaProps {
  id: number;
  name: string | undefined;
};
interface IContentProps {
  // culturas: ICulturaProps[];
  headerCotent: ReactNode;
  children: ReactNode;
};

export function Content({ headerCotent, children }: IContentProps) {
  const [cultures, setCultures] = useState<ICulturaProps[]>(() => [
    { id: 1, name: "Milho"},
    { id: 2, name: "Algodão" },
    { id: 3, name: "Soja" }
  ]);

  // const safras = [{id: "03/19", name:"03/19" }, { id: "04/20", name: "03/21"}];
  const userLogado: IUsers | any = JSON.parse(localStorage.getItem('user') as string);

  return (
    <>
      <MainHeader
        name={userLogado.name}
        avatar={ userLogado.avatar }

        headerSelects={
          <Select2 data={cultures} selected={false}/>
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
