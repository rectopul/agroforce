
import { useEffect, ReactNode, useState } from "react";

import {
  Aside,
  MainHeader,
  Select
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
  const userLogado: IUsers | any = JSON.parse(localStorage.getItem('user') as string);
  const cultures: object | any = [];
  const [culturaSelecionada, setCulturaSelecionada] = useState<any>(userLogado.userCulture.cultura_selecionada);
  
  if (userLogado.userCulture.culturas[0]) {
    userLogado.userCulture.culturas.map((value: string | object | any) => {
      cultures.push({id: value.id, name: value.culture.name});
    })
  }

  useEffect(() => {
      userLogado.userCulture.cultura_selecionada =  parseInt(culturaSelecionada);
      localStorage.setItem('user', JSON.stringify(userLogado));
  }, [culturaSelecionada]);

  return (
    <>
      <MainHeader
        name={userLogado.name}
        avatar={ userLogado.avatar }

        headerSelects={
          <Select values={cultures}   onChange={e => setCulturaSelecionada(e.target.value)} selected={userLogado.userCulture.cultura_selecionada} />
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